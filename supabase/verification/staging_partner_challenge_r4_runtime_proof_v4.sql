-- STAGING-ONLY VERIFICATION: PANSOFIE Partner Challenge R4 runtime proof v4
-- Do NOT place this file under supabase/migrations/. It is not a production migration.
-- Purpose: exercise governed RPCs with synthetic identities, assert security/product
-- boundaries, then clean every synthetic row in FK-safe order.

create temporary table r4_proof_ctx (
  key text primary key,
  value uuid not null
) on commit drop;

-- ---------------------------------------------------------------------------
-- Synthetic staging-only identities (.invalid) and baseline school context.
-- ---------------------------------------------------------------------------

with ins as (
  insert into auth.users (
    id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, is_sso_user, is_anonymous
  ) values (
    gen_random_uuid(), 'authenticated', 'authenticated', 'r4-proof-v4-admin@example.invalid',
    '{}'::jsonb, '{"full_name":"R4 Proof Admin"}'::jsonb, now(), now(), false, false
  ) returning id
)
insert into r4_proof_ctx(key, value) select 'admin_user', id from ins;

with ins as (
  insert into auth.users (
    id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, is_sso_user, is_anonymous
  ) values (
    gen_random_uuid(), 'authenticated', 'authenticated', 'r4-proof-v4-teacher@example.invalid',
    '{}'::jsonb, '{"full_name":"R4 Proof Teacher"}'::jsonb, now(), now(), false, false
  ) returning id
)
insert into r4_proof_ctx(key, value) select 'teacher_user', id from ins;

with ins as (
  insert into auth.users (
    id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, is_sso_user, is_anonymous
  ) values (
    gen_random_uuid(), 'authenticated', 'authenticated', 'r4-proof-v4-learner@example.invalid',
    '{}'::jsonb, '{"full_name":"R4 Proof Learner"}'::jsonb, now(), now(), false, false
  ) returning id
)
insert into r4_proof_ctx(key, value) select 'learner_user', id from ins;

with ins as (
  insert into auth.users (
    id, aud, role, email, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, is_sso_user, is_anonymous
  ) values (
    gen_random_uuid(), 'authenticated', 'authenticated', 'r4-proof-v4-partner@example.invalid',
    '{}'::jsonb, '{"full_name":"R4 Proof Partner"}'::jsonb, now(), now(), false, false
  ) returning id
)
insert into r4_proof_ctx(key, value) select 'partner_user', id from ins;

update public.user_roles
set role = 'admin'
where user_id = (select value from r4_proof_ctx where key = 'admin_user');

select set_config(
  'request.jwt.claim.sub',
  (select value::text from r4_proof_ctx where key = 'admin_user'),
  true
);

with ins as (
  insert into public.organizations (
    slug, name, organization_type, country_code, status, created_by
  ) values (
    'r4-proof-v4-school', 'R4 Proof V4 School', 'school', 'CZ', 'active',
    (select value from r4_proof_ctx where key = 'admin_user')
  ) returning id
)
insert into r4_proof_ctx(key, value) select 'school_org', id from ins;

insert into public.organization_memberships (
  organization_id, user_id, role, status, joined_at, created_by
) values
(
  (select value from r4_proof_ctx where key = 'school_org'),
  (select value from r4_proof_ctx where key = 'teacher_user'),
  'teacher', 'active', now(),
  (select value from r4_proof_ctx where key = 'admin_user')
),
(
  (select value from r4_proof_ctx where key = 'school_org'),
  (select value from r4_proof_ctx where key = 'learner_user'),
  'learner', 'active', now(),
  (select value from r4_proof_ctx where key = 'admin_user')
);

with ins as (
  insert into public.processing_basis_records (
    subject_user_id, organization_id, purpose_code, legal_basis,
    controller_scope, status, policy_version, source_note, recorded_by
  ) values (
    (select value from r4_proof_ctx where key = 'learner_user'),
    (select value from r4_proof_ctx where key = 'school_org'),
    'school_mission_assignment', 'public_task', 'organization', 'active',
    'r4-proof-v4', 'STAGING-ONLY R4 runtime proof v4',
    (select value from r4_proof_ctx where key = 'admin_user')
  ) returning id
)
insert into r4_proof_ctx(key, value) select 'processing_basis', id from ins;

-- ---------------------------------------------------------------------------
-- Admin registers + verifies the Partner in separate statements.
-- ---------------------------------------------------------------------------

