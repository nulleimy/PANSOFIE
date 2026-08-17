-- PANSOFIE STAGING ROLE MATRIX R2
-- Staging-only verification. Creates synthetic auth identities, exercises RLS/RPC
-- boundaries and the complete School Experience golden path, then removes every
-- fixture row under a temporary fixture-admin identity.
-- Run only on an isolated disposable staging project after all schema migrations.

-- Fixed synthetic fixture IDs.
-- teacher  10000000-0000-4000-8000-000000000001
-- learnerA 20000000-0000-4000-8000-000000000001
-- learnerB 20000000-0000-4000-8000-000000000002
-- guardian 30000000-0000-4000-8000-000000000001
-- outsider 40000000-0000-4000-8000-000000000001
-- school    50000000-0000-4000-8000-000000000001
-- mission   60000000-0000-4000-8000-000000000001
-- guardian relationship 70000000-0000-4000-8000-000000000001

-- Anonymous callers must have no EXECUTE on public SECURITY DEFINER functions.
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as fn
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and (p.proname = 'is_admin' or p.proname = 'handle_new_user' or p.proname like 'pansofie_%')
  loop
    if has_function_privilege('anon', r.fn, 'EXECUTE') then
      raise exception 'anon EXECUTE still allowed on %', r.fn;
    end if;
  end loop;
end $$;

-- Generic authorization predicates are internal RLS implementation details and
-- must not be callable directly by browser-authenticated users.
do $$
declare
  fn regprocedure;
begin
  foreach fn in array array[
    'public.is_admin()'::regprocedure,
    'public.pansofie_is_active_org_member(uuid,text[],uuid)'::regprocedure,
    'public.pansofie_is_verified_guardian(uuid,uuid)'::regprocedure,
    'public.pansofie_has_processing_basis(uuid,uuid,text)'::regprocedure,
    'public.pansofie_can_review_run(uuid,text)'::regprocedure,
    'public.pansofie_can_review_experience(uuid,text)'::regprocedure,
    'public.pansofie_can_guardian_view_passport(uuid)'::regprocedure
  ]
  loop
    if has_function_privilege('authenticated', fn, 'EXECUTE') then
      raise exception 'generic predicate remains browser-callable: %', fn;
    end if;
  end loop;
end $$;

-- Governed business RPCs intentionally remain callable by authenticated users;
-- their internal authorization rules are exercised below.
do $$
declare
  fn regprocedure;
begin
  foreach fn in array array[
    'public.pansofie_assign_school_mission(uuid,uuid,uuid)'::regprocedure,
    'public.pansofie_start_mission(uuid)'::regprocedure,
    'public.pansofie_submit_mission(uuid)'::regprocedure,
    'public.pansofie_review_school_run(uuid,text,text,text)'::regprocedure,
    'public.pansofie_finalize_school_experience(uuid)'::regprocedure
  ]
  loop
    if not has_function_privilege('authenticated', fn, 'EXECUTE') then
      raise exception 'governed business RPC unavailable: %', fn;
    end if;
  end loop;
end $$;

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  is_sso_user, is_anonymous
) values
('10000000-0000-4000-8000-000000000001','authenticated','authenticated','teacher@pansofie-fixture.invalid','',now(),'{}','{"full_name":"Fixture Teacher"}',now(),now(),false,false),
('20000000-0000-4000-8000-000000000001','authenticated','authenticated','learner-a@pansofie-fixture.invalid','',now(),'{}','{"full_name":"Fixture Learner A"}',now(),now(),false,false),
('20000000-0000-4000-8000-000000000002','authenticated','authenticated','learner-b@pansofie-fixture.invalid','',now(),'{}','{"full_name":"Fixture Learner B"}',now(),now(),false,false),
('30000000-0000-4000-8000-000000000001','authenticated','authenticated','guardian@pansofie-fixture.invalid','',now(),'{}','{"full_name":"Fixture Guardian"}',now(),now(),false,false),
('40000000-0000-4000-8000-000000000001','authenticated','authenticated','outsider@pansofie-fixture.invalid','',now(),'{}','{"full_name":"Fixture Outsider"}',now(),now(),false,false);

