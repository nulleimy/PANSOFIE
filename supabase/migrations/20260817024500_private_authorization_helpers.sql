-- PANSOFIE staging privacy/security hardening.
--
-- Generic authorization predicates need to inspect other users while evaluating
-- RLS and governed business RPCs, but they do not need to be directly exposed
-- as PostgREST RPC endpoints. Move the privileged implementation to a private,
-- non-exposed schema and keep only bounded business actions in public.

create schema if not exists pansofie_private;
revoke all on schema pansofie_private from public;
revoke all on schema pansofie_private from anon;
grant usage on schema pansofie_private to authenticated, service_role;

create or replace function pansofie_private.is_active_org_member(
  target_org_id uuid,
  allowed_roles text[] default null,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships m
    where m.organization_id = target_org_id
      and m.user_id = target_user_id
      and m.status = 'active'
      and (allowed_roles is null or m.role = any(allowed_roles))
  );
$$;

create or replace function pansofie_private.is_verified_guardian(
  target_child_user_id uuid,
  target_guardian_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.guardian_relationships g
    where g.child_user_id = target_child_user_id
      and g.guardian_user_id = target_guardian_user_id
      and g.status = 'verified'
  );
$$;

create or replace function pansofie_private.has_processing_basis(
  target_subject_user_id uuid,
  target_org_id uuid,
  target_purpose_code text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.processing_basis_records p
    where p.subject_user_id = target_subject_user_id
      and p.purpose_code = target_purpose_code
      and p.status = 'active'
      and (p.expires_at is null or p.expires_at > now())
      and (
        p.organization_id = target_org_id
        or (p.organization_id is null and target_org_id is null)
      )
  );
$$;

revoke all on function pansofie_private.is_active_org_member(uuid, text[], uuid) from public, anon;
revoke all on function pansofie_private.is_verified_guardian(uuid, uuid) from public, anon;
revoke all on function pansofie_private.has_processing_basis(uuid, uuid, text) from public, anon;
grant execute on function pansofie_private.is_active_org_member(uuid, text[], uuid) to authenticated, service_role;
grant execute on function pansofie_private.is_verified_guardian(uuid, uuid) to authenticated, service_role;
grant execute on function pansofie_private.has_processing_basis(uuid, uuid, text) to authenticated, service_role;

-- Caller-specific review predicates remain public because they expose only the
-- current caller's authorization result. Their internal arbitrary-user checks
-- now use private helpers.
create or replace function public.pansofie_can_review_run(
  target_run_id uuid,
  target_purpose_code text
)
returns boolean
language sql
stable
security definer
set search_path = public, pansofie_private
as $$
  select exists (
    select 1
    from public.mission_runs r
    where r.id = target_run_id
      and r.organization_id is not null
      and pansofie_private.is_active_org_member(
        r.organization_id,
        array['teacher', 'coordinator']::text[],
        auth.uid()
      )
      and pansofie_private.is_active_org_member(
        r.organization_id,
        array['learner']::text[],
        r.user_id
      )
      and pansofie_private.has_processing_basis(
        r.user_id,
        r.organization_id,
        target_purpose_code
      )
  );
$$;

