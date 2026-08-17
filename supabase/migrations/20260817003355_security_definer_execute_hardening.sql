-- PANSOFIE staging security hardening.
--
-- Browser clients must never inherit broad EXECUTE privileges merely because a
-- function lives in the exposed public schema. Trigger-only functions are not
-- directly callable by anon/authenticated. Authenticated users retain only the
-- public business/helper RPCs required by the current R0.3 flow; a later
-- migration further removes generic authorization helpers from the exposed RPC
-- surface.

revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.pansofie_validate_processing_basis() from anon, authenticated;
revoke execute on function public.pansofie_log_processing_basis_event() from anon, authenticated;
revoke execute on function public.pansofie_log_review_event() from anon, authenticated;
revoke execute on function public.pansofie_guard_evidence_mutation() from anon, authenticated;
revoke execute on function public.pansofie_guard_reflection_mutation() from anon, authenticated;
revoke execute on function public.pansofie_protect_portfolio_verification() from anon, authenticated;
revoke execute on function public.pansofie_touch_updated_at() from anon, authenticated;

revoke execute on function public.is_admin() from anon;
revoke execute on function public.pansofie_is_active_org_member(uuid, text[], uuid) from anon;
revoke execute on function public.pansofie_is_verified_guardian(uuid, uuid) from anon;
revoke execute on function public.pansofie_has_processing_basis(uuid, uuid, text) from anon;
revoke execute on function public.pansofie_can_review_run(uuid, text) from anon;
revoke execute on function public.pansofie_can_review_experience(uuid, text) from anon;
revoke execute on function public.pansofie_can_guardian_view_passport(uuid) from anon;
revoke execute on function public.pansofie_assign_school_mission(uuid, uuid, uuid) from anon;
revoke execute on function public.pansofie_start_mission(uuid) from anon;
revoke execute on function public.pansofie_submit_mission(uuid) from anon;
revoke execute on function public.pansofie_review_school_run(uuid, text, text, text) from anon;
revoke execute on function public.pansofie_finalize_school_experience(uuid) from anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.pansofie_is_active_org_member(uuid, text[], uuid) to authenticated;
grant execute on function public.pansofie_is_verified_guardian(uuid, uuid) to authenticated;
grant execute on function public.pansofie_has_processing_basis(uuid, uuid, text) to authenticated;
grant execute on function public.pansofie_can_review_run(uuid, text) to authenticated;
grant execute on function public.pansofie_can_review_experience(uuid, text) to authenticated;
grant execute on function public.pansofie_can_guardian_view_passport(uuid) to authenticated;
grant execute on function public.pansofie_assign_school_mission(uuid, uuid, uuid) to authenticated;
grant execute on function public.pansofie_start_mission(uuid) to authenticated;
grant execute on function public.pansofie_submit_mission(uuid) to authenticated;
grant execute on function public.pansofie_review_school_run(uuid, text, text, text) to authenticated;
grant execute on function public.pansofie_finalize_school_experience(uuid) to authenticated;

comment on function public.handle_new_user()
  is 'Auth trigger only; direct anon/authenticated RPC execution is revoked.';
comment on function public.pansofie_log_processing_basis_event()
  is 'Processing-basis audit trigger only; direct RPC execution is revoked.';
comment on function public.pansofie_log_review_event()
  is 'Review audit trigger only; direct RPC execution is revoked.';
