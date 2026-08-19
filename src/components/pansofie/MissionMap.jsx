import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { School, Users, MapPin, Leaf, Heart, Sparkles, ArrowRight } from "lucide-react";

const OPPORTUNITIES = [
  { id: 1, name: "Praha", type: "school", x: 53, y: 36, title: "Navrhni klidové místo ve škole", note: "Ukázková školní mise · 1–2 hodiny" },
  { id: 2, name: "Brno", type: "community", x: 61, y: 66, title: "Zmapuj místo, které by šlo zlepšit", note: "Ukázková komunitní mise · venku" },
  { id: 3, name: "Ostrava", type: "help", x: 81, y: 49, title: "Nauč někoho něco, co umíš", note: "Ukázková mise pomoci · 30–60 minut" },
  { id: 4, name: "Plzeň", type: "nature", x: 28, y: 48, title: "Najdi jednu věc, kterou zbytečně vyhazujete", note: "Ukázková mise pro přírodu · doma nebo ve škole" },
  { id: 5, name: "Olomouc", type: "community", x: 70, y: 58, title: "Vytvoř návod, který někomu ušetří čas", note: "Ukázková komunitní mise · 30–90 minut" },
  { id: 6, name: "Liberec", type: "school", x: 53, y: 19, title: "Zlepši orientaci ve škole", note: "Ukázková školní mise · tým" },
];

const FILTERS = [
  ["all", "Vše"],
  ["school", "Škola"],
  ["community", "Komunita"],
  ["help", "Pomoc druhým"],
  ["nature", "Příroda"],
];

const TYPE = {
  school: { label: "Škola", icon: School, cls: "bg-primary text-primary-foreground" },
  community: { label: "Komunita", icon: Users, cls: "bg-amber-700 text-white" },
  help: { label: "Pomoc druhým", icon: Heart, cls: "bg-rose-700 text-white" },
  nature: { label: "Příroda", icon: Leaf, cls: "bg-emerald-700 text-white" },
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
            Tato první mapa je ukázka způsobu objevování misí, ne seznam skutečně zapojených škol nebo komunit. Budoucí mapa může spojovat lokální příležitosti, školní mise, komunitní potřeby i vlastní nápady.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2" aria-label="Filtr ukázkových misí">
          {FILTERS.map(([id, label]) => (
            <button key={id} type="button" onClick={() => chooseFilter(id)} aria-pressed={filter === id} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${filter === id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground/70 hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="relative rounded-3xl border border-border bg-card overflow-hidden min-h-[430px] lg:min-h-[520px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(23,97,73,0.08),transparent_42%),linear-gradient(rgba(23,97,73,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(23,97,73,0.045)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px]" aria-hidden="true" />
            <div className="absolute inset-[8%_7%] rounded-[42%_38%_46%_36%/35%_43%_40%_47%] border border-primary/15 bg-primary/[0.035]" aria-hidden="true" />
            <div className="absolute left-6 top-6 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground backdrop-blur">
              ILUSTRAČNÍ MAPA · NEJSOU TO POTVRZENÉ PILOTY
            </div>

            {shown.map((item) => {
              const TypeIcon = TYPE[item.type].icon;
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%, -50%)" }}
                  className="absolute group"
                  aria-label={`${item.name}: ${item.title}`}
                  aria-pressed={isSelected}
                >
                  <span className={`flex items-center justify-center rounded-full border-4 border-background shadow-lg transition-all ${isSelected ? "w-12 h-12 scale-110" : "w-10 h-10 hover:scale-110"} ${TYPE[item.type].cls}`}>
                    <TypeIcon className="w-4 h-4" strokeWidth={1.8} />
                  </span>
                  <span className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-background/95 px-2.5 py-1 text-[10px] font-semibold shadow-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}

            {selectedItem && (
              <div className="absolute left-5 right-5 bottom-5 sm:left-7 sm:right-auto sm:max-w-md rounded-2xl border border-primary/20 bg-background/95 p-5 shadow-xl backdrop-blur" aria-live="polite">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin className="w-4 h-4" /></span>
                  <div>
                    <p className="text-xs font-semibold text-primary">{selectedItem.name} · {TYPE[selectedItem.type].label}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold">{selectedItem.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{selectedItem.note}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-3xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4" /><p className="text-xs tracking-[0.18em] uppercase font-semibold">Inspirace</p></div>
            <h3 className="mt-3 font-display text-2xl font-semibold">Nemusíš čekat na přidělenou misi.</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Pansofie má směřovat k otevřené knihovně nápadů. Vybereš si inspiraci, upravíš ji podle sebe, nebo začneš úplně vlastním nápadem.</p>

            <div className="mt-6 space-y-2.5 overflow-y-auto lg:max-h-[250px] pr-1">
              {shown.map((item) => (
                <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={`w-full text-left rounded-2xl border p-4 transition-colors ${selectedItem?.id === item.id ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/30 hover:bg-secondary/50"}`}>
                  <p className="text-xs font-semibold text-primary">{TYPE[item.type].label} · {item.name}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6 space-y-3">
              <Link to="/zapojit-se?mode=simulator" className="action-primary w-full justify-center">+ Vymyslet vlastní misi <ArrowRight className="w-4 h-4" /></Link>
              <p className="text-xs text-muted-foreground leading-relaxed">Vlastní nápad je návrh. Nevytváří automaticky Mission Run ani neobchází školní, bezpečnostní nebo souhlasové hranice.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