insert into public.organizations (id, slug, name, organization_type, status, created_by)
values ('50000000-0000-4000-8000-000000000001','fixture-school-r2','PANSOFIE Fixture School','school','active','10000000-0000-4000-8000-000000000001');

insert into public.organization_memberships (organization_id,user_id,role,status,joined_at,created_by) values
('50000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','teacher','active',now(),'10000000-0000-4000-8000-000000000001'),
('50000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','learner','active',now(),'10000000-0000-4000-8000-000000000001'),
('50000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','learner','active',now(),'10000000-0000-4000-8000-000000000001');

insert into public.missions (
  id,slug,title,summary,why,program_id,lab_id,path_ids,status,
  evidence_prompt,reflection_prompt,transfer_prompt,contribution_prompt
) values (
  '60000000-0000-4000-8000-000000000001','fixture-circular-r2','Fixture Circular Challenge',
  'Synthetic staging mission','Validate governed Experience flow','school','challenge',array['priroda-udrzitelnost'],'published',
  'Dolož práci','Co ses naučil/a?','Kam zkušenost přeneseš?','Jaký byl přínos?'
);

insert into public.processing_basis_records (
  subject_user_id, organization_id, purpose_code, legal_basis,
  controller_scope, status, policy_version, source_note
)
select '20000000-0000-4000-8000-000000000001',
       '50000000-0000-4000-8000-000000000001', purpose,
       'public_task','organization','active','fixture-r2','staging verification only'
from unnest(array[
  'school_program_participation',
  'school_mission_assignment',
  'school_mission_review',
  'school_evidence_review',
  'school_passport_review'
]) as purpose;

insert into public.guardian_relationships (
  id, child_user_id, guardian_user_id, relationship_kind, status,
  verification_method, verified_by, verified_at, evidence
) values (
  '70000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001',
  'parental_responsibility_holder','verified','manual_admin',
  '10000000-0000-4000-8000-000000000001',now(),'{"fixture":true}'
);

-- Teacher: valid assignment to learner A.
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
select set_config('request.jwt.claim.role','authenticated',true);
select public.pansofie_assign_school_mission(
  '60000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '50000000-0000-4000-8000-000000000001'
);

-- Teacher: learner B lacks assignment basis, so assignment must fail.
do $$
declare denied boolean := false;
begin
  begin
    perform public.pansofie_assign_school_mission(
      '60000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000002',
      '50000000-0000-4000-8000-000000000001'
    );
  exception when others then denied := true;
  end;
  if not denied then raise exception 'assignment without exact processing basis was allowed'; end if;
end $$;

-- Learner A starts and authors evidence/reflection.
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',true);
select public.pansofie_start_mission((
  select id from public.mission_runs
  where mission_id='60000000-0000-4000-8000-000000000001'
    and user_id='20000000-0000-4000-8000-000000000001'
));

insert into public.experience_evidence (run_id,owner_id,kind,description)
select id,'20000000-0000-4000-8000-000000000001','note','Fixture evidence v1'
from public.mission_runs
where mission_id='60000000-0000-4000-8000-000000000001'
  and user_id='20000000-0000-4000-8000-000000000001';

insert into public.experience_reflections (
  run_id,user_id,what_happened,what_worked,what_failed,what_learned,transfer,contribution
)
select id,'20000000-0000-4000-8000-000000000001','Fixture action','Teamwork','First attempt','Evidence matters','Another mission','Local contribution'
from public.mission_runs
where mission_id='60000000-0000-4000-8000-000000000001'
  and user_id='20000000-0000-4000-8000-000000000001';

select public.pansofie_submit_mission((
  select id from public.mission_runs
  where mission_id='60000000-0000-4000-8000-000000000001'
    and user_id='20000000-0000-4000-8000-000000000001'
));

-- Submitted content must be frozen.
do $$
declare denied boolean := false;
begin
  begin
    insert into public.experience_evidence(run_id,owner_id,kind,description)
    select id,'20000000-0000-4000-8000-000000000001','note','Must be rejected'
    from public.mission_runs
    where mission_id='60000000-0000-4000-8000-000000000001'
      and user_id='20000000-0000-4000-8000-000000000001';
  exception when others then denied := true;
  end;
  if not denied then raise exception 'submitted evidence remained mutable'; end if;
