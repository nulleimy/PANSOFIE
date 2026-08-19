import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Menu, X } from "lucide-react";

const NAV_LINKS = [
  ["/#jak-funguje", "Jak to funguje"],
  ["/#experience", "Experience"],
  ["/#mise", "Mise"],
  ["/#ekosystem", "Ekosystém"],
  ["/#programy", "Programy"],
];

const ROUTE_LINKS = [
  ["/pilot", "Pro školy"],
  ["/partneri", "Pro partnery"],
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border/60 bg-background/85 backdrop-blur-xl" : "bg-background/70 backdrop-blur-md"}`}>
      <div className="container-px max-w-7xl mx-auto h-20 flex items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Pansofie — domů">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
            <Leaf className="w-4 h-4" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">Pansofie</span>
            <span className="text-[9px] tracking-[0.18em] uppercase text-muted-foreground font-semibold mt-1">Skutečné zkušenosti</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-6" aria-label="Veřejná navigace">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full">
              {label}
            </a>
          ))}
          {ROUTE_LINKS.map(([to, label]) => (
            <Link key={to} to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2.5 py-2">Přihlásit</Link>
          <Link to="/zapojit-se" className="hidden 2xl:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors px-2.5 py-2">Zapojit se</Link>
          <Link to="/zapojit-se?mode=simulator" className="action-primary min-h-10 rounded-full px-5 py-2.5">
            Vyzkoušet 60 s <ArrowRight size={15} />
          </Link>
        </div>

        <button type="button" className="sm:hidden p-2 -mr-2 text-foreground" onClick={() => setOpen((value) => !value)} aria-label={open ? "Zavřít menu" : "Otevřít menu"} aria-expanded={open} aria-controls="public-mobile-menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div id="public-mobile-menu" className="sm:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <nav className="px-6 py-6 flex flex-col gap-2" aria-label="Mobilní navigace">
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="text-base text-foreground rounded-xl px-3 py-2 hover:bg-card">
                {label}
              </a>
            ))}
            {ROUTE_LINKS.map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="text-base text-foreground rounded-xl px-3 py-2 hover:bg-card">
                {label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="text-base text-foreground rounded-xl px-3 py-2">Přihlásit</Link>
            <Link to="/zapojit-se" onClick={() => setOpen(false)} className="text-base text-foreground rounded-xl px-3 py-2">Zapojit se</Link>
            <Link to="/zapojit-se?mode=simulator" onClick={() => setOpen(false)} className="mt-2 action-primary w-full justify-center rounded-full">
              Vyzkoušet 60 s <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
