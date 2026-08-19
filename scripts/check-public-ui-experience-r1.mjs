import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [home, method, programs, programDetail, flow, missionMap, ecosystem, nav, footer] = await Promise.all([
  read("src/pages/Home.jsx"),
  read("src/components/pansofie/Method.jsx"),
  read("src/components/pansofie/Programs.jsx"),
  read("src/pages/ProgramDetail.jsx"),
  read("src/components/pansofie/ExperienceFlow.jsx"),
  read("src/components/pansofie/MissionMap.jsx"),
  read("src/components/pansofie/Ecosystem.jsx"),
  read("src/components/pansofie/PublicNav.jsx"),
  read("src/components/pansofie/PublicFooter.jsx"),
]);

for (const token of ["<Method />", "<ExperienceFlow />", "<Programs />", "<MissionMap />", "<Ecosystem />"]) {
  assert.ok(home.includes(token), `homepage composition missing ${token}`);
}

for (const token of ["Objev", "Udělej", "Pochop", "Přispěj"]) {
  assert.ok(method.includes(token), `method step missing ${token}`);
  assert.ok(flow.includes(token), `experience flow step missing ${token}`);
}

for (const token of ["FUNKČNÍ", "TESTUJEME", "JEŠTĚ NEPROBĚHLO", "PLÁN"]) {
  assert.ok(programs.includes(token), `public maturity state missing ${token}`);
}

assert.ok(programDetail.includes("Mission Idea je inspirace, ne automaticky přiřazený úkol"), "program detail must preserve Mission Idea vs Mission Run separation");
assert.ok(programDetail.includes("/zapojit-se?mode=simulator"), "program detail own-mission path missing");
assert.ok(!programDetail.includes("mailto:hello@pansofie.cz"), "unverified public email must not be exposed");

assert.ok(flow.includes("klikání samo nevytváří skutečnou Experience ani ověření"), "demo must not imply real completion");
assert.ok(flow.includes("Passport není známka člověka"), "passport human-score boundary missing");
assert.ok(flow.includes("adopce, outcome ani dopad"), "activity/adoption/outcome boundary missing");

assert.ok(missionMap.includes("ILUSTRAČNÍ MAPA · NEJSOU TO POTVRZENÉ PILOTY"), "mission map truthfulness label missing");
assert.ok(missionMap.includes("+ Vymyslet vlastní misi"), "own mission CTA missing");
assert.ok(missionMap.includes("Nevytváří automaticky Mission Run"), "Mission Idea must not auto-create a run");
assert.ok(!missionMap.includes("Pilotní škola — první ověření"), "fictional pilot claim must not return");

for (const token of ["Žák / mladý člověk", "Rodina", "Škola", "Firma / organizace", "Obec / komunita", "Mentor / odborník"]) {
  assert.ok(ecosystem.includes(token), `ecosystem role missing ${token}`);
}
assert.ok(ecosystem.includes("nemá neomezený soukromý kanál k dítěti"), "mentor-child boundary missing");
assert.ok(ecosystem.includes("Předání návrhu není automaticky jeho přijetí, použití, outcome ani dopad"), "community adoption boundary missing");

for (const token of ["/#experience", "/#mise", "/#ekosystem", "/#programy"]) {
  assert.ok(nav.includes(token), `public nav section missing ${token}`);
}
assert.ok(nav.includes('to="/zapojit-se"'), "existing public join route must remain available");

for (const token of ["/bezpecnost", "/soukromi", "/podminky", "Výsledek není známka člověka"]) {
  assert.ok(footer.includes(token), `footer trust contract missing ${token}`);
}

console.log("PUBLIC_UI_EXPERIENCE_R1=PASS");