with x as (
  select public.pansofie_admin_register_partner_organization(
    'r4-proof-v4-partner',
    'R4 Proof V4 Partner',
    'company',
    'r4-proof-v4-partner@example.invalid'
  ) as id
)
insert into r4_proof_ctx(key, value) select 'partner_org', id from x;

select public.pansofie_admin_set_partner_verification(
  (select value from r4_proof_ctx where key = 'partner_org'),
  'verified',
  'STAGING-ONLY runtime proof verification'
);

-- ---------------------------------------------------------------------------
-- Teacher creates governed cohort/team and adds the learner.
-- ---------------------------------------------------------------------------

select set_config(
  'request.jwt.claim.sub',
  (select value::text from r4_proof_ctx where key = 'teacher_user'),
  true
);

with x as (
  select public.pansofie_create_pilot_cohort(
    (select value from r4_proof_ctx where key = 'school_org'),
    'R4 Proof V4 Cohort',
    current_date,
    current_date + 56
  ) as id
)
insert into r4_proof_ctx(key, value) select 'cohort', id from x;

select public.pansofie_add_pilot_cohort_member(
  (select value from r4_proof_ctx where key = 'cohort'),
  (select value from r4_proof_ctx where key = 'learner_user'),
  'learner'
);

with x as (
  select public.pansofie_create_experience_team(
    (select value from r4_proof_ctx where key = 'cohort'),
    'R4 Proof V4 Team'
  ) as id
)
insert into r4_proof_ctx(key, value) select 'team', id from x;

select public.pansofie_add_experience_team_member(
  (select value from r4_proof_ctx where key = 'team'),
  (select value from r4_proof_ctx where key = 'learner_user'),
  'learner'
);

-- ---------------------------------------------------------------------------
-- Partner creates revision 1 and submits it.
-- ---------------------------------------------------------------------------

select set_config(
  'request.jwt.claim.sub',
  (select value::text from r4_proof_ctx where key = 'partner_user'),
  true
);

with x as (
  select public.pansofie_partner_create_challenge(
    (select value from r4_proof_ctx where key = 'partner_org'),
    'R4 Proof V4 Circular Challenge',
    'Provoz má zbytečný materiálový odpad, který chceme lépe pochopit.',
    'Firma, škola a lokální prostředí',
    'Mapování toku materiálu a návrh bezpečného prototypu zlepšení.',
    'Partner poskytne strukturovanou zpětnou vazbu k výstupu.'
  ) as id
)
insert into r4_proof_ctx(key, value) select 'challenge', id from x;

select public.pansofie_partner_update_challenge(
  (select value from r4_proof_ctx where key = 'challenge'),
  'R4 Proof V4 Circular Challenge',
  'Provoz má zbytečný materiálový odpad, který chceme lépe pochopit.',
  'Firma, škola a lokální prostředí',
  'Pouze provozní kontext bez osobních dat zákazníků nebo zaměstnanců.',
  'Mapování toku materiálu a návrh bezpečného prototypu zlepšení.',
  'Anonymizované množstevní údaje, vzorky bezpečných materiálů a konzultace.',
  'Pouze agregovaná provozní data; žádná osobní data.',
  13, 18,
  '3–4 týdny',
  'Výstup zůstává learner Experience; případné použití řešení vyžaduje samostatnou dohodu.',
  'Bez vstupu do rizikového provozu; partner komunikuje přes školu/PANSOFIE.',
  'Partner dá feedback do 7 dnů od předání výstupu.',
  'Dobré řešení lze po samostatném rozhodnutí otestovat v omezeném pilotu.'
);

select public.pansofie_partner_submit_challenge(
  (select value from r4_proof_ctx where key = 'challenge')
);

-- A partner must not be able to perform the admin Quality Gate.
do $$
begin
  begin
    perform public.pansofie_admin_screen_partner_challenge(
      (select value from r4_proof_ctx where key = 'challenge'),
      'ready',
      '{"educational_fit":"PASS","age_fit":"PASS","scope":"PASS","data_privacy":"PASS","safeguarding":"PASS","ip":"PASS","deliverable":"PASS","feedback_plan":"PASS","adoption_possibility":"PASS"}'::jsonb,
      'partner must not be able to screen'
    );
    raise exception 'R4_PROOF_V4_FAIL: partner unexpectedly screened its own Challenge';
  exception
    when others then
      if sqlerrm = 'R4_PROOF_V4_FAIL: partner unexpectedly screened its own Challenge' then raise; end if;
      if position('admin access required' in sqlerrm) = 0 then raise; end if;
  end;
