import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.PANSOFIE_LOCAL_URL || "http://127.0.0.1:5173";
const EVIDENCE_DIR = path.resolve("browser-evidence-r5");
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const IDs = {
  partner: "11111111-1111-4111-8111-111111111111",
  teacher: "22222222-2222-4222-8222-222222222222",
  partnerOrg: "33333333-3333-4333-8333-333333333333",
  schoolOrg: "44444444-4444-4444-8444-444444444444",
  challenge: "55555555-5555-4555-8555-555555555555",
  assignment: "66666666-6666-4666-8666-666666666666",
  cohort: "77777777-7777-4777-8777-777777777777",
  team: "88888888-8888-4888-8888-888888888888",
  mission: "99999999-9999-4999-8999-999999999999",
  missionVersion: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  deliverable: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  decision: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
};

const assignmentRow = {
  assignment_id: IDs.assignment,
  challenge_id: IDs.challenge,
  challenge_status: "active",
  assignment_status: "active",
  partner_organization_id: IDs.partnerOrg,
  partner_organization_name: "R5 Browser Partner",
  school_organization_id: IDs.schoolOrg,
  school_name: "R5 Browser School",
  cohort_id: IDs.cohort,
  cohort_name: "R5 Browser Cohort",
  team_id: IDs.team,
  team_name: "R5 Browser Team",
  mission_id: IDs.mission,
  mission_title: "Circular Challenge",
  mission_version_id: IDs.missionVersion,
  mission_version_no: 4,
  title: "Jak snížit plýtvání materiálem?",
  problem_statement: "Organizace potřebuje bezpečně ověřit nový způsob práce s materiálem.",
  beneficiary: "Místní provoz a komunita",
  desired_output: "Týmový návrh a stručný report s doporučením.",
  feedback_commitment: "Partner dá bounded feedback k výstupu.",
  data_requirements: "Bez osobních údajů learnerů.",
  ip_expectations: "Použití až po samostatné dohodě.",
  safety_notes: "Bez přímého kontaktu partner → dítě.",
  screening_decision: "ready",
  screening_dimensions: {
    educational_fit: "PASS", age_fit: "PASS", scope: "PASS", data_privacy: "PASS",
    safeguarding: "PASS", ip: "PASS", deliverable: "PASS", feedback_plan: "PASS", adoption_possibility: "PASS",
  },
};

function jwtFor(user) {
  const enc = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${enc({ alg: "HS256", typ: "JWT" })}.${enc({ sub: user.id, email: user.email, role: "authenticated", exp: Math.floor(Date.now()/1000)+7200 })}.verification`;
}

async function installMockSession(page, mode) {
  const user = mode === "partner"
    ? { id: IDs.partner, email: "partner-r5@example.invalid", user_metadata: { full_name: "R5 Partner" }, aud: "authenticated", role: "authenticated" }
    : { id: IDs.teacher, email: "teacher-r5@example.invalid", user_metadata: { full_name: "R5 Teacher" }, aud: "authenticated", role: "authenticated" };
  const session = { access_token: jwtFor(user), refresh_token: "verification-refresh", expires_in: 7200, expires_at: Math.floor(Date.now()/1000)+7200, token_type: "bearer", user };
  await page.addInitScript(({ session }) => {
    localStorage.setItem("sb-placeholder-auth-token", JSON.stringify(session));
  }, { session });
  return user;
}

async function installSupabaseMocks(page, mode) {
  let reviewed = false;
  let outcomeRecorded = false;
  let schoolSubmitted = false;

  const deliverableRow = () => ({
    deliverable_id: IDs.deliverable,
    assignment_id: IDs.assignment,
    challenge_id: IDs.challenge,
    challenge_revision: 2,
    deliverable_revision: 1,
    challenge_title: assignmentRow.title,
    agreed_deliverable: assignmentRow.desired_output,
    team_label: "R5 Browser Team",
    deliverable_title: "Materiálový prototyp a report",
    deliverable_summary: "Bezpečné týmové shrnutí výsledku bez raw learner evidence a soukromé reflexe.",
    deliverable_kind: "report",
    deliverable_uri: null,
    submitted_at: "2026-08-19T02:00:00Z",
    addressed_brief: reviewed ? "yes" : null,
    useful_text: reviewed ? "Výstup je konkrétní a použitelný pro pilotní ověření." : null,
    changes_needed: reviewed ? "Doplnit vlastníka a termín pilotu." : null,
    reviewed_at: reviewed ? "2026-08-19T02:10:00Z" : null,
    adoption_decision_id: reviewed ? IDs.decision : null,
    adoption_decision: reviewed ? "pilot" : null,
    adoption_note: reviewed ? "Pokračovat omezeným pilotem." : null,
    decided_at: reviewed ? "2026-08-19T02:10:00Z" : null,
    latest_outcome_status: outcomeRecorded ? "reported" : null,
    latest_outcome_confidence: outcomeRecorded ? "unverified" : null,
    latest_outcome_text: outcomeRecorded ? "Pilot změnil jeden konkrétní materiálový proces." : null,
    latest_outcome_observed_on: outcomeRecorded ? "2026-08-19" : null,
  });

  await page.route("https://placeholder.supabase.co/**", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const p = url.pathname;
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

    if (p === "/auth/v1/user") {
      const user = mode === "partner"
        ? { id: IDs.partner, email: "partner-r5@example.invalid", user_metadata: { full_name: "R5 Partner" }, aud: "authenticated", role: "authenticated" }
        : { id: IDs.teacher, email: "teacher-r5@example.invalid", user_metadata: { full_name: "R5 Teacher" }, aud: "authenticated", role: "authenticated" };
      return json(user);
    }
    if (p.startsWith("/auth/v1/token")) return json({});
    if (p === "/rest/v1/profiles") return json({ id: mode === "partner" ? IDs.partner : IDs.teacher, full_name: mode === "partner" ? "R5 Partner" : "R5 Teacher", location: "", bio: "" });
    if (p === "/rest/v1/user_roles") return json({ role: "member" });
    if (p === "/rest/v1/organization_memberships") {
      if (mode === "school") return json([{ id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", organization_id: IDs.schoolOrg, role: "teacher", status: "active", organizations: { id: IDs.schoolOrg, slug: "r5-browser-school", name: "R5 Browser School", organization_type: "school", status: "active" } }]);
      return json([{ id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", organization_id: IDs.partnerOrg, role: "partner_contact", status: "active", organizations: { id: IDs.partnerOrg, slug: "r5-browser-partner", name: "R5 Browser Partner", organization_type: "company", status: "active" } }]);
    }

    const rpc = p.match(/^\/rest\/v1\/rpc\/(.+)$/)?.[1];
    if (rpc === "pansofie_list_my_partner_organizations") return json([{ organization_id: IDs.partnerOrg, organization_name: "R5 Browser Partner", organization_type: "company", organization_status: "active", verification_status: "verified" }]);
    if (rpc === "pansofie_list_my_partner_challenges") return json([{ ...assignmentRow, challenge_id: IDs.challenge, partner_organization_id: IDs.partnerOrg, revision_no: 2, screening_note: "Quality Gate prošel.", challenge_status: "active" }]);
    if (rpc === "pansofie_list_my_partner_deliverables") return json([deliverableRow()]);
    if (rpc === "pansofie_partner_review_deliverable") { reviewed = true; return json(IDs.decision); }
    if (rpc === "pansofie_partner_report_outcome") { outcomeRecorded = true; return json("ffffffff-ffff-4fff-8fff-ffffffffffff"); }
    if (rpc === "pansofie_list_school_challenge_assignments") return json([assignmentRow]);
    if (rpc === "pansofie_list_school_challenge_outcomes") return json(schoolSubmitted ? [deliverableRow()] : []);
    if (rpc === "pansofie_school_submit_challenge_deliverable") { schoolSubmitted = true; return json(IDs.deliverable); }

    // Unrelated member-layout/supporting reads stay empty and bounded.
    if (p.startsWith("/rest/v1/")) return json([]);
    return json({});
  });

  return {
    isReviewed: () => reviewed,
    isOutcomeRecorded: () => outcomeRecorded,
    isSchoolSubmitted: () => schoolSubmitted,
  };
}

async function assertViewport(page, name, label) {
  const dims = await page.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  expect(dims.scrollWidth, `${name} ${label} horizontal overflow`).toBeLessThanOrEqual(dims.innerWidth + 1);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${name}-${label}.png`), fullPage: true });
}

