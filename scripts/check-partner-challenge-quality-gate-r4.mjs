import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const files = {
  contract: read("docs/canonical/PARTNER_CHALLENGE_QUALITY_GATE_R4.md"),
  migration: read("supabase/migrations/20260818210000_partner_challenge_quality_gate_r4.sql"),
  hardening: read("supabase/migrations/20260818210500_partner_challenge_execute_hardening_r4.sql"),
  partnerProjection: read("supabase/migrations/20260818211000_partner_workspace_projection_r4.sql"),
  adminDetail: read("supabase/migrations/20260818211500_admin_partner_challenge_detail_r4.sql"),
  cohortFix: read("supabase/migrations/20260818212000_pilot_cohort_create_ambiguity_fix_r4.sql"),
  proof: read("supabase/verification/staging_partner_challenge_r4_runtime_proof_v4.sql"),
  service: read("src/lib/pansofiePartnerFlow.js"),
  partner: read("src/pages/PartnerHub.jsx"),
  school: read("src/pages/SchoolChallengeInbox.jsx"),
  admin: read("src/pages/AdminPartnerChallenges.jsx"),
  app: read("src/App.jsx"),
  member: read("src/layouts/MemberLayout.jsx"),
  adminLayout: read("src/layouts/AdminLayout.jsx"),
};

const required = [
  [files.contract, "VERIFIED PARTNER → DRAFT CHALLENGE → SUBMIT → QUALITY GATE → READY → MANAGED MATCH → SCHOOL ACCEPT → CIRCULAR CHALLENGE RUNS"],
  [files.contract, "R4 stops before partner access to learner outputs"],
  [files.migration, "partner_contact"],
  [files.migration, "partner_organization_verification_events"],
  [files.migration, "partner_challenges"],
  [files.migration, "partner_challenge_screenings"],
  [files.migration, "partner_challenge_assignments"],
  [files.migration, "challenge_assignment_id"],
  [files.migration, "educational_fit"],
  [files.migration, "age_fit"],
  [files.migration, "scope"],
  [files.migration, "data_privacy"],
  [files.migration, "safeguarding"],
  [files.migration, "'ip'"],
  [files.migration, "deliverable"],
  [files.migration, "feedback_plan"],
  [files.migration, "adoption_possibility"],
  [files.migration, "PASS | NEEDS_WORK | BLOCKED | NOT_APPLICABLE".split(" | ")[0]],
  [files.migration, "slug = 'circular-challenge'"],
  [files.migration, "Mission version changed; managed assignment must be recreated"],
  [files.migration, "pansofie_assign_pilot_team_mission"],
  [files.migration, "enable row level security"],
  [files.migration, "revoke all on table public.partner_challenges from anon, authenticated"],
  [files.hardening, "from public, anon, authenticated"],
  [files.hardening, "grant execute on function public.pansofie_list_my_partner_challenges() to authenticated"],
  [files.partnerProjection, "pansofie_list_my_partner_organizations"],
  [files.adminDetail, "pansofie_admin_get_partner_challenge"],
  [files.cohortFix, "new_cohort_id"],
  [files.proof, "STAGING-ONLY VERIFICATION"],
  [files.proof, "partner unexpectedly screened its own Challenge"],
  [files.proof, "screening evidence was mutable"],
  [files.proof, "learner-private key leaked to Partner projection"],
  [files.proof, "Mission-version drift did not block acceptance"],
  [files.proof, "expected exactly one learner run"],
  [files.proof, "acceptance created premature learner evidence/reflection/Experience"],
  [files.proof, "delete from public.processing_basis_events"],
  [files.proof, "delete from public.processing_basis_records"],
  [files.proof, "Zero-residue assertions"],
  [files.service, "supabase.rpc"],
  [files.service, "QUALITY_DIMENSIONS"],
  [files.partner, "CO JE TEĎ NA MNĚ?"],
  [files.partner, "Partner boundary"],
  [files.school, "CO JE TEĎ NA MNĚ?"],
  [files.school, "Přijmout Challenge"],
  [files.school, "school_mission_assignment"],
  [files.admin, "9-dimension Quality Gate"],
  [files.admin, "Managed match"],
  [files.app, 'path="/partner-workspace"'],
  [files.app, 'path="/skola/challenges"'],
  [files.app, 'path="challenges" element={<AdminPartnerChallenges />}'],
  [files.member, "PANSOFIE Partner"],
  [files.member, "Challenge Inbox"],
  [files.adminLayout, "Partner Challenges"],
];

const missing = required.filter(([content, token]) => !content.includes(token)).map(([, token]) => token);

const cleanupEventPos = files.proof.indexOf("delete from public.processing_basis_events");
const cleanupRecordPos = files.proof.indexOf("delete from public.processing_basis_records");
if (cleanupEventPos < 0 || cleanupRecordPos < 0 || cleanupEventPos > cleanupRecordPos) {
  missing.push("processing_basis_events cleanup must precede processing_basis_records cleanup");
}

const forbidden = [
  [files.service, '.from("partner_'],
  [files.service, ".from('partner_"],
  [files.migration, "experience_evidence"],
  [files.migration, "experience_reflections"],
  [files.migration, "portfolio_items"],
  [files.migration, "quality_score"],
  [files.migration, "human_score"],
  [files.migration, "learner_score"],
  [files.partner, "raw evidence}"],
];

const presentForbidden = forbidden.filter(([content, token]) => content.includes(token)).map(([, token]) => token);

if (missing.length || presentForbidden.length) {
  console.error("PARTNER_CHALLENGE_QUALITY_GATE_R4=FAIL");
  if (missing.length) console.error(`Missing: ${missing.join(" | ")}`);
  if (presentForbidden.length) console.error(`Forbidden: ${presentForbidden.join(" | ")}`);
  process.exit(1);
}

console.log("PARTNER_CHALLENGE_QUALITY_GATE_R4=PASS");