end $$;

-- ---------------------------------------------------------------------------
-- Admin screens revision 1 as NEEDS_WORK.
-- ---------------------------------------------------------------------------

select set_config(
  'request.jwt.claim.sub',
  (select value::text from r4_proof_ctx where key = 'admin_user'),
  true
);

select public.pansofie_admin_screen_partner_challenge(
  (select value from r4_proof_ctx where key = 'challenge'),
  'needs_work',
  '{"educational_fit":"PASS","age_fit":"PASS","scope":"NEEDS_WORK","data_privacy":"PASS","safeguarding":"PASS","ip":"PASS","deliverable":"PASS","feedback_plan":"PASS","adoption_possibility":"PASS"}'::jsonb,
  'Scope needs a clearer boundary before matching.'
);

-- Screening evidence must be immutable even to the migration/session actor.
do $$
begin
  begin
    update public.partner_challenge_screenings
    set note = 'MUTATION MUST FAIL'
    where challenge_id = (select value from r4_proof_ctx where key = 'challenge')
      and challenge_revision = 1;
    raise exception 'R4_PROOF_V4_FAIL: screening evidence was mutable';
  exception
    when others then
      if sqlerrm = 'R4_PROOF_V4_FAIL: screening evidence was mutable' then raise; end if;
      if position('append-only' in sqlerrm) = 0 then raise; end if;
  end;
end $$;

-- ---------------------------------------------------------------------------
-- Partner revises and submits revision 2.
-- ---------------------------------------------------------------------------

select set_config(
  'request.jwt.claim.sub',
  (select value::text from r4_proof_ctx where key = 'partner_user'),
  true
);

select public.pansofie_partner_update_challenge(
  (select value from r4_proof_ctx where key = 'challenge'),
  'R4 Proof V4 Circular Challenge',
  'Provoz má zbytečný materiálový odpad; scope je omezený na jeden bezpečný materiálový tok.',
  'Firma, škola a lokální prostředí',
  'Jeden konkrétní, bezpečný materiálový tok. Žádná osobní data ani vstup do rizikové zóny.',
  'Změření toku, návrh variant a malý neprodukční prototyp.',
  'Agregovaná množstevní data, bezpečné vzorky materiálu a jedna moderovaná konzultace.',
  'Pouze agregovaná data bez osobních údajů.',
  13, 18,
  '3 týdny',
  'Learner output není automaticky převeden na partnera; další použití je samostatné rozhodnutí.',
  'Žádný nekontrolovaný adult→child kontakt; vše přes školu/PANSOFIE.',
  'Partner dá feedback k briefu a výstupu do 7 dnů.',
  'Pokud je výstup použitelný, partner může v R5 samostatně rozhodnout o pilotu.'
);

select public.pansofie_partner_submit_challenge(
  (select value from r4_proof_ctx where key = 'challenge')
);

-- ---------------------------------------------------------------------------
-- Admin marks revision 2 READY and proposes the managed match.
-- ---------------------------------------------------------------------------

select set_config(
  'request.jwt.claim.sub',
  (select value::text from r4_proof_ctx where key = 'admin_user'),
  true
);

select public.pansofie_admin_screen_partner_challenge(
  (select value from r4_proof_ctx where key = 'challenge'),
  'ready',
  '{"educational_fit":"PASS","age_fit":"PASS","scope":"PASS","data_privacy":"PASS","safeguarding":"PASS","ip":"PASS","deliverable":"PASS","feedback_plan":"PASS","adoption_possibility":"PASS"}'::jsonb,
  'Revision 2 satisfies the bounded R4 Quality Gate.'
);

with x as (
  select public.pansofie_admin_propose_challenge_assignment(
    (select value from r4_proof_ctx where key = 'challenge'),
    (select value from r4_proof_ctx where key = 'school_org'),
    (select value from r4_proof_ctx where key = 'cohort'),
    (select value from r4_proof_ctx where key = 'team')
  ) as id
)
insert into r4_proof_ctx(key, value) select 'assignment', id from x;

-- ---------------------------------------------------------------------------
-- Projection assertions: no learner-private fields leak to Partner.
-- ---------------------------------------------------------------------------

