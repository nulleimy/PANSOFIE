# PANSOFIE — UI Components Reference R1

**Date:** 2026-08-19  
**Purpose:** Documentation of the JSX/React components supplied by the user as the visual/UX reference for the next canonical PANSOFIE implementation.  
**Status:** REFERENCE / ACCEPTED DIRECTION — not automatically canonical production code.  
**Production:** HARD NO until separately verified and promoted through the governed workflow.

---

## 1. Component inventory

The supplied UI bundle contains these distinct components:

1. `Header.jsx`
2. `Footer.jsx`
3. `Method.jsx`
4. `Programs.jsx`
5. `ProgramDetail.jsx`
6. `MissionMap.jsx` — supplied code currently exports `ProgramsMap`; accepted direction is to evolve it into Mission Map / opportunity map.
7. `ExperienceFlow.jsx`
8. `Ecosystem.jsx`

Together they form a coherent public-product explanation layer rather than isolated widgets.

Recommended public flow:

```text
Header
  ↓
Hero / Entry
  ↓
Method
  ↓
ExperienceFlow
  ↓
Programs
  ↓
ProgramDetail
  ↓
Mission Discovery / MissionMap
  ↓
Ecosystem
  ↓
Contact / Join
  ↓
Footer
```

Mission-system flow behind this UI:

```text
Mission Discovery
  ↓
MissionIdea
  ↓
MissionDraft
  ↓
MissionRun
  ↓
Activity + Output + Evidence + Reflection
  ↓
Experience
  ↓
Experience Passport
```

Critical semantic boundary:

```text
ACTIVITY ≠ OUTPUT ≠ ADOPTION ≠ OUTCOME ≠ IMPACT
```

No UI component may imply that clicking through a demo, submitting an idea, producing an output, or handing something over proves adoption, outcome, impact, or human quality.

---

## 2. Header / canonical `PublicNav.jsx`

### Role
Primary public navigation and high-priority CTA surface.

### Accepted behavior
- Fixed header.
- Calm translucent/blurry surface on scroll.
- Public anchors for method, Experience, mission discovery, ecosystem and programs.
- Real login route.
- Primary CTA `Vyzkoušet 60 s` routed to the truthful Entry Journey.
- Mobile navigation.
- `Leaf` + Pansofie + `Skutečné zkušenosti` brand lockup.

### Boundary
Navigation may point only to real routes or existing page sections. No dead CTA.

---

## 3. Footer / canonical `PublicFooter.jsx`

### Role
Secondary navigation, trust links, legal/safety discoverability and brand close.

### Required public trust routes
- `/bezpecnost`
- `/soukromi`
- `/podminky`
- `/o-projektu`
- `/kontakt`

Keep the principle:

> Výsledek není známka člověka. Je to doložená zkušenost.

Do not invent an operator, email, company, calendar or legal identity.

---

## 4. `Method.jsx`

Canonical four-step method:

```text
01 Objev
02 Udělej
03 Pochop
04 Přispěj
```

Theme chips:

```text
LIFE · MAKER · NATURE · COMMUNITY · CHALLENGE
```

Themes should later map to Mission Discovery taxonomy rather than remain decorative labels.

---

## 5. `Programs.jsx`

Programs are four entry contexts into one Experience-first system:

- Pansofie School
- Pansofie Family
- Pansofie Community
- Pansofie Youth

Canonical maturity states:

```text
FUNKČNÍ
TESTUJEME
JEŠTĚ NEPROBĚHLO
PLÁN
```

Always separate product/technical readiness from real-world deployment.

---

## 6. `ProgramDetail.jsx`

Accepted sections:

1. Program hero + maturity.
2. How it works.
3. Mission Discovery bridge.
4. What the role can do.
5. What it contributes.
6. Safe boundary.
7. FAQ.
8. Truthful join CTA.

The unverified `mailto:hello@pansofie.cz` is forbidden until independently verified and explicitly approved.

Mission bridge:

```text
[ Objevit nápady na mise ]
[ + Vymyslet vlastní ]
```

