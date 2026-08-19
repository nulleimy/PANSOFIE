import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  ChevronDown,
  Hand,
  Sparkles,
} from "lucide-react";
import { PROGRAMS } from "@/lib/pansofieData";
import PublicNav from "@/components/pansofie/PublicNav";
import PublicFooter from "@/components/pansofie/PublicFooter";

const META = {
  school: {
    status: "FUNKČNÍ",
    tone: "functional",
    tagline: "Skutečné Experiences propojené se školou — činnost, výstup, reflexe a oddělené lidské ověření.",
    description: "Digitální School workflow je ověřený na stagingu. Reálný školní field pilot ještě neproběhl, proto technickou připravenost neprezentujeme jako potvrzený pedagogický outcome.",
    methodology: [
      ["Najděte skutečnou potřebu", "Téma vzniká z konkrétní situace ve škole, ne z umělého testu člověka."],
      ["Domluvte bezpečný rámec", "Učitel drží rozsah, oprávnění, pravidla a přiměřenou zátěž."],
      ["Udělejte a doložte práci", "Žák nebo tým skutečně jedná a zachycuje výstupy, které lze ověřit."],
      ["Reflektujte a odděleně ověřte", "Soukromá reflexe člověka a školní ověření doložené práce jsou dvě různé vrstvy."],
    ],
    benefits: [
      ["Pracovat s reálnou potřebou", "Experience dává školní práci konkrétní kontext a další krok."],
      ["Udržet lidské hodnocení v mezích", "Ověřuje se práce a evidence, ne hodnota nebo osobnost člověka."],
      ["Propojit role bezpečně", "Rodina, mentor nebo partner mohou vstoupit jen v řízeném kontextu."],
      ["Zanechat dohledatelný výstup", "Po skutečné Experience může zůstat Passport s doloženou prací a reflexí."],
    ],
    contributes: "Škola přináší bezpečný rámec, pedagogické vedení, reálné potřeby a oddělené ověření doložené práce.",
    boundary: "Učitel posuzuje práci a evidenci, ne lidskou hodnotu, osobnost nebo budoucí potenciál žáka.",
    faq: [
      ["Je School už ověřený v reálném školním pilotu?", "Ne. Digitální workflow je otestovaný na stagingu; skutečný field pilot je samostatný další krok."],
      ["Vidí učitel soukromou reflexi automaticky?", "Ne. Reflexe a ověření práce jsou oddělené vrstvy a přístup se řídí konkrétním oprávněním."],
      ["Vzniká žákovi skóre?", "Ne. Pansofie nesmí převádět Experience na skóre lidské hodnoty nebo predikci budoucnosti."],
    ],
    cta: "/zapojit-se?role=school",
    ctaLabel: "Chci zapojit školu",
  },
  family: {
    status: "TESTUJEME",
    tone: "testing",
    tagline: "Rodina může přidávat podporu a reálný kontext, aniž by se z ní stal hodnotitel člověka.",
    description: "Samostatný Family runtime ještě není live. Rodinná účast je navržená jako dobrovolná a oddělená od soukromé reflexe mladého člověka.",
    methodology: [
      ["Navázat na konkrétní Experience", "Rodina nevstupuje do systému plošně, ale kolem srozumitelného kontextu."],
      ["Přidat podnět nebo podporu", "Může nabídnout zkušenost, prostředí, kontakt nebo praktickou pomoc."],
      ["Oddělit rodinný kontext", "Pohled z domova je samostatný vstup a nenahrazuje reflexi mladého člověka."],
      ["Respektovat soukromí", "Žádná rodinná role nevytváří automatický přístup ke všem datům Experience."],
    ],
    benefits: [
      ["Rozumět kontextu", "Rodina může vědět, proč konkrétní Experience vznikla a jak může pomoci."],
      ["Přidat skutečný svět", "Domácí prostředí může nabídnout potřebu, dovednost nebo zkušenost."],
      ["Zůstat mimo hodnocení člověka", "Rodinný vstup není známka ani lidské skóre."],
      ["Držet jasnou hranici soukromí", "Soukromá reflexe se automaticky nesdílí."],
    ],
    contributes: "Rodina přináší podnět, praktický kontext a dobrovolnou podporu odděleně od hodnocení člověka.",
    boundary: "Rodina automaticky nevidí soukromou reflexi mladého člověka ani kompletní Passport.",
    faq: [
      ["Musí být rodina součástí každé Experience?", "Ne. Zapojení se odvíjí od konkrétní Experience a musí dávat smysl."],
      ["Může rodina hodnotit žáka?", "Rodina může přidat vlastní kontext nebo zpětnou vazbu, ale Pansofie z toho nevytváří skóre člověka."],
      ["Je Family samostatný hotový produkt?", "Ne. Family runtime zatím není samostatně live a jeho zapojení se dál ověřuje."],
    ],
    cta: "/zapojit-se?role=family",
    ctaLabel: "Zajímá mě role rodiny",
  },
  community: {
    status: "JEŠTĚ NEPROBĚHLO",
    tone: "notYetRun",
    tagline: "Místní potřeba se může proměnit v konkrétní Experience bez automatického slibu adopce nebo dopadu.",
    description: "Samostatný Community runtime ještě není live. Obec, spolek nebo komunita mohou přinést lokální potřebu, kontext a možnost výstup později posoudit nebo vyzkoušet.",
    methodology: [
      ["Pojmenovat lokální potřebu", "Začíná se konkrétní situací, ne marketingovým zadáním."],
      ["Převést ji do bezpečné mise", "Rozsah musí odpovídat věku, možnostem týmu a reálnému prostředí."],
      ["Převzít výstup k posouzení", "Komunita může reagovat na doložený výstup bez povinnosti jej přijmout."],
      ["Evidovat skutečný další krok", "Použití, adopce, outcome a impact se neslévají do jednoho tvrzení."],
    ],
    benefits: [
      ["Přinést skutečnou potřebu", "Experience může vyrůst z místa, služby nebo situace, kterou lidé opravdu řeší."],
      ["Získat konkrétní výstup", "Komunita může posoudit práci, která vznikla v jasném rozsahu."],
      ["Navázat dalším krokem", "Pokud výstup dává smysl, může vzniknout další Experience nebo pilot."],
      ["Zachovat transparentnost", "Pansofie neoznačí předání návrhu automaticky jako dopad."],
    ],
    contributes: "Komunita přináší reálné prostředí, potřebu a kontext, kde může být výstup posouzen, vyzkoušen nebo použit.",
    boundary: "Předání návrhu není automaticky jeho přijetí, adopce, outcome ani impact a komunitní role nezískává přístup k soukromým datům dítěte.",
    faq: [
      ["Musí obec výstup použít?", "Ne. Posouzení, adopce a použití jsou samostatné stavy a evidují se jen tehdy, když skutečně nastanou."],
      ["Může komunita kontaktovat dítě přímo?", "Ne bez řízeného kontextu a oprávnění. Pansofie nemá vytvářet nekontrolovaný adult-child DM kanál."],
      ["Je Community už live?", "Samostatný Community runtime ještě není live; zapojení je navázané na konkrétní Experience."],
    ],
    cta: "/zapojit-se?role=community",
    ctaLabel: "Přinést lokální potřebu",
  },
  youth: {
    status: "PLÁN",
    tone: "planned",
    tagline: "Budoucí prostor pro vlastní projekty, samostatnost, práci, mentoring a zkušenosti mladých lidí 15+.",
    description: "Samostatný Youth runtime ještě není live. Youth je plánované pokračování stejného Experience principu s větší samostatností a důrazem na vlastní iniciativu.",
    methodology: [
      ["Začít vlastním záměrem", "Mladý člověk může přijít s vlastním problémem, otázkou nebo projektem."],
      ["Vymezit realistický krok", "Záměr se převádí na konkrétní, bezpečně proveditelnou Experience."],
      ["Pracovat s odborným kontextem", "Mentor nebo organizace mohou přispět jen v řízeném rámci."],
      ["Doložit a reflektovat", "Výstup a reflexe zůstávají oddělené od skórování člověka."],
    ],
    benefits: [
      ["Rozvíjet vlastní iniciativu", "Youth má směřovat k tomu, aby člověk mohl navrhovat vlastní Experiences."],
      ["Propojovat práci a projekty", "Skutečný úkol může mít kontext školy, organizace, komunity nebo vlastního projektu."],
      ["Pracovat s mentoringem", "Odborná pomoc má jasný rozsah a bezpečnostní hranici."],
      ["Budovat soukromý záznam zkušeností", "Passport je záznam práce a reflexe, ne veřejný žebříček."],
    ],
    contributes: "Youth přináší vlastní iniciativu, projekty, peer spolupráci a skutečné výstupy.",
    boundary: "Pansofie nesmí z větší samostatnosti vytvořit otevřenou dětskou sociální síť, nekontrolovaný mentoring ani skryté profilování člověka.",
    faq: [
      ["Je Youth dostupný dnes?", "Ne jako samostatný runtime. Jde o plánovanou vrstvu dalšího rozvoje produktu."],
      ["Bude Youth veřejná sociální síť?", "Ne. Experience zůstává hlavní jednotkou a soukromí je výchozí stav."],
      ["Bude systém doporučovat kariéru podle skóre?", "Ne. Pansofie nemá vytvářet skrytý human score ani předpověď lidské budoucnosti."],
    ],
    cta: "/zapojit-se?role=general",
    ctaLabel: "Sledovat další vývoj",
  },
};

