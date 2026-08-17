import fs from "node:fs";

const files = [
  "supabase/migrations/20260817003355_security_definer_execute_hardening.sql",
  "supabase/migrations/20260817003538_public_execute_cleanup.sql",
  "supabase/migrations/20260817024500_private_authorization_helpers.sql",
];

for (const file of files) {
  if (!fs.existsSync(file)) throw new Error(`Missing security migration: ${file}`);
}

const privateSql = fs.readFileSync(files[2], "utf8");
const required = [
  "create schema if not exists pansofie_private",
  "pansofie_private.is_active_org_member",
  "pansofie_private.is_verified_guardian",
  "pansofie_private.has_processing_basis",
  "create or replace function public.pansofie_assign_school_mission",
  "create or replace function public.pansofie_can_review_run",
  "create or replace function public.pansofie_can_guardian_view_passport",
  "revoke execute on function public.pansofie_is_active_org_member",
  "revoke execute on function public.pansofie_is_verified_guardian",
  "revoke execute on function public.pansofie_has_processing_basis",
  "mission_runs_insert_school_assignment",
  "processing_basis_select_subject_guardian_admin",
];

for (const marker of required) {
  if (!privateSql.includes(marker)) throw new Error(`Security hardening marker missing: ${marker}`);
}

if (privateSql.includes("grant execute on function public.pansofie_has_processing_basis") ||
    privateSql.includes("grant execute on function public.pansofie_is_verified_guardian") ||
    privateSql.includes("grant execute on function public.pansofie_is_active_org_member")) {
  throw new Error("Generic arbitrary-target authorization helpers must not be re-exposed to authenticated clients in the private-helper migration.");
}

console.log("PANSOFIE database security hardening contract: PASS");