create or replace function public.pansofie_can_guardian_view_passport(
  target_child_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pansofie_private
as $$
  select pansofie_private.is_verified_guardian(target_child_user_id, auth.uid())
    and pansofie_private.has_processing_basis(
      target_child_user_id,
      null,
      'guardian_passport_view'
    );
$$;

-- The assignment RPC intentionally remains public/authenticated, but all
-- arbitrary-user authorization checks happen through the private predicates.
create or replace function public.pansofie_assign_school_mission(
  target_mission_id uuid,
  target_learner_id uuid,
  target_org_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public, pansofie_private
as $$
declare
  caller_id uuid := auth.uid();
  existing_run_id uuid;
  new_run_id uuid;
begin
  if caller_id is null then
    raise exception 'authentication required';
  end if;

  if not pansofie_private.is_active_org_member(
    target_org_id,
    array['teacher', 'coordinator']::text[],
    caller_id
  ) and not public.is_admin() then
    raise exception 'teacher/coordinator membership required';
  end if;

  if not pansofie_private.is_active_org_member(
    target_org_id,
    array['learner']::text[],
    target_learner_id
  ) then
    raise exception 'target learner must be active in organization';
  end if;

  if not pansofie_private.has_processing_basis(
    target_learner_id,
    target_org_id,
    'school_mission_assignment'
  ) then
    raise exception 'school_mission_assignment processing basis required';
  end if;

  if not exists (
    select 1 from public.missions m
    where m.id = target_mission_id
      and m.status = 'published'
  ) and not public.is_admin() then
    raise exception 'only published missions can be assigned';
  end if;

  select r.id into existing_run_id
  from public.mission_runs r
  where r.mission_id = target_mission_id
    and r.user_id = target_learner_id
    and r.organization_id = target_org_id
    and r.status in ('assigned', 'in_progress', 'submitted')
  order by r.created_at desc
  limit 1;

  if existing_run_id is not null then
    return existing_run_id;
  end if;

  insert into public.mission_runs (
    mission_id,
    user_id,
    organization_id,
    assigned_by,
    status
  ) values (
    target_mission_id,
    target_learner_id,
    target_org_id,
    caller_id,
    'assigned'
  ) returning id into new_run_id;

  return new_run_id;
end;
$$;

-- Rewrite direct RLS references to the private predicates.
drop policy if exists "organizations_select_member_or_admin" on public.organizations;
create policy "organizations_select_member_or_admin"
  on public.organizations for select
  to authenticated
  using (
    public.is_admin()
    or pansofie_private.is_active_org_member(id, null::text[], auth.uid())
  );

drop policy if exists "organization_memberships_select_scoped" on public.organization_memberships;
create policy "organization_memberships_select_scoped"
  on public.organization_memberships for select
  to authenticated
  using (
    public.is_admin()
    or user_id = auth.uid()
    or pansofie_private.is_active_org_member(
      organization_id,
      array['teacher', 'coordinator']::text[],
      auth.uid()
    )
  );

drop policy if exists "age_assurance_select_subject_guardian_admin" on public.age_assurance_records;
create policy "age_assurance_select_subject_guardian_admin"
  on public.age_assurance_records for select
  to authenticated
  using (
    public.is_admin()
    or subject_user_id = auth.uid()
    or pansofie_private.is_verified_guardian(subject_user_id, auth.uid())
  );

drop policy if exists "processing_basis_select_subject_guardian_admin" on public.processing_basis_records;
create policy "processing_basis_select_subject_guardian_admin"
  on public.processing_basis_records for select
  to authenticated
  using (
    public.is_admin()
    or subject_user_id = auth.uid()
    or pansofie_private.is_verified_guardian(subject_user_id, auth.uid())
  );

drop policy if exists "processing_basis_events_select_subject_guardian_admin" on public.processing_basis_events;
create policy "processing_basis_events_select_subject_guardian_admin"
  on public.processing_basis_events for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.processing_basis_records p
      where p.id = processing_basis_id
        and (
          p.subject_user_id = auth.uid()
          or pansofie_private.is_verified_guardian(p.subject_user_id, auth.uid())
        )
    )
  );

drop policy if exists "mission_runs_insert_school_assignment" on public.mission_runs;
create policy "mission_runs_insert_school_assignment"
  on public.mission_runs for insert
  to authenticated
  with check (
    organization_id is not null
    and assigned_by = auth.uid()
    and pansofie_private.is_active_org_member(
      organization_id,
      array['teacher', 'coordinator']::text[],
      auth.uid()
    )
    and pansofie_private.is_active_org_member(
      organization_id,
      array['learner']::text[],
      user_id
    )
    and pansofie_private.has_processing_basis(
      user_id,
      organization_id,
      'school_mission_assignment'
    )
  );

-- Generic arbitrary-target predicates are no longer client RPCs. They remain
-- in public temporarily for compatibility with trusted server/admin code, but
-- authenticated/anon/PUBLIC cannot execute them.
revoke execute on function public.pansofie_is_active_org_member(uuid, text[], uuid) from authenticated, anon, public;
revoke execute on function public.pansofie_is_verified_guardian(uuid, uuid) from authenticated, anon, public;
revoke execute on function public.pansofie_has_processing_basis(uuid, uuid, text) from authenticated, anon, public;

comment on schema pansofie_private
  is 'Non-PostgREST authorization helpers used by RLS and governed public RPCs.';
comment on function pansofie_private.is_active_org_member(uuid, text[], uuid)
  is 'Private arbitrary-user membership predicate. Not exposed as a public RPC.';
comment on function pansofie_private.is_verified_guardian(uuid, uuid)
  is 'Private guardian relationship predicate. Not exposed as a public RPC.';
comment on function pansofie_private.has_processing_basis(uuid, uuid, text)
  is 'Private purpose-specific processing-basis predicate. Not exposed as a public RPC.';