select set_config(
  'request.jwt.claim.sub',
  (select value::text from r4_proof_ctx where key = 'partner_user'),
  true
);

do $$
declare projected jsonb;
begin
  select to_jsonb(x) into projected
  from public.pansofie_list_my_partner_challenges() x
  where x.challenge_id = (select value from r4_proof_ctx where key = 'challenge');

  if projected is null then raise exception 'R4_PROOF_V4_FAIL: Partner projection missing'; end if;
  if projected ?| array['user_id','learner_id','learner_name','evidence','reflection','portfolio','passport'] then
    raise exception 'R4_PROOF_V4_FAIL: learner-private key leaked to Partner projection';
  end if;
  if projected->>'screening_decision' <> 'ready' then
    raise exception 'R4_PROOF_V4_FAIL: Partner projection did not expose READY state';
  end if;
end $$;

-- School must see the proposed assignment.
select set_config(
  'request.jwt.claim.sub',
  (select value::text from r4_proof_ctx where key = 'teacher_user'),
  true
);

do $$
declare cnt integer;
begin
  select count(*) into cnt
  from public.pansofie_list_school_challenge_assignments(
    array[(select value from r4_proof_ctx where key = 'school_org')]::uuid[]
  ) x
  where x.assignment_id = (select value from r4_proof_ctx where key = 'assignment')
    and x.assignment_status = 'proposed'
    and x.screening_decision = 'ready';

  if cnt <> 1 then raise exception 'R4_PROOF_V4_FAIL: School READY assignment projection mismatch'; end if;
end $$;

-- ---------------------------------------------------------------------------
-- Mission-version drift must fail closed. Inner exception block rolls back
-- the temporary Mission mutation + generated version before normal acceptance.
-- ---------------------------------------------------------------------------

do $$
begin
  begin
    update public.missions
    set safety_notes = coalesce(safety_notes, '') || ' [R4 PROOF V4 DRIFT]'
    where slug = 'circular-challenge';

    perform public.pansofie_school_accept_challenge_assignment(
      (select value from r4_proof_ctx where key = 'assignment')
    );

    raise exception 'R4_PROOF_V4_FAIL: Mission-version drift did not block acceptance';
  exception
    when others then
      if sqlerrm = 'R4_PROOF_V4_FAIL: Mission-version drift did not block acceptance' then raise; end if;
      if position('Mission version changed; managed assignment must be recreated' in sqlerrm) = 0 then raise; end if;
  end;
end $$;

-- Normal acceptance after drift rollback must bind exactly one learner run.
do $$
declare bound_count integer;
begin
  select public.pansofie_school_accept_challenge_assignment(
    (select value from r4_proof_ctx where key = 'assignment')
  ) into bound_count;
  if bound_count <> 1 then raise exception 'R4_PROOF_V4_FAIL: expected exactly one learner run, got %', bound_count; end if;
end $$;

-- ---------------------------------------------------------------------------
-- Runtime post-state assertions before cleanup.
-- ---------------------------------------------------------------------------

do $$
declare
  screening_count integer;
  run_count integer;
  premature_count integer;
begin
  select count(*) into screening_count
  from public.partner_challenge_screenings
  where challenge_id = (select value from r4_proof_ctx where key = 'challenge');
  if screening_count <> 2 then raise exception 'R4_PROOF_V4_FAIL: expected two immutable screening revisions'; end if;

  select count(*) into run_count
  from public.mission_runs
  where challenge_assignment_id = (select value from r4_proof_ctx where key = 'assignment')
    and user_id = (select value from r4_proof_ctx where key = 'learner_user')
    and status = 'assigned';
  if run_count <> 1 then raise exception 'R4_PROOF_V4_FAIL: Challenge provenance run mismatch'; end if;

  if not exists (
    select 1 from public.partner_challenges
    where id = (select value from r4_proof_ctx where key = 'challenge') and status = 'active'
  ) then raise exception 'R4_PROOF_V4_FAIL: Challenge did not become ACTIVE'; end if;

  if not exists (
    select 1 from public.partner_challenge_assignments
    where id = (select value from r4_proof_ctx where key = 'assignment') and status = 'active'
  ) then raise exception 'R4_PROOF_V4_FAIL: assignment did not become ACTIVE'; end if;

  select
    (select count(*) from public.experience_evidence e join public.mission_runs r on r.id=e.run_id where r.challenge_assignment_id=(select value from r4_proof_ctx where key='assignment'))
    + (select count(*) from public.experience_reflections f join public.mission_runs r on r.id=f.run_id where r.challenge_assignment_id=(select value from r4_proof_ctx where key='assignment'))
    + (select count(*) from public.experiences x join public.mission_runs r on r.id=x.run_id where r.challenge_assignment_id=(select value from r4_proof_ctx where key='assignment'))
  into premature_count;

  if premature_count <> 0 then raise exception 'R4_PROOF_V4_FAIL: acceptance created premature learner evidence/reflection/Experience'; end if;
