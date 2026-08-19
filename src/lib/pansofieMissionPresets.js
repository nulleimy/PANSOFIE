export const DEFAULT_SCHOOL_MISSION_SLUGS = Object.freeze([
  "zlepsi-svou-skolu",
  "digitalni-most",
  "circular-challenge",
]);

export function orderDefaultSchoolMissions(missions = []) {
  const bySlug = new Map(missions.map((mission) => [mission.slug, mission]));
  return DEFAULT_SCHOOL_MISSION_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean);
}

export function getDefaultMissionState(mission, runs = []) {
  const matchingRuns = runs.filter((run) => run.missions?.slug === mission.slug);
  const active = matchingRuns.find((run) => ["assigned", "in_progress", "submitted"].includes(run.status));
  if (active) return { state: "active", run: active };

  const completed = matchingRuns.find((run) => run.status === "completed");
  if (completed) return { state: "completed", run: completed };

  return { state: "preselected", run: null };
}