const TONES = {
  functional: "bg-primary/10 text-primary border-primary/20",
  testing: "bg-amber-50 text-amber-800 border-amber-200",
  notYetRun: "bg-secondary text-foreground/70 border-border",
  planned: "bg-muted text-muted-foreground border-border",
};

function FaqItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="font-display text-base font-semibold text-foreground">{question}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>}
    </div>
  );
}

export default function ProgramDetail() {
  const { id } = useParams();
  const program = PROGRAMS.find((item) => item.id === id) || PROGRAMS[0];
  const meta = META[program.id] || META.school;
  const Icon = program.icon || Sparkles;

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-28 pb-24 lg:pt-36 lg:pb-32">
        <div className="container-px max-w-5xl mx-auto">
          <Link to="/#programy" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Zpět na programy
          </Link>

          <section className="mt-8 rounded-[2rem] border border-primary/20 bg-primary/[0.035] p-7 sm:p-10">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground"><Icon className="w-6 h-6" strokeWidth={1.8} /></span>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${TONES[meta.tone]}`}>{meta.status}</span>
            </div>
            <h1 className="mt-7 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">{program.name}</h1>
            <p className="mt-5 max-w-3xl text-xl leading-relaxed text-foreground/90 font-semibold">{meta.tagline}</p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">{meta.description}</p>
          </section>

          <section className="mt-16">
            <p className="eyebrow">Jak to funguje</p>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight">Jak vypadá cesta v {program.name}</h2>
            <div className="mt-8 space-y-4">
              {meta.methodology.map(([title, description], index) => (
                <div key={title} className="flex gap-5 rounded-2xl border border-border bg-card p-6">
                  <span className="font-display text-2xl font-semibold text-primary/30 shrink-0 w-10">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3 className="font-display text-lg font-semibold text-foreground">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-3xl border border-primary/20 bg-primary/[0.035] p-7 sm:p-8">
            <p className="eyebrow">Co tady můžeš dělat</p>
            <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">Najdi inspiraci, uprav ji podle sebe nebo začni vlastním nápadem.</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Mission Idea je inspirace, ne automaticky přiřazený úkol. Skutečný Mission Run vzniká až v odpovídajícím bezpečném a oprávněném workflow.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link to="/#mise" className="action-primary">Objevit nápady na mise <ArrowRight size={16} /></Link>
                <Link to="/zapojit-se?mode=simulator" className="action-secondary">+ Vymyslet vlastní</Link>
              </div>
            </div>
          </section>

          <section className="mt-16">
            <p className="eyebrow">Možnosti</p>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight">Co tato role může v Pansofii dělat</h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {meta.benefits.map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary mb-4"><Check className="w-4 h-4" strokeWidth={2.5} /></span>
                  <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-16 grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-border bg-card p-7">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-4"><Hand className="w-5 h-5" strokeWidth={1.8} /></span>
              <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">Co přináší</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{meta.contributes}</p>
            </div>
            <div className="rounded-2xl bg-primary text-primary-foreground p-7">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-foreground/15 text-primary-foreground mb-4"><ShieldCheck className="w-5 h-5" strokeWidth={1.8} /></span>
              <p className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/70 font-semibold">Bezpečná hranice</p>
              <p className="mt-3 text-sm leading-relaxed">{meta.boundary}</p>
            </div>
          </div>

          <section className="mt-16">
            <p className="eyebrow">Časté otázky</p>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight">Co by se mohlo hodit vědět</h2>
            <div className="mt-8 space-y-3">
              {meta.faq.map(([question, answer], index) => <FaqItem key={question} question={question} answer={answer} defaultOpen={index === 0} />)}
            </div>
          </section>

          <section className="mt-16 rounded-3xl border border-border bg-secondary/40 p-8 sm:p-10 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-balance">Chcete se zapojit do {program.name}?</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground leading-relaxed">Veřejný kontakt zatím nepředstíráme. Tato cesta vede na existující stránku zapojení, která transparentně ukazuje dostupné další kroky.</p>
            <Link to={meta.cta} className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 motion-reduce:transform-none">
              {meta.ctaLabel} <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