end $$;

-- ---------------------------------------------------------------------------
-- Cleanup. FK/event order is deliberate:
-- processing_basis_events -> processing_basis_records.
-- Immutable Partner evidence triggers are disabled only for this controlled
-- staging cleanup and are re-enabled in the same transaction.
-- ---------------------------------------------------------------------------

delete from public.mission_runs
where challenge_assignment_id = (select value from r4_proof_ctx where key = 'assignment')
   or (user_id = (select value from r4_proof_ctx where key = 'learner_user')
       and team_id = (select value from r4_proof_ctx where key = 'team'));

delete from public.partner_challenge_assignments
where id = (select value from r4_proof_ctx where key = 'assignment');

alter table public.partner_challenge_screenings disable trigger partner_challenge_screenings_immutable;
delete from public.partner_challenge_screenings
where challenge_id = (select value from r4_proof_ctx where key = 'challenge');
alter table public.partner_challenge_screenings enable trigger partner_challenge_screenings_immutable;

delete from public.partner_challenges
where id = (select value from r4_proof_ctx where key = 'challenge');

alter table public.partner_organization_verification_events disable trigger partner_verification_events_immutable;
delete from public.partner_organization_verification_events
where organization_id = (select value from r4_proof_ctx where key = 'partner_org');
alter table public.partner_organization_verification_events enable trigger partner_verification_events_immutable;

delete from public.experience_team_members
where team_id = (select value from r4_proof_ctx where key = 'team');

delete from public.experience_teams
where id = (select value from r4_proof_ctx where key = 'team');

delete from public.pilot_cohorts
where id = (select value from r4_proof_ctx where key = 'cohort');

-- Required cleanup order: events first, record second.
delete from public.processing_basis_events
where processing_basis_id = (select value from r4_proof_ctx where key = 'processing_basis');

delete from public.processing_basis_records
where id = (select value from r4_proof_ctx where key = 'processing_basis');

delete from public.organization_memberships
where organization_id in (
  (select value from r4_proof_ctx where key = 'school_org'),
  (select value from r4_proof_ctx where key = 'partner_org')
);

delete from public.organizations
where id in (
  (select value from r4_proof_ctx where key = 'school_org'),
  (select value from r4_proof_ctx where key = 'partner_org')
);

delete from public.user_roles
where user_id in (select value from r4_proof_ctx where key like '%_user');

delete from public.profiles
where id in (select value from r4_proof_ctx where key like '%_user');

delete from auth.users
where id in (select value from r4_proof_ctx where key like '%_user');

-- ---------------------------------------------------------------------------
-- Zero-residue assertions.
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (select 1 from auth.users where email like 'r4-proof-v4-%@example.invalid') then
    raise exception 'R4_PROOF_V4_FAIL: synthetic auth user residue';
  end if;
  if exists (select 1 from public.organizations where slug in ('r4-proof-v4-school','r4-proof-v4-partner')) then
    raise exception 'R4_PROOF_V4_FAIL: synthetic organization residue';
  end if;
  if exists (select 1 from public.pilot_cohorts where name = 'R4 Proof V4 Cohort') then
    raise exception 'R4_PROOF_V4_FAIL: synthetic cohort residue';
  end if;
  if exists (select 1 from public.experience_teams where name = 'R4 Proof V4 Team') then
    raise exception 'R4_PROOF_V4_FAIL: synthetic team residue';
  end if;
  if exists (select 1 from public.partner_challenges where title = 'R4 Proof V4 Circular Challenge') then
    raise exception 'R4_PROOF_V4_FAIL: synthetic Challenge residue';
  end if;
  if exists (select 1 from public.processing_basis_records where policy_version = 'r4-proof-v4') then
    raise exception 'R4_PROOF_V4_FAIL: synthetic processing basis residue';
  end if;
end $$;

-- If this verification source completes successfully, the staging runtime proof
-- has passed and left no persistent synthetic application data.