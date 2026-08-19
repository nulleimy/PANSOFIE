import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Hand,
  Lightbulb,
  Share2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  BookOpenCheck,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Objev",
    icon: Compass,
    context: "Tým si všimne, že ve škole chybí klidové místo pro soustředěnou práci.",
    action: "Zeptá se spolužáků, ověří, zda potřebu vnímají i další, a sepíše ji konkrétně.",
    output: "Krátký popis potřeby + anonymizované poznámky z rozhovorů.",
    roles: [
      ["Žák", "tým najde a pojmenuje potřebu"],
      ["Škola", "učitel schvaluje bezpečný rámec tématu"],
    ],
  },
  {
    n: "02",
    title: "Udělej",
    icon: Hand,
    context: "Tým navrhne dosažitelnou změnu — například dočasný klidový kout s jednoduchými pravidly použití.",
    action: "Dohodne se školou omezený pilot, připraví materiál a změnu skutečně provede.",
    output: "Plán pilotu + dokumentace před/po + jednoduché pozorování nebo měření.",
    roles: [
      ["Žák", "realizuje domluvený pilot"],
      ["Mentor", "může poradit s odbornou částí"],
      ["Škola", "schvaluje postup a bezpečnost"],
    ],
  },
  {
    n: "03",
    title: "Pochop",
    icon: Lightbulb,
    context: "Po skončení pilotu tým zkoumá, co se skutečně stalo a co z dostupných podkladů zatím říct nelze.",
    action: "Každý člen vytvoří vlastní reflexi. Rodinný nebo školní kontext se případně přidává odděleně.",
    output: "Reflexe týmu + popis pozorovaného výsledku a limitů evidence.",
    roles: [
      ["Žák", "reflektuje vlastní práci"],
      ["Rodina", "může přidat samostatný kontext z domova"],
      ["Škola", "odděleně ověřuje doloženou práci"],
    ],
  },
  {
    n: "04",
    title: "Přispěj",
    icon: Share2,
    context: "Tým předá výstup a navrhne, co by mohlo následovat.",
    action: "Představí doloženou práci škole nebo komunitě a požádá o posouzení dalšího kroku.",
    output: "Souhrn Experience + ověřitelné výstupy + návrh dalšího kroku.",
    roles: [
      ["Žák", "předává výsledek a návrh"],
      ["Škola", "ověřuje dokončení práce"],
      ["Komunita", "může návrh převzít k posouzení"],
    ],
  },
];

export default function ExperienceFlow() {
  const [step, setStep] = useState(0);
  const [showPassport, setShowPassport] = useState(false);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) setShowPassport(true);
    else setStep((value) => value + 1);
  };

  const restart = () => {
    setStep(0);
    setShowPassport(false);
  };

  return (
    <section id="experience" className="py-24 lg:py-32 border-t border-border/60 scroll-mt-24">
      <div className="container-px max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="eyebrow">Vyzkoušej si jednu Experience</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Projdi si krok za krokem, jak může vzniknout doložená zkušenost.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Ukázkový scénář <span className="text-foreground font-semibold">Zlepši svou školu</span>. Jde o interaktivní vysvětlení principu — klikání samo nevytváří skutečnou Experience ani ověření.
          </p>
        </div>

        <div className="mt-14 grid min-w-0 lg:grid-cols-[280px_1fr] gap-8">
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="flex w-full max-w-full lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" aria-label="Kroky ukázkové Experience">
              {STEPS.map((item, index) => {
                const StepIcon = item.icon;
                const done = index < step || showPassport;
                const active = index === step && !showPassport;
                return (
                  <button
                    key={item.n}
                    type="button"
                    onClick={() => {
                      setStep(index);
                      setShowPassport(false);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all shrink-0 lg:w-full ${active ? "border-primary bg-primary/5" : done ? "border-primary/30 bg-card" : "border-border bg-card/40"}`}
                    aria-current={active ? "step" : undefined}
                  >
                    <span className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${active ? "bg-primary text-primary-foreground" : done ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" strokeWidth={1.8} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-semibold">Krok {item.n}</span>
                      <span className={`block text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{item.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {!showPassport ? (
            <div key={step} className="min-w-0 rounded-3xl border border-border bg-card p-7 sm:p-9" aria-live="polite">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold">Krok {current.n} ze 4</p>
                    <h3 className="font-display text-2xl font-semibold text-foreground">{current.title}</h3>
                  </div>
                </div>
                <span className="hidden sm:block font-display text-4xl font-semibold text-primary/10" aria-hidden="true">{current.n}</span>
              </div>

              <div className="mt-6 h-1.5 rounded-full bg-secondary overflow-hidden" aria-hidden="true">
                <div className="h-full bg-primary rounded-full transition-[width] duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>

              <p className="mt-7 text-base leading-relaxed text-foreground/90">{current.context}</p>

              <div className="mt-6 rounded-2xl bg-secondary/50 border border-border p-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold">Co člověk nebo tým skutečně udělá</p>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">{current.action}</p>
              </div>

              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold">Co po kroku zůstane</p>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">{current.output}</p>
              </div>

              <div className="mt-5 min-w-0">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold mb-3">Kdo je v hře</p>
                <div className="flex min-w-0 flex-wrap gap-2">
                  {current.roles.map(([role, value]) => (
                    <span key={`${role}-${value}`} className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs">
                      <span className="font-semibold text-primary">{role}</span><span className="text-muted-foreground">·</span><span className="min-w-0 break-words text-foreground/75">{value}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep((value) => Math.max(0, value - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" /> Zpět
                </button>
                <button type="button" onClick={next} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 motion-reduce:transform-none">
                  {isLast ? "Ukázat možný výsledek" : "Další krok"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="min-w-0 rounded-3xl border border-primary/30 bg-gradient-to-br from-card to-primary/5 p-7 sm:p-9" aria-live="polite">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground shrink-0">
                  <BookOpenCheck className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">Ukázka výsledku</p>
                  <h3 className="font-display text-2xl font-semibold text-foreground">Experience Passport</h3>
                </div>
              </div>

              <p className="mt-6 text-base leading-relaxed text-foreground/90">
                Kdyby tým činnost skutečně provedl, doložil výstupy, prošel reflexí a oprávněným lidským ověřením, mohl by výsledný záznam vypadat například takto. Passport není známka člověka.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {STEPS.map((item) => (
                  <div key={item.n} className="flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-card p-4">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.n} · {item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 break-words">{item.output}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-primary text-primary-foreground p-5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/70 font-semibold">Další krok</p>
                <p className="mt-2 text-sm leading-relaxed">Předání návrhu není automaticky adopce, outcome ani dopad. Další krok se eviduje odděleně podle toho, co se skutečně stane.</p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card">
                  <RotateCcw className="w-4 h-4" /> Projít znovu
                </button>
                <a href="#mise" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                  Objevit nápady na mise <ArrowRight className="w-4 h-4" />
                </a>
                <Link to="/zapojit-se?mode=simulator" className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-6 py-2.5 text-sm font-semibold text-primary">
                  Vymyslet vlastní misi
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
