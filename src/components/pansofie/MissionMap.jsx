import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { School, Users, MapPin, Leaf, Heart, Sparkles, ArrowRight } from "lucide-react";

const OPPORTUNITIES = [
  { id: 1, name: "Praha", type: "school", x: 40, y: 45, title: "Navrhni klidové místo ve škole", note: "Ukázková školní mise · 1–2 hodiny" },
  { id: 2, name: "Brno", type: "community", x: 66, y: 66, title: "Zmapuj místo, které by šlo zlepšit", note: "Ukázková komunitní mise · venku" },
  { id: 3, name: "Ostrava", type: "help", x: 82, y: 51, title: "Nauč někoho něco, co umíš", note: "Ukázková mise pomoci · 30–60 minut" },
  { id: 4, name: "Plzeň", type: "nature", x: 22, y: 55, title: "Najdi jednu věc, kterou zbytečně vyhazujete", note: "Ukázková mise pro přírodu · doma nebo ve škole" },
  { id: 5, name: "Olomouc", type: "community", x: 68, y: 57, title: "Vytvoř návod, který někomu ušetří čas", note: "Ukázková komunitní mise · 30–90 minut" },
  { id: 6, name: "Liberec", type: "school", x: 47, y: 30, title: "Zlepši orientaci ve škole", note: "Ukázková školní mise · tým" },
];

const FILTERS = [
  ["all", "Vše"],
  ["school", "Školy"],
  ["community", "Komunity"],
  ["help", "Pomoc druhým"],
  ["nature", "Příroda"],
];

const TYPE = {
  school: { label: "Škola", icon: School },
  community: { label: "Komunita", icon: Users },
  help: { label: "Pomoc druhým", icon: Heart },
  nature: { label: "Příroda", icon: Leaf },
};

export default function MissionMap() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(OPPORTUNITIES[0].id);
  const shown = useMemo(() => OPPORTUNITIES.filter((item) => filter === "all" || item.type === filter), [filter]);
  const selectedItem = OPPORTUNITIES.find((item) => item.id === selected && shown.some((shownItem) => shownItem.id === item.id)) || shown[0];

  const chooseFilter = (value) => {
    setFilter(value);
    const first = OPPORTUNITIES.find((item) => value === "all" || item.type === value);
    if (first) setSelected(first.id);
  };

  return (
    <section id="mise" className="py-24 lg:py-32 bg-secondary/40 border-y border-border/60 scroll-mt-24">
      <div className="container-px max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="eyebrow">Mission Map</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            Mapa příležitostí k reálným Experiences.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Mapa je zatím vizuální ukázka způsobu objevování misí. Nejde o tvrzení, že zobrazená místa jsou skutečné pilotní školy nebo komunity.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"><School className="w-4 h-4 text-primary" /><strong>{OPPORTUNITIES.filter((item) => item.type === "school").length}</strong><span className="text-muted-foreground">školních inspirací</span></span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"><Users className="w-4 h-4 text-primary" /><strong>{OPPORTUNITIES.filter((item) => item.type === "community").length}</strong><span className="text-muted-foreground">komunitních inspirací</span></span>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="relative rounded-3xl border border-border bg-card overflow-hidden h-[420px] lg:h-[520px] shadow-[0_18px_50px_-42px_rgba(23,32,28,0.35)]">
            <iframe
              title="Ilustrační mapa České republiky"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=11.65%2C48.35%2C19.25%2C51.25&layer=mapnik"
              className="absolute inset-0 h-full w-full border-0 grayscale-[8%] saturate-[0.82] contrast-[0.96]"
            />
            <div className="absolute inset-0 bg-background/10 pointer-events-none" aria-hidden="true" />
            <div className="absolute left-4 top-4 z-20 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] tracking-[0.12em] font-semibold text-muted-foreground backdrop-blur">
              ILUSTRAČNÍ · NEJSOU TO POTVRZENÉ PILOTY
            </div>

            {shown.map((item) => {
              const Icon = TYPE[item.type].icon;
              const active = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%, -50%)" }}
                  className="absolute z-20"
                  aria-label={`${item.name}: ${item.title}`}
                  aria-pressed={active}
                >
                  <span className={`flex items-center justify-center rounded-full border-[3px] border-background shadow-md transition-all ${active ? "h-11 w-11 bg-primary text-primary-foreground scale-110" : "h-9 w-9 bg-primary/75 text-primary-foreground hover:bg-primary hover:scale-110"}`}>
                    <Icon className="w-4 h-4" strokeWidth={1.9} />
                  </span>
                </button>
              );
            })}
          </div>

          <aside className="rounded-3xl border border-border bg-card p-6 flex flex-col min-h-[420px] lg:min-h-[520px] shadow-[0_18px_50px_-42px_rgba(23,32,28,0.3)]">
            <div className="flex flex-wrap gap-2" aria-label="Filtr ukázkových misí">
              {FILTERS.map(([id, label]) => (
                <button key={id} type="button" onClick={() => chooseFilter(id)} aria-pressed={filter === id} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${filter === id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:text-foreground"}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-2.5 overflow-y-auto lg:max-h-[300px] pr-1">
              {shown.map((item) => {
                const Icon = TYPE[item.type].icon;
                return (
                  <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={`w-full flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${selectedItem?.id === item.id ? "border-primary/30 bg-primary/[0.045]" : "border-border bg-secondary/30 hover:bg-secondary/50"}`}>
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-primary/10 text-primary"><Icon className="w-4 h-4" strokeWidth={1.8} /></span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><MapPin className="w-3.5 h-3.5 text-muted-foreground" />{item.name}</span>
                      <span className="block mt-0.5 text-xs text-muted-foreground">{item.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4" /><span className="text-xs tracking-[0.15em] uppercase font-semibold">Vlastní nápad</span></div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Nemusíš čekat na přidělenou misi. Vyber inspiraci, uprav ji podle sebe nebo začni vlastním nápadem.</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Vlastní nápad je návrh a nevytváří automaticky Mission Run ani neobchází bezpečnostní nebo souhlasové hranice.</p>
              <Link to="/zapojit-se?mode=simulator" className="mt-4 action-primary w-full justify-center rounded-full">+ Vymyslet vlastní misi <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