end $$;

-- Learner cannot self-finalize.
do $$
declare denied boolean := false; rid uuid;
begin
  select id into rid from public.mission_runs
  where mission_id='60000000-0000-4000-8000-000000000001'
    and user_id='20000000-0000-4000-8000-000000000001';
  begin perform public.pansofie_finalize_school_experience(rid);
  exception when others then denied := true; end;
  if not denied then raise exception 'learner self-finalization was allowed'; end if;
end $$;

-- Learner B and outsider cannot see learner A's run.
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000002',true);
do $$ begin
  if exists (select 1 from public.mission_runs where user_id='20000000-0000-4000-8000-000000000001') then
    raise exception 'learner B can see learner A run';
  end if;
end $$;
select set_config('request.jwt.claim.sub','40000000-0000-4000-8000-000000000001',true);
do $$ begin
  if exists (select 1 from public.mission_runs where user_id='20000000-0000-4000-8000-000000000001') then
    raise exception 'unrelated account can see learner A run';
  end if;
end $$;

-- Teacher has evidence purpose but deliberately lacks reflection purpose.
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
do $$
declare rid uuid; reflection_count int; evidence_count int; denied boolean := false;
begin
  select id into rid from public.mission_runs
  where mission_id='60000000-0000-4000-8000-000000000001'
    and user_id='20000000-0000-4000-8000-000000000001';
  if rid is null then raise exception 'teacher cannot see purpose-authorized run'; end if;
  select count(*) into evidence_count from public.experience_evidence where run_id=rid;
  if evidence_count < 1 then raise exception 'teacher evidence purpose did not expose evidence'; end if;
  select count(*) into reflection_count from public.experience_reflections where run_id=rid;
  if reflection_count <> 0 then raise exception 'evidence purpose leaked reflection'; end if;
  begin perform public.pansofie_review_school_run(rid,'reflection','confirmed','must fail');
  exception when others then denied := true; end;
  if not denied then raise exception 'reflection review allowed without reflection purpose'; end if;
end $$;

