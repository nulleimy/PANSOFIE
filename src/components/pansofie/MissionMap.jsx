import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { School, Users, MapPin, Leaf, Heart, Sparkles, ArrowRight } from "lucide-react";

const OPPORTUNITIES = [
  { id: 1, name: "Praha", type: "school", lat: 50.0755, lng: 14.4378, title: "Navrhni klidové místo ve škole", note: "Ukázková školní mise · 1–2 hodiny" },
  { id: 2, name: "Brno", type: "community", lat: 49.1951, lng: 16.6068, title: "Zmapuj místo, které by šlo zlepšit", note: "Ukázková komunitní mise · venku" },
  { id: 3, name: "Ostrava", type: "help", lat: 49.8209, lng: 18.2625, title: "Nauč někoho něco, co umíš", note: "Ukázková mise pomoci · 30–60 minut" },
  { id: 4, name: "Plzeň", type: "nature", lat: 49.7384, lng: 13.3736, title: "Najdi jednu věc, kterou zbytečně vyhazujete", note: "Ukázková mise pro přírodu · doma nebo ve škole" },
  { id: 5, name: "Olomouc", type: "community", lat: 49.5938, lng: 17.2515, title: "Vytvoř návod, který někomu ušetří čas", note: "Ukázková komunitní mise · 30–90 minut" },
  { id: 6, name: "Liberec", type: "school", lat: 50.7663, lng: 15.0543, title: "Zlepši orientaci ve škole", note: "Ukázková školní mise · tým" },
];

const FILTERS = [
  ["all", "Vše"],
  ["school", "Školy"],
  ["community", "Komunity"],
  ["help", "Pomoc druhým"],
  ["nature", "Příroda"],
];

const TYPE = {
  school: { label: "Škola", icon: School, color: "#245c49" },
  community: { label: "Komunita", icon: Users, color: "#517d6d" },
  help: { label: "Pomoc druhým", icon: Heart, color: "#7b6255" },
  nature: { label: "Příroda", icon: Leaf, color: "#55764f" },
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
      <div className="container-px max-w-7xl mx-auto min-w-0">
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
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"><School className="w-4 h-4 shrink-0 text-primary" /><strong>{OPPORTUNITIES.filter((item) => item.type === "school").length}</strong><span className="text-muted-foreground">školních inspirací</span></span>
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"><Users className="w-4 h-4 shrink-0 text-primary" /><strong>{OPPORTUNITIES.filter((item) => item.type === "community").length}</strong><span className="text-muted-foreground">komunitních inspirací</span></span>
        </div>

        <div className="mt-8 grid min-w-0 lg:grid-cols-[1fr_320px] gap-6">
          <div className="relative min-w-0 rounded-3xl border border-border bg-card overflow-hidden h-[420px] lg:h-[520px] shadow-[0_18px_50px_-42px_rgba(23,32,28,0.35)]">
            <MapContainer
              center={[49.8, 15.5]}
              zoom={7}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", background: "#eef0e9" }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {shown.map((item) => {
                const active = selectedItem?.id === item.id;
                const color = TYPE[item.type].color;
                return (
                  <CircleMarker
                    key={item.id}
                    center={[item.lat, item.lng]}
                    radius={active ? 12 : 9}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: active ? 0.72 : 0.4,
                      weight: active ? 3 : 2,
                    }}
                    eventHandlers={{ click: () => setSelected(item.id) }}
                  >
                    <Popup>
                      <div className="font-sans min-w-[180px]">
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{TYPE[item.type].label} · ilustrační mise</p>
                        <p className="text-xs mt-1.5">{item.title}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            <div className="absolute left-4 top-4 z-[500] max-w-[calc(100%-2rem)] rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] tracking-[0.12em] font-semibold text-muted-foreground backdrop-blur pointer-events-none">
              ILUSTRAČNÍ MAPA · NEJSOU TO POTVRZENÉ PILOTY
            </div>
          </div>

          <aside className="min-w-0 rounded-3xl border border-border bg-card p-6 flex flex-col min-h-[420px] lg:min-h-[520px] shadow-[0_18px_50px_-42px_rgba(23,32,28,0.3)]">
            <div className="flex min-w-0 flex-wrap gap-2" aria-label="Filtr ukázkových misí">
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
                  <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={`w-full min-w-0 flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${selectedItem?.id === item.id ? "border-primary/30 bg-primary/[0.045]" : "border-border bg-secondary/30 hover:bg-secondary/50"}`}>
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-primary/10 text-primary"><Icon className="w-4 h-4" strokeWidth={1.8} /></span>
                    <span className="min-w-0">
                      <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground"><MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" /><span className="min-w-0 break-words">{item.name}</span></span>
                      <span className="block mt-0.5 text-xs text-muted-foreground break-words">{item.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6">
              <div className="flex items-center gap-2 text-primary"><Sparkles className="w-4 h-4 shrink-0" /><span className="text-xs tracking-[0.15em] uppercase font-semibold">Vlastní nápad</span></div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Nemusíš čekat na přidělenou misi. Vyber inspiraci, uprav ji podle sebe nebo začni vlastním nápadem.</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Nevytváří automaticky Mission Run ani neobchází bezpečnostní nebo souhlasové hranice.</p>
              <Link to="/zapojit-se?mode=simulator" className="mt-4 action-primary w-full justify-center rounded-full">+ Vymyslet vlastní misi <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
