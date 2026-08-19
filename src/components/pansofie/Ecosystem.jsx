import React, { useMemo, useState } from "react";
import {
  GraduationCap,
  Users,
  School,
  Building2,
  Landmark,
  Compass,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const ROLES = [
  {
    id: "zak",
    label: "Žák",
    flowFrom: "žáka",
    name: "Žák / mladý člověk",
    status: "Součást Experience modelu",
    icon: GraduationCap,
    receives: "Skutečnou zkušenost, vedení, zpětnou vazbu a soukromý Experience Passport.",
    contributes: "Pohled, otázky, práci v týmu, konkrétní výstup, důkaz a vlastní reflexi.",
    boundary: "Přínos se nikdy nepřevádí na skóre člověka ani na předpověď jeho budoucnosti.",
    flows: [
      { to: "skola", label: "doloží práci" },
      { to: "rodina", label: "může přijmout oddělený kontext" },
      { to: "mentor", label: "může získat vedení" },
    ],
  },
  {
    id: "rodina",
    label: "Rodina",
    flowFrom: "rodiny",
    name: "Rodina",
    status: "Zapojení podle konkrétní Experience",
    icon: Users,
    receives: "Bezpečnou a smysluplnou roli bez automatického přístupu k soukromé reflexi.",
    contributes: "Reálný kontext, podnět a pohled z domova — odděleně od hodnocení člověka.",
    boundary: "Rodina automaticky nevidí soukromou reflexi mladého člověka.",
    flows: [{ to: "zak", label: "samostatný kontext" }],
  },
  {
    id: "skola",
    label: "Škola",
    flowFrom: "školy",
    name: "Škola",
    status: "Digitální workflow je funkční",
    icon: School,
    receives: "Zvládnutelný postup, strukturu a možnost ověřit doloženou práci.",
    contributes: "Bezpečný rámec, pedagogické vedení a oddělené ověření doložené zkušenosti.",
    boundary: "Učitel posuzuje práci a evidenci, ne lidskou hodnotu nebo osobnost.",
    flows: [
      { to: "zak", label: "bezpečný rámec" },
      { to: "firma", label: "může převzít Challenge" },
      { to: "mentor", label: "může přizvat odbornou zpětnou vazbu" },
    ],
  },
  {
    id: "firma",
    label: "Partner",
    flowFrom: "partnera",
    name: "Firma / organizace",
    status: "Challenge a review workflow je funkční",
    icon: Building2,
    receives: "Možnost přinést skutečný problém a posoudit předaný výstup v jasných hranicích.",
    contributes: "Skutečný problém a kontext, ne přístup k soukromým datům dítěte.",
    boundary: "Partner nekupuje pozitivní výsledek ani přístup k soukromým datům člověka.",
    flows: [
      { to: "skola", label: "přináší Challenge" },
      { to: "obec", label: "může sdílet místní kontext" },
    ],
  },
  {
    id: "obec",
    label: "Komunita",
    flowFrom: "komunity",
    name: "Obec / komunita",
    status: "Zapojení podle konkrétní Experience",
    icon: Landmark,
    receives: "Možnost posoudit výstup nebo navázat dalším krokem podle skutečné místní potřeby.",
    contributes: "Reálné prostředí, potřebu a kontext, kde může být práce vyzkoušena nebo použita.",
    boundary: "Předání návrhu není automaticky jeho přijetí, použití, outcome ani dopad.",
    flows: [
      { to: "firma", label: "sdílí reálné prostředí" },
      { to: "skola", label: "může předat potřebu k posouzení" },
    ],
  },
  {
    id: "mentor",
    label: "Mentor",
    flowFrom: "mentora",
    name: "Mentor / odborník",
    status: "Zapojení v řízeném kontextu",
    icon: Compass,
    receives: "Přístup ke konkrétní otázce nebo výstupu, kde může odborně pomoci.",
    contributes: "Odbornost, vedení a zpětnou vazbu k doložené práci.",
    boundary: "Mentor nemá neomezený soukromý kanál k dítěti ani automatický přístup k jeho datům.",
    flows: [
      { to: "zak", label: "odborné vedení" },
      { to: "skola", label: "zpětná vazba k práci" },
    ],
  },
];

const POSITIONS = [
  [50, 8],
  [84, 28],
  [84, 70],
  [50, 92],
  [16, 70],
  [16, 28],
];

export default function Ecosystem() {
  const [active, setActive] = useState("zak");
  const role = ROLES.find((item) => item.id === active) || ROLES[0];
  const RoleIcon = role.icon;
  const positions = useMemo(() => Object.fromEntries(ROLES.map((item, index) => [item.id, POSITIONS[index]])), []);

  return (
    <section id="ekosystem" className="py-24 lg:py-32 bg-secondary/40 border-y border-border/60 scroll-mt-24">
      <div className="container-px max-w-7xl mx-auto min-w-0">
        <div className="max-w-2xl">
          <p className="eyebrow">Pansofie ekosystém</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Jedna Experience uprostřed. Každá role má vlastní přínos i hranici.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Klikni na roli a sleduj, co může do konkrétní Experience vstupovat. Vztahy nejsou otevřená sociální síť — vznikají jen v řízeném kontextu.
          </p>
        </div>

        <div className="hidden md:block mt-14">
          <div className="relative mx-auto max-w-2xl aspect-square">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              {ROLES.map((item) => {
                const [x, y] = positions[item.id];
                const highlighted = item.id === active || role.flows.some((flow) => flow.to === item.id);
                return <line key={item.id} x1="50" y1="50" x2={x} y2={y} stroke="currentColor" className={highlighted ? "text-primary/45" : "text-border"} strokeWidth={highlighted ? "0.7" : "0.35"} strokeDasharray={highlighted ? "2 2" : undefined} />;
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping motion-reduce:animate-none" />
                <Sparkles className="relative w-5 h-5" strokeWidth={1.8} />
                <span className="relative mt-1.5 text-[11px] font-semibold tracking-wide">Experience</span>
              </div>
            </div>

            {ROLES.map((item) => {
              const Icon = item.icon;
              const [x, y] = positions[item.id];
              const isActive = item.id === active;
              const isPartner = role.flows.some((flow) => flow.to === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                  className="absolute"
                  aria-pressed={isActive}
                >
                  <span className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border transition-all duration-300 ${isActive ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/20" : isPartner ? "bg-card text-primary border-primary/40 scale-105" : "bg-card text-foreground/70 border-border hover:border-primary/40"}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                    <span className="mt-1 text-[11px] font-semibold">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:hidden mt-10 flex min-w-0 flex-wrap gap-2.5">
          {ROLES.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <button key={item.id} type="button" onClick={() => setActive(item.id)} aria-pressed={isActive} className={`inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground/70"}`}>
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.8} /> <span className="min-w-0 break-words">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div key={role.id} className="mt-12 grid min-w-0 lg:grid-cols-3 gap-5" aria-live="polite">
          <div className="min-w-0 rounded-2xl bg-card border border-border p-8">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shrink-0"><RoleIcon className="w-5 h-5" strokeWidth={1.8} /></span>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-semibold text-foreground break-words">{role.name}</h3>
                <p className="text-xs text-primary font-semibold mt-0.5 break-words">{role.status}</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">Experience je centrum — role se kolem ní organizují podle konkrétní potřeby, oprávnění a bezpečných hranic.</p>
          </div>

          <div className="min-w-0 lg:col-span-2 grid sm:grid-cols-3 gap-5">
            <div className="min-w-0 rounded-2xl bg-card border border-border p-6"><p className="text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">Může získat</p><p className="mt-3 text-sm leading-relaxed text-foreground/85 break-words">{role.receives}</p></div>
            <div className="min-w-0 rounded-2xl bg-card border border-border p-6"><p className="text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">Přináší</p><p className="mt-3 text-sm leading-relaxed text-foreground/85 break-words">{role.contributes}</p></div>
            <div className="min-w-0 rounded-2xl bg-primary text-primary-foreground p-6"><p className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/70 font-semibold">Bezpečná hranice</p><p className="mt-3 text-sm leading-relaxed break-words">{role.boundary}</p></div>
          </div>

          <div className="min-w-0 lg:col-span-3 rounded-2xl border border-border bg-card/70 p-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Co může proudit z {role.flowFrom}</p>
            <div className="mt-4 flex min-w-0 flex-wrap gap-2.5">
              {role.flows.map((flow) => {
                const target = ROLES.find((item) => item.id === flow.to);
                return (
                  <span key={`${role.id}-${flow.to}`} className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl sm:rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-foreground">
                    <span className="font-semibold text-primary">{role.label}</span><ArrowRight className="w-3.5 h-3.5 shrink-0 text-primary" /><span className="min-w-0 break-words text-muted-foreground">{flow.label}</span><ArrowRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/50" /><span className="font-semibold">{target?.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
