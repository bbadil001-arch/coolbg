import Link from "next/link";
import SEO from "../../components/SEO";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ARTICLES } from "../../lib/articles";

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F4F5F7]">
      <SEO
        title="Blog — Backgrounds, Gradients & CSS Guides | CoolBG.com"
        description="Guides on CSS gradients, SVG patterns, mesh gradients, and website background design."
        path="/blog"
      />
      <Header variant="compact" />
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
        <h1 className="font-display font-bold text-3xl mb-2">Blog</h1>
        <p className="text-white/50 text-sm mb-10">Guides on gradients, SVG patterns, mesh backgrounds, and CSS.</p>
        <div className="space-y-6">
          {ARTICLES.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="block rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] p-5 transition-colors">
              <div className="flex items-center gap-3 text-xs text-white/40 font-mono mb-2">
                <time dateTime={a.date}>{new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                <span>·</span>
                <span>{a.readingTime}</span>
              </div>
              <h2 className="font-display text-lg font-semibold mb-2">{a.title}</h2>
              <p className="text-sm text-white/60 leading-relaxed">{a.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
