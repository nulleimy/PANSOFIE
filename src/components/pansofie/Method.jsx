import React from "react";
import { Link } from "react-router-dom";
import { Compass, Hand, Lightbulb, Share2, ArrowRight } from "lucide-react";

const STEPS = [
  { n: "01", t: "Objev", d: "Najdi skutečný problém, potřebu nebo otázku.", icon: Compass },
  { n: "02", t: "Udělej", d: "Prozkoumej situaci, navrhni postup a jednej v realitě.", icon: Hand },
  { n: "03", t: "Pochop", d: "Dolož výstup a reflektuj, co fungovalo, selhalo a proč.", icon: Lightbulb },
  { n: "04", t: "Přispěj", d: "Předej výsledek dál a zvol další krok bez automatického tvrzení o dopadu.", icon: Share2 },
];

const THEMES = ["LIFE", "MAKER", "NATURE", "COMMUNITY", "CHALLENGE"];

export default function Method() {
  return (
    <section id="jak-funguje" className="py-24 lg:py-32 border-t border-border/60 scroll-mt-24">
      <div className="container-px max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="eyebrow">Metoda Pansofie</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Čtyři kroky, které vracejí učení do reality.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Metoda je jednoduchá na povrchu. Hloubka vzniká v tom, co člověk skutečně udělá, doloží,
            pochopí a přenese dál.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.n}
                className="group relative rounded-2xl border border-border bg-card p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-36px_rgba(23,97,73,0.35)] motion-reduce:transform-none"
              >
                <span className="absolute -top-4 -right-2 font-display text-7xl font-semibold text-primary/5 select-none" aria-hidden="true">
                  {step.n}
                </span>
                <span className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="w-5 h-5" strokeWidth={1.7} />
                </span>
                <h3 className="relative mt-5 font-display text-xl font-semibold text-foreground">{step.t}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl bg-secondary/50 border border-border p-6">
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground font-semibold whitespace-nowrap">
            Tematická prostředí
          </p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((theme) => (
              <span key={theme} className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold tracking-wide text-foreground/80">
                {theme}
              </span>
            ))}
          </div>
          <Link to="/jak-funguje" className="sm:ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
            Celý postup <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
