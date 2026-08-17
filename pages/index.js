import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SEO, { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import BackgroundCard from "../components/BackgroundCard";
import EditorModal from "../components/EditorModal";
import AIWizardModal from "../components/AIWizardModal";
import { CATEGORIES, TYPE_BY_CATEGORY, makeCard, randomParams, cssForCard } from "../lib/generators";
import { makeAICard } from "../lib/aiGenerate";
import { encodeStateToHash, decodeHashToState } from "../lib/urlState";
import { exportPNG } from "../lib/exportUtils";
import { ARTICLES } from "../lib/articles";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CoolBG.com",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any (runs in browser)",
  description: DEFAULT_DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  const [backgrounds, setBackgrounds] = useState([]);
  const [category, setCategory] = useState("All");
  const [editingCard, setEditingCard] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState("");
  const [aiWizardOpen, setAiWizardOpen] = useState(false);

  // generate the default gallery (24 cards spanning every category) on mount
  useEffect(() => {
    const types = ["gradient", "pattern", "mesh", "animated", "palette", "duotone", "stripes", "grain"];
    const generated = [];
    for (let i = 0; i < 24; i++) generated.push(makeCard(types[i % types.length]));
    setBackgrounds(generated);
  }, []);

  // parse a shared link on load
  useEffect(() => {
    const shared = decodeHashToState();
    if (shared) {
      setBackgrounds((prev) => [shared, ...prev]);
      setEditingCard(shared);
    }
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1800); };

  const filteredBackgrounds = useMemo(() => {
    if (category === "All") return backgrounds;
    const type = TYPE_BY_CATEGORY[category];
    return backgrounds.filter((c) => c.type === type);
  }, [backgrounds, category]);

  const randomizeAll = () => {
    setBackgrounds((prev) => prev.map((c) => ({ ...c, ...randomParams(c.type, { type: c.type }) })));
  };

  const handleAIGenerate = async (prompt) => {
    const card = await makeAICard(prompt); // throws on failure — caught by the wizard itself
    setBackgrounds((prev) => [card, ...prev]);
    setCategory("All");
    setAiWizardOpen(false);
    setEditingCard(card);
    showToast("✨ AI background generated");
  };

  const handleEditorChange = (updated) => {
    setEditingCard(updated);
    setBackgrounds((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDownload = async (card, sizeKey = "Desktop 1080p") => {
    try {
      await exportPNG(card, sizeKey);
      showToast(card.type === "ai-image" ? "Image downloaded" : "PNG downloaded");
    } catch (err) {
      if (err?.code === "opened-fallback") {
        showToast("Opened in a new tab — right-click to save");
      } else {
        showToast("Download failed — try again");
      }
    }
  };

  const handleShare = async (card) => {
    const hash = encodeStateToHash(card);
    const url = `${window.location.origin}/#${hash}`;
    try {
      if (navigator.share) { await navigator.share({ title: "CoolBG.com background", url }); return; }
    } catch { /* cancelled */ }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    } catch {
      showToast(url);
    }
  };

  const handleCopyCSS = async (card) => {
    try {
      await navigator.clipboard.writeText(cssForCard(card));
      setCopiedId(card.id);
      showToast("CSS copied to clipboard");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast("Could not copy — clipboard unavailable");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F4F5F7]">
      <SEO title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} path="/" jsonLd={JSON_LD} />

      <Header variant="hero" onRandomizeAll={randomizeAll} onOpenAIWizard={() => setAiWizardOpen(true)} />

      <div id="gallery" className="max-w-7xl mx-auto px-5 sm:px-8 pt-8">
        <nav className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-sm px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-colors
                ${category === cat ? "bg-violet-500/90 border-violet-400 text-white" : "bg-white/5 border-white/15 text-white/75 hover:bg-white/10"}`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto">
        {backgrounds.length === 0 ? (
          <div className="px-5 sm:px-8 py-16 text-center text-white/40 text-sm font-mono">generating backgrounds…</div>
        ) : filteredBackgrounds.length === 0 ? (
          <div className="px-5 sm:px-8 py-16 text-center text-white/40 text-sm font-mono">no backgrounds in this category yet — hit Randomize All</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {filteredBackgrounds.map((card) => (
              <BackgroundCard
                key={card.id}
                card={card}
                onOpenEditor={setEditingCard}
                onDownload={handleDownload}
                onShare={handleShare}
                onCopyCSS={handleCopyCSS}
                copiedId={copiedId}
              />
            ))}
          </div>
        )}
      </main>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-10 border-t border-white/10">
        <h2 className="font-display font-semibold text-xl mb-3">About CoolBG</h2>
        <div className="space-y-3 text-sm leading-relaxed text-white/65">
          <p>
            CoolBG.com is a free, browser-based tool for designers and developers who need a
            background without hunting through stock-photo sites. Every gradient, SVG pattern,
            color palette, duotone, stripe set, grain texture, and animated mesh you see here is
            generated by code the moment the page loads — nothing is pulled from a database or
            an image library, and nothing you create is ever uploaded to a server.
          </p>
          <p>
            Pick a style from the category filters, fine-tune colors, angle, density, and noise
            in the live editor, then export it as a PNG at desktop, mobile, or 4K resolution, or
            grab the raw SVG for vector patterns. Every background you customize can be shared
            as a link that reproduces the exact same result for anyone who opens it.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10 border-t border-white/10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-xl">From the blog</h2>
          <Link href="/blog" className="text-sm text-violet-300 hover:text-violet-200">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ARTICLES.slice(0, 3).map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="block rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-4 transition-colors">
              <h3 className="font-display text-sm font-semibold leading-snug mb-2">{a.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{a.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />

      <EditorModal
        card={editingCard}
        onClose={() => setEditingCard(null)}
        onChange={handleEditorChange}
        onDownload={handleDownload}
        onShare={handleShare}
        onCopyCSS={handleCopyCSS}
        copied={editingCard && copiedId === editingCard.id}
      />
      <AIWizardModal
        open={aiWizardOpen}
        onClose={() => setAiWizardOpen(false)}
        onGenerate={handleAIGenerate}
      />
      <Toast message={toast} />
    </div>
  );
}