Mission Idea is inspiration, not an automatically assigned Mission Run.

---

## 7. `ExperienceFlow.jsx`

Role: interactive public demonstration of how an Experience can move from discovery to handoff.

Stages:

```text
Objev → Udělej → Pochop → Přispěj
```

The public demo must never imply that clicking through has created a real Experience or verified Passport.

The final screen is an **example of what a Passport could look like after actual activity, evidence, reflection and authorized human verification**.

Privacy/adoption boundaries:
- Family context remains separate from private learner reflection.
- A community may receive something for review; this does not prove adoption.
- Handoff ≠ adoption ≠ outcome ≠ impact.

---

## 8. `MissionMap.jsx`

Accepted direction: evolve the original map of supposed pilot sites into a **Mission opportunity discovery map**.

Future categories may include:

```text
school
community
helping others
nature
self
partner challenges
own ideas
```

The first public map must be explicitly illustrative until real, approved location data exists.

Hard-coded phrases such as `Pilotní škola — první ověření` are forbidden unless independently factual and approved.

MissionMap is only one discovery mode: some missions can be online, at home, at school, anywhere, or not geolocated.

---

## 9. `Ecosystem.jsx`

Interactive visualization around one central Experience.

Roles:
- learner / young person
- family
- school
- partner / organization
- community / municipality
- mentor / expert

Each role exposes:

```text
purpose / status
what it may receive
what it contributes
safe boundary
flows
```

Critical boundaries:
- Teacher evaluates work/evidence, not a person.
- Family does not automatically see private reflection.
- Partner does not gain access to private child data.
- Mentor does not have an unrestricted private child channel.
- Community review does not imply adoption or impact.

Czech inflection should be explicit (`flowFrom`) rather than generated with `toLowerCase()`.

---

## 10. Shared design language

### Layout
- generous public spacing;
- `max-w-7xl` section rhythm;
- rounded 2xl/3xl surfaces;
- thin borders and subtle surface contrast;
- responsive grids, not dense dashboards.

### Typography
- `font-display` for major headings and key numbers;
- small uppercase tracking labels for section context;
- muted explanatory body copy.

### Motion
Motion should remain restrained and explanatory. Canonical R1 may use existing CSS/Tailwind transitions instead of adding dependencies purely for animation.

### Character

```text
human
calm
trustworthy
curious
active
open
not childish
not gamified
not corporate-cold
```

---

## 11. Canonical component mapping in this implementation

```text
supplied Header.jsx        → src/components/pansofie/PublicNav.jsx
supplied Footer.jsx        → src/components/pansofie/PublicFooter.jsx
supplied Method.jsx        → src/components/pansofie/Method.jsx
supplied Programs.jsx      → src/components/pansofie/Programs.jsx
supplied ProgramDetail.jsx → src/pages/ProgramDetail.jsx
supplied ExperienceFlow    → src/components/pansofie/ExperienceFlow.jsx
supplied MissionMap        → src/components/pansofie/MissionMap.jsx
supplied Ecosystem         → src/components/pansofie/Ecosystem.jsx
```

This avoids duplicating existing canonical navigation/footer/page layers.

---

## 12. Canonical product connection

```text
DISCOVER A MISSION / OWN IDEA
           ↓
      Mission Idea
           ↓
      Mission Draft
           ↓
       Mission Run
           ↓
       EXPERIENCE
           ↓
Objev → Udělej → Pochop → Přispěj
           ↓
evidence + reflection + authorized review
           ↓
   Experience Passport
```

Around every Experience, roles participate only according to purpose, permission, contribution, visibility and boundary.

---

## 13. Decision

The supplied JSX bundle is accepted as the **visual and interaction reference layer for Pansofie** with this rule:

> Preserve the design language and explanatory interaction patterns; replace demo assumptions, unverified pilot/contact claims, hard-coded fake reality and semantic shortcuts with canonical Pansofie data, governance, privacy, mission and Experience contracts.

The components are implemented as one coherent public UI system, not as isolated widgets.