for (const viewport of [
  { label: "desktop", width: 1440, height: 1100 },
  { label: "mobile", width: 390, height: 844 },
]) {
  test(`R5 Partner Review ${viewport.label}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    const user = await installMockSession(page, "partner");
    const state = await installSupabaseMocks(page, "partner");
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(`${BASE_URL}/partner-workspace`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /Review výstupu\. Ne hodnocení člověka/i })).toBeVisible();
    await expect(page.getByText("OUTPUT READY").first()).toBeVisible();
    await expect(page.getByText(user.email)).toHaveCount(0);
    await page.getByRole("button", { name: "ANO" }).click();
    await page.getByLabel(/Co je užitečné/).fill("Výstup je použitelný pro pilotní ověření.");
    await page.getByLabel(/Co by bylo potřeba změnit/).fill("Doplnit vlastníka a termín.");
    await page.getByRole("button", { name: "PILOT" }).click();
    await page.getByRole("button", { name: /Uložit review a rozhodnutí/ }).click();
    await expect.poll(() => state.isReviewed()).toBe(true);
    await expect(page.getByText(/Rozhodnutí:\s*PILOT/i)).toBeVisible();
    await page.getByLabel(/Co se změnilo/).fill("Pilot změnil jeden materiálový proces.");
    await page.getByLabel(/^Komu/).fill("Místní provoz");
    await page.getByLabel(/Kdy pozorováno/).fill("2026-08-19");
    await page.getByLabel(/^Zdroj/).fill("Interní pilotní záznam");
    await page.getByRole("button", { name: /Zaznamenat bounded outcome/ }).click();
    await expect.poll(() => state.isOutcomeRecorded()).toBe(true);
    await expect(page.getByText(/REPORTED · UNVERIFIED/).first()).toBeVisible();
    await assertViewport(page, "partner-review-r5", viewport.label);
    expect(errors).toEqual([]);
    await context.close();
  });

  test(`R5 School Deliverable ${viewport.label}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    await installMockSession(page, "school");
    const state = await installSupabaseMocks(page, "school");
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(`${BASE_URL}/skola/challenges`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /Odeslat bezpečný výstup partnerovi/i })).toBeVisible();
    await expect(page.getByText(/Partner nedostává automatický přístup k raw evidence/i)).toBeVisible();
    await page.getByLabel(/Název výstupu/).fill("Materiálový prototyp a report");
    await page.getByLabel(/Bezpečné shrnutí pro Partnera/).fill("Bounded týmový výstup bez identit a soukromé reflexe.");
    await page.getByRole("button", { name: /Odeslat bezpečný výstup partnerovi/ }).click();
    await expect.poll(() => state.isSchoolSubmitted()).toBe(true);
    await expect(page.getByText(/immutable revision/)).toBeVisible();
    await assertViewport(page, "school-deliverable-r5", viewport.label);
    expect(errors).toEqual([]);
    await context.close();
  });
}
