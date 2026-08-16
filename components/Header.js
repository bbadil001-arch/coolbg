import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Shuffle, Menu, X } from "lucide-react";
import { LogoMark, Wordmark } from "./LogoMark";
import { drawMesh, randomParams } from "../lib/generators";

const LINKS = [
  { href: "/#gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

// Site-wide header. The top nav bar is sticky on every page (mobile + desktop).
// On the home page a separate animated hero renders directly below the sticky
// bar; on inner pages (about/blog/etc.) the sticky bar is the whole header.
export default function Header({ variant = "compact", onRandomizeAll }) {
  const heroRef = useRef(null);
  const [heroParams] = useState(() => randomParams("animated", { noise: 0.08 }));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (variant !== "hero") return;
    const canvas = heroRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf;
    const resize = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    resize();
    window.addEventListener("resize", resize);
    const start = performance.now();
    const loop = (now) => {
      drawMesh(ctx, canvas.width, canvas.height, heroParams, reduceMotion ? 0 : now - start);
      if (!reduceMotion) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [variant, heroParams]);

  // Close the mobile menu on route change / resize back to desktop.
  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => { if (window.innerWidth >= 640) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navBar = (
    <div className="flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2.5" onClick={closeMenu}>
        <LogoMark size={30} />
        <Wordmark className="text-lg" />
      </Link>
      <div className="flex items-center gap-3">
        <nav className="hidden sm:flex items-center gap-5 text-sm text-white/70">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        {onRandomizeAll && (
          <button
            onClick={onRandomizeAll}
            className="hidden sm:flex items-center gap-2 rounded-full bg-white text-black text-sm font-semibold px-4 py-2 hover:bg-white/90 transition-colors shadow-lg"
          >
            <Shuffle size={15} /> Randomize All
          </button>
        )}
        {onRandomizeAll && (
          <button
            onClick={onRandomizeAll}
            aria-label="Randomize all backgrounds"
            title="Randomize All"
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:bg-white/90 transition-colors shadow-lg"
          >
            <Shuffle size={16} />
          </button>
        )}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </div>
  );

  const mobileMenu = menuOpen && (
    <div className="sm:hidden border-t border-white/10 bg-[#0B0E14]/95">
      <nav className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1 text-sm text-white/70">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={closeMenu}
            className="py-2.5 hover:text-white transition-colors border-b border-white/5 last:border-b-0"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  const stickyBar = (
    <div className="sticky top-0 z-50 bg-[#0B0E14]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">{navBar}</div>
      {mobileMenu}
    </div>
  );

  if (variant !== "hero") {
    return <header>{stickyBar}</header>;
  }

  return (
    <header>
      {stickyBar}
      <div className="relative overflow-hidden border-b border-white/10">
        <canvas ref={heroRef} className="absolute inset-0 w-full h-full opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-[#0B0E14]" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-14">
          <div className="max-w-2xl">
            <h1 className="font-display font-bold text-3xl sm:text-5xl leading-[1.05] tracking-tight">
              Backgrounds, generated live.
            </h1>
            <p className="font-body text-white/70 mt-4 text-base sm:text-lg max-w-xl">
              Every pattern on this page is code, rendered in your browser right now — the hero
              above included. Tune it, export it, ship it. No stock images, ever.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
