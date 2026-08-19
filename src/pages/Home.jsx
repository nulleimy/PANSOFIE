import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import PublicNav from "@/components/pansofie/PublicNav";
import PublicFooter from "@/components/pansofie/PublicFooter";
import Method from "@/components/pansofie/Method";
import ExperienceFlow from "@/components/pansofie/ExperienceFlow";
import Programs from "@/components/pansofie/Programs";
import MissionMap from "@/components/pansofie/MissionMap";
import Ecosystem from "@/components/pansofie/Ecosystem";
import { PATHS } from "@/lib/pansofieData";

const HERO_FLOW = ["Potřeba", "Akce", "Důkaz", "Reflexe", "Ověření", "Experience Passport"];

const HERO_TRUST = [
  "Škola drží bezpečný rámec",
  "Rodina přidává oddělený reálný kontext",
  "Partner přináší skutečný problém, ne hodnocení člověka",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background" id="top">
      <PublicNav />
      <main>
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-[-220px] left-[18%] h-[720px] w-[920px] max-w-[120vw] bg-[radial-gradient(ellipse_at_center,_rgba(23,97,73,0.12),_transparent_66%)]" />
          </div>

          <div className="container-px max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-12 lg:gap-16 items-center">
            <div>
              <span className="chip border border-primary/15 bg-card/70 text-primary mb-6 shadow-sm"><Sparkles size={14} /> Experience-first ekosystém</span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold font-display tracking-tight text-balance leading-[1.04]">
                Poznej sebe.<br />Tvoř s druhými. <span className="text-primary">Zlepšuj svět.</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed text-balance">
                Mladí lidé se učí spoustu důležitých věcí. Pansofie jim dává bezpečný způsob, jak je použít na skutečné potřebě — něco udělat, doložit, pochopit a navázat dalším krokem.
              </p>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Nezačíná přiděleným checklistem. Člověk může objevit nápad na misi, upravit ho podle sebe nebo přijít s vlastním — a teprve potom z něj v odpovídajícím rámci vzniká skutečná Experience.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a href="#mise" className="action-primary w-full sm:w-auto px-7 py-3.5">Objevit nápady na mise <ArrowRight size={18} /></a>
                <Link to="/zapojit-se?mode=simulator" className="action-secondary w-full sm:w-auto px-7 py-3.5">Vyzkoušet Pansofii za 60 sekund <ArrowRight size={17} /></Link>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-muted-foreground">Interaktivní ukázka nic neposílá na server a sama nevytváří Mission Run, ověření ani dopad.</p>

              <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-x-5 gap-y-2.5">
                {HERO_TRUST.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:pl-4">
              <div className="absolute -inset-5 -z-10 rounded-[3rem] bg-primary/[0.035] blur-2xl" aria-hidden="true" />
              <div className="surface-raised overflow-hidden rounded-[2rem] border border-primary/20 shadow-[0_28px_80px_-46px_rgba(23,97,73,0.55)]">
                <div className="flex items-start justify-between gap-5 px-6 py-5 sm:px-8 sm:py-6 border-b border-border/70">
                  <div>
                    <p className="eyebrow">Jedna Experience</p>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-semibold font-display">Zlepši svou školu</h2>
                  </div>
                  <span className="status-pill status-neutral shrink-0">Ukázkový scénář</span>
                </div>

                <div className="px-6 sm:px-8">
                  {HERO_FLOW.map((item, index) => (
                    <div key={item} className="grid grid-cols-[auto_1fr_auto] gap-4 items-center py-4 border-b border-border/70 last:border-b-0">
                      <span className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold ${index === HERO_FLOW.length - 1 ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">{item}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {index === 0
                            ? "Začíná konkrétní potřebou nebo vlastním nápadem."
                            : index === HERO_FLOW.length - 1
                              ? "Passport vzniká až po skutečné práci a oprávněném ověření."
                              : "Navazuje na předchozí skutečný krok."}
                        </p>
                      </div>
                      {index < HERO_FLOW.length - 1 ? <span className="text-xs font-semibold text-muted-foreground">→</span> : <CheckCircle2 size={18} className="text-primary" />}
                    </div>
                  ))}
                </div>

                <div className="m-4 sm:m-5 rounded-2xl bg-primary/[0.055] border border-primary/15 px-5 py-4 flex items-start gap-3">
                  <ShieldCheck size={19} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground font-semibold">Výsledek není známka člověka.</strong> Activity, output, adoption, outcome a impact zůstávají oddělené skutečnosti.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Method />
        <ExperienceFlow />
        <Programs />
        <MissionMap />
        <Ecosystem />

        <section id="sedm-cest" className="py-16 sm:py-20 border-t border-border/60 bg-card/35 scroll-mt-24">
          <div className="container-px max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <p className="eyebrow">7 cest rozvoje</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-semibold font-display tracking-tight">Co se v Experiences může rozvíjet.</h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">Cesty dávají Experiences společný jazyk. Nejsou to skóre člověka ani žebříček hodnoty.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {PATHS.map((path) => {
                const Icon = path.icon;
                return <span key={path.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium"><Icon size={16} style={{ color: path.color }} /> {path.name}</span>;
              })}
            </div>
          </div>
        </section>

        <section id="duvera" className="py-20 sm:py-24 border-t border-border/60 scroll-mt-24">
          <div className="container-px max-w-6xl mx-auto">
            <div className="rounded-[2rem] bg-foreground text-background p-8 sm:p-12 lg:p-14 shadow-[0_30px_80px_-48px_rgba(23,32,28,0.9)]">
              <div className="flex items-start gap-4">
                <span className="h-12 w-12 rounded-2xl bg-background/10 flex items-center justify-center shrink-0"><ShieldCheck size={23} /></span>
                <div className="max-w-4xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-background/60">Důvěra není doplněk</p>
                  <h2 className="mt-3 text-3xl sm:text-5xl font-semibold font-display tracking-tight text-balance">Přínos není skóre člověka.</h2>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm sm:text-base text-background/75">
                    <p>Žádné hodnocení lidské hodnoty, osobnosti nebo budoucí kariéry.</p>
                    <p>Žádný veřejný dětský profil ani otevřená dětská sociální síť.</p>
                    <p>Partner nekupuje pozitivní výsledek ani přístup k soukromým datům dítěte.</p>
                    <p>Rodina automaticky nevidí soukromou reflexi a mentor nemá neomezený soukromý kanál.</p>
                  </div>
                  <Link to="/bezpecnost" className="mt-7 inline-flex items-center gap-2 text-background font-semibold text-sm">Bezpečnost dětí <ArrowRight size={16} /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 border-t border-border/60 bg-card/35">
          <div className="container-px max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-semibold font-display tracking-tight text-balance">První field pilot má ověřit celý vztah, ne jen software.</h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-balance max-w-3xl mx-auto">Žák má získat skutečnou zkušenost. Učitel zvládnutelný postup. Rodina bezpečnou roli. Partner nebo komunita reálný důvod se zapojit. To všechno se musí potvrdit v realitě.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/zapojit-se?role=school" className="action-primary w-full sm:w-auto px-7 py-3.5">Chci zapojit školu <ArrowRight size={18} /></Link>
              <Link to="/zapojit-se?role=partner" className="action-secondary w-full sm:w-auto">Jsem partner / organizace <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
