import React from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const GROUPS = [
  {
    title: "Pansofie",
    links: [
      ["/#jak-funguje", "Jak to funguje", "anchor"],
      ["/#experience", "Experience", "anchor"],
      ["/#mise", "Mission Map", "anchor"],
      ["/#ekosystem", "Ekosystém", "anchor"],
    ],
  },
  {
    title: "Programy",
    links: [
      ["/program/school", "School", "route"],
      ["/program/family", "Family", "route"],
      ["/program/community", "Community", "route"],
      ["/program/youth", "Youth", "route"],
    ],
  },
  {
    title: "Bezpečnost",
    links: [
      ["/bezpecnost", "Bezpečnost dětí", "route"],
      ["/soukromi", "Soukromí", "route"],
      ["/podminky", "Hranice rolí", "route"],
      ["/pilot", "Pilot", "route"],
    ],
  },
];

function FooterLink({ to, label, type }) {
  const cls = "text-sm text-muted-foreground hover:text-foreground transition-colors";
  if (type === "anchor") return <a href={to} className={cls}>{label}</a>;
  return <Link to={to} className={cls}>{label}</Link>;
}

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-secondary/25">
      <div className="container-px max-w-7xl mx-auto py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground"><Leaf className="w-4 h-4" strokeWidth={2} /></span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-semibold tracking-tight">Pansofie</span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-semibold mt-1">Skutečné zkušenosti</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">Experience-first ekosystém. Poznej sebe. Tvoř s druhými. Zlepšuj svět.</p>
          </div>

          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] tracking-[0.2em] uppercase text-foreground font-semibold">{group.title}</p>
              <ul className="mt-5 space-y-3">
                {group.links.map(([to, label, type]) => <li key={`${group.title}-${label}`}><FooterLink to={to} label={label} type={type} /></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-7 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Pansofie · pre-field-pilot fáze</p>
          <p className="text-xs text-muted-foreground">Výsledek není známka člověka. Je to doložená zkušenost.</p>
        </div>
      </div>
    </footer>
  );
}
