-- Remove PostgreSQL PUBLIC's implicit EXECUTE path from exposed PANSOFIE
-- functions. Explicit authenticated grants remain only where intended.

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.is_admin() from public;
revoke execute on function public.pansofie_touch_updated_at() from public;
revoke execute on function public.pansofie_is_active_org_member(uuid, text[], uuid) from public;
revoke execute on function public.pansofie_is_verified_guardian(uuid, uuid) from public;
revoke execute on function public.pansofie_has_processing_basis(uuid, uuid, text) from public;
revoke execute on function public.pansofie_can_review_run(uuid, text) from public;
revoke execute on function public.pansofie_can_review_experience(uuid, text) from public;
revoke execute on function public.pansofie_can_guardian_view_passport(uuid) from public;
revoke execute on function public.pansofie_validate_processing_basis() from public;
revoke execute on function public.pansofie_log_processing_basis_event() from public;
revoke execute on function public.pansofie_protect_portfolio_verification() from public;
revoke execute on function public.pansofie_assign_school_mission(uuid, uuid, uuid) from public;
revoke execute on function public.pansofie_start_mission(uuid) from public;
revoke execute on function public.pansofie_submit_mission(uuid) from public;
revoke execute on function public.pansofie_review_school_run(uuid, text, text, text) from public;
revoke execute on function public.pansofie_finalize_school_experience(uuid) from public;
revoke execute on function public.pansofie_guard_evidence_mutation() from public;
revoke execute on function public.pansofie_guard_reflection_mutation() from public;
revoke execute on function public.pansofie_log_review_event() from public;

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
