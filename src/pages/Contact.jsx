import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import PublicNav from "@/components/pansofie/PublicNav";
import PublicFooter from "@/components/pansofie/PublicFooter";

const NEXT_STEPS = [
  {
    title: "Jste škola",
    text: "Projděte si podobu prvního školního ověření, jeho rozsah a bezpečné hranice.",
    to: "/pilot",
    label: "Prozkoumat školní pilot",
    icon: GraduationCap,
  },
  {
    title: "Jste firma nebo organizace",
    text: "Podívejte se, jak může partner přinést reálnou výzvu bez přístupu k soukromým datům dětí.",
    to: "/partneri",
    label: "Jak funguje partnerství",
    icon: Building2,
  },
  {
    title: "Chcete Pansofii nejdřív pochopit",
    text: "Projít můžete metodu nebo krátkou interaktivní ukázku bez odesílání osobních údajů.",
    to: "/zapojit-se?mode=simulator",
    label: "Vyzkoušet Pansofii za 60 sekund",
    icon: Sparkles,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-28 sm:pt-32">
        <section className="container-px max-w-5xl mx-auto py-12 sm:py-20">
          <div className="max-w-3xl">
            <span className="chip bg-primary/10 text-primary mb-5"><ShieldCheck size={14} /> Transparentní kontakt</span>
            <h1 className="text-4xl sm:text-6xl font-semibold font-display tracking-tight text-balance leading-[1.05]">Veřejný kontaktní kanál <span className="text-primary">zatím není spuštěný.</span></h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">Nechceme předstírat funkční formulář ani tvrdit, že jsme váš zájem uložili, dokud pro zájemce z veřejného webu nemáme schválený kontaktní proces.</p>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">Dokud nebude zveřejněný faktický kontakt odpovědné osoby nebo ověřený rezervační kanál, tato stránka nesbírá jméno, e-mail ani jiná osobní data.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {NEXT_STEPS.map(({ title, text, to, label, icon: Icon }) => (
              <article key={title} className="rounded-3xl border border-border bg-card/40 p-6 flex flex-col">
                <span className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><Icon size={20} /></span>
                <h2 className="mt-5 text-xl font-semibold font-heading">{title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{text}</p>
                <Link to={to} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
                  {label} <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>

          <section className="mt-8 rounded-[2rem] border border-border bg-card/35 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Co se stane teď</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold font-display">Nic se neodesílá ani neukládá.</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">Odkazy výše vedou pouze na existující veřejné části Pansofie. Nejde o odeslání poptávky, rezervaci ani přihlášení do pilotu. Skutečný veřejný kontaktní kanál zde doplníme až ve chvíli, kdy bude fakticky existovat a bude možné pravdivě popsat, kdo ho spravuje a jak se s údaji nakládá.</p>
            <Link to="/jak-funguje" className="mt-6 action-secondary w-full sm:w-auto px-6 py-3">Jak Pansofie funguje <ArrowRight size={16} /></Link>
          </section>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
