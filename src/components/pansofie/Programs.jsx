import React from "react";
import { Link } from "react-router-dom";
import { School, Heart, Users, Sparkles, ArrowUpRight } from "lucide-react";

const PROGRAMS = [
  {
    slug: "school",
    name: "Pansofie School",
    icon: School,
    description: "Škola propojuje skutečnou činnost, výstup, reflexi a oddělené lidské ověření do jedné Experience cesty.",
    badge: "FUNKČNÍ",
    reality: "Digitální workflow je ověřený na stagingu. Reálný školní field pilot ještě neproběhl.",
    tone: "functional",
  },
  {
    slug: "family",
    name: "Pansofie Family",
    icon: Heart,
    description: "Rodina může přinést podporu, podnět a samostatný kontext bez automatického přístupu k soukromé reflexi mladého člověka.",
    badge: "TESTUJEME",
    reality: "Samostatný Family runtime ještě není live.",
    tone: "testing",
  },
  {
    slug: "community",
    name: "Pansofie Community",
    icon: Users,
    description: "Obce, spolky a místní lidé mohou přinášet skutečné potřeby, místa a příležitosti, kde může vzniknout Experience.",
    badge: "JEŠTĚ NEPROBĚHLO",
    reality: "Zapojení vzniká podle konkrétní potřeby nebo Experience.",
    tone: "notYetRun",
  },
  {
    slug: "youth",
    name: "Pansofie Youth",
    icon: Sparkles,
    description: "Prostor pro vlastní projekty, samostatnost, práci, mentoring a zkušenosti mladých lidí 15+.",
    badge: "PLÁN",
    reality: "Samostatnou Youth vrstvu teprve rozvíjíme.",
    tone: "planned",
  },
];

const TONE = {
  functional: "bg-primary/10 text-primary border-primary/20",
  testing: "bg-amber-50 text-amber-800 border-amber-200",
  notYetRun: "bg-secondary text-foreground/70 border-border",
  planned: "bg-muted text-muted-foreground border-border",
};

export default function Programs() {
  return (
    <section id="programy" className="py-24 lg:py-32 bg-secondary/40 border-y border-border/60 scroll-mt-24">
      <div className="container-px max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="eyebrow">Co je připravené dnes</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Jedna metoda. Různé životní situace. Různá fáze rozvoje.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Oddělujeme technickou připravenost od toho, co už skutečně proběhlo v terénu. Každý program vede ke stejné jednotce: Experience.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {PROGRAMS.map((program) => {
            const Icon = program.icon;
            return (
              <Link
                key={program.name}
                to={`/program/${program.slug}`}
                className="group relative flex flex-col h-full rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_24px_60px_-30px_rgba(23,97,73,0.3)] hover:-translate-y-1 motion-reduce:transform-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="w-5 h-5" strokeWidth={1.7} />
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-all" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-foreground">{program.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{program.description}</p>
                <p className="mt-4 text-xs leading-relaxed text-foreground/70">{program.reality}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${TONE[program.tone]}`}>
                    {program.badge}
                  </span>
                  <span className="text-sm font-semibold text-primary inline-flex items-center gap-1">
                    Detail →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