-- Establish positive reviews then reopen; stale positive decisions must reset.
select public.pansofie_review_school_run((select id from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001'),'evidence','confirmed','fixture evidence confirmed');
select public.pansofie_review_school_run((select id from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001'),'mission','confirmed','fixture mission confirmed');
select public.pansofie_review_school_run((select id from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001'),'mission','needs_revision','please revise');

do $$
declare rid uuid;
begin
  select id into rid from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001';
  if (select status from public.mission_runs where id=rid) <> 'in_progress' then raise exception 'needs_revision did not reopen run'; end if;
  if exists (select 1 from public.experience_reviews where run_id=rid and status='confirmed') then raise exception 'stale confirmed review survived reopening'; end if;
end $$;

-- Learner may edit again after governed reopening, then resubmit.
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',true);
insert into public.experience_evidence (run_id,owner_id,kind,description)
select id,'20000000-0000-4000-8000-000000000001','note','Fixture evidence v2 after revision'
from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001';
update public.experience_reflections set what_learned='Revised learning after feedback'
where user_id='20000000-0000-4000-8000-000000000001';
select public.pansofie_submit_mission((select id from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001'));

-- Fresh teacher confirmation and finalization.
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
select public.pansofie_review_school_run((select id from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001'),'mission','confirmed','fresh confirmation');
select public.pansofie_finalize_school_experience((select id from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001'));

do $$
declare rid uuid;
begin
  select id into rid from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001' and user_id='20000000-0000-4000-8000-000000000001';
  if (select status from public.mission_runs where id=rid) <> 'completed' then raise exception 'finalization did not complete run'; end if;
  if (select count(*) from public.experiences where run_id=rid) <> 1 then raise exception 'expected exactly one Experience'; end if;
  if (select count(*) from public.portfolio_items p join public.experiences e on e.id=p.experience_id where e.run_id=rid and p.visibility='private') <> 1 then raise exception 'expected one private Passport item'; end if;
  if (select count(*) from public.experience_review_events where run_id=rid) < 4 then raise exception 'review event history not preserved'; end if;
end $$;

-- Learner cannot manufacture Passport verification.
select set_config('request.jwt.claim.sub','20000000-0000-4000-8000-000000000001',true);
update public.portfolio_items
set verified_by='20000000-0000-4000-8000-000000000001', verified_at=now()
where user_id='20000000-0000-4000-8000-000000000001';
do $$ begin
  if exists (select 1 from public.portfolio_items where user_id='20000000-0000-4000-8000-000000000001' and verified_by is not null) then
    raise exception 'learner self-verification was persisted';
  end if;
end $$;

-- Guardian relationship alone grants no Experience/Passport/raw-content view.
select set_config('request.jwt.claim.sub','30000000-0000-4000-8000-000000000001',true);
do $$ begin
  if exists (select 1 from public.experiences where user_id='20000000-0000-4000-8000-000000000001') then raise exception 'guardian relationship alone exposed Experience'; end if;
  if exists (select 1 from public.portfolio_items where user_id='20000000-0000-4000-8000-000000000001') then raise exception 'guardian relationship alone exposed Passport'; end if;
  if exists (select 1 from public.experience_evidence where owner_id='20000000-0000-4000-8000-000000000001') then raise exception 'guardian exposed raw evidence'; end if;
  if exists (select 1 from public.experience_reflections where user_id='20000000-0000-4000-8000-000000000001') then raise exception 'guardian exposed raw reflection'; end if;
end $$;

-- Add exact guardian Passport basis as trusted staging setup.
reset role;
insert into public.processing_basis_records (
  subject_user_id,organization_id,purpose_code,legal_basis,controller_scope,status,
  policy_version,consent_actor_type,authorized_by_user_id,guardian_relationship_id,
  consent_recorded_at,source_note
) values (
  '20000000-0000-4000-8000-000000000001',null,'guardian_passport_view','consent','pansofie','active',
  'fixture-r2','guardian','30000000-0000-4000-8000-000000000001','70000000-0000-4000-8000-000000000001',
  now(),'staging verification only'
);

set local role authenticated;
select set_config('request.jwt.claim.sub','30000000-0000-4000-8000-000000000001',true);
do $$ begin
  if (select count(*) from public.experiences where user_id='20000000-0000-4000-8000-000000000001') <> 1 then raise exception 'guardian Passport basis did not expose completed Experience'; end if;
  if (select count(*) from public.portfolio_items where user_id='20000000-0000-4000-8000-000000000001') <> 1 then raise exception 'guardian Passport basis did not expose Passport'; end if;
  if exists (select 1 from public.experience_evidence where owner_id='20000000-0000-4000-8000-000000000001') then raise exception 'guardian Passport basis leaked evidence'; end if;
  if exists (select 1 from public.experience_reflections where user_id='20000000-0000-4000-8000-000000000001') then raise exception 'guardian Passport basis leaked reflection'; end if;
end $$;

-- Cleanup under fixture admin so immutable completed evidence can be removed.
reset role;
update public.user_roles set role='admin' where user_id='10000000-0000-4000-8000-000000000001';
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);

delete from public.experience_review_events where run_id in (select id from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001');
delete from public.experience_reviews where run_id in (select id from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001');
delete from public.portfolio_items where user_id='20000000-0000-4000-8000-000000000001';
delete from public.experiences where user_id='20000000-0000-4000-8000-000000000001';
delete from public.experience_evidence where owner_id='20000000-0000-4000-8000-000000000001';
delete from public.experience_reflections where user_id='20000000-0000-4000-8000-000000000001';
delete from public.mission_runs where mission_id='60000000-0000-4000-8000-000000000001';
delete from public.processing_basis_events where processing_basis_id in (select id from public.processing_basis_records where subject_user_id in ('20000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002'));
delete from public.processing_basis_records where subject_user_id in ('20000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002');
delete from public.guardian_relationships where id='70000000-0000-4000-8000-000000000001';
delete from public.organization_memberships where organization_id='50000000-0000-4000-8000-000000000001';
delete from public.organizations where id='50000000-0000-4000-8000-000000000001';
delete from public.missions where id='60000000-0000-4000-8000-000000000001';
delete from auth.users where id in (
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  '30000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001'
);
