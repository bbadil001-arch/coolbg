import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F4F5F7]">
      <SEO title="About CoolBG.com" description="What CoolBG is, how the background generator works, and why it's free." path="/about" />
      <Header variant="compact" />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
        <h1 className="font-display font-bold text-3xl mb-6">About CoolBG</h1>
        <div className="space-y-4 text-sm leading-relaxed text-white/70">
          <p>CoolBG.com is an independent, free tool for generating procedural backgrounds directly in the browser — gradients, SVG patterns, and animated mesh canvases — with no image libraries, no accounts, and no watermarks.</p>
          <p>Every background is produced by an algorithm the moment you load the page. Nothing is fetched from a database, and nothing you customize is uploaded anywhere — nothing leaves your browser until you choose to export or share it.</p>
          <p>It's built and maintained as a small, focused project. If you spot a bug or have a feature request, reach out through the <a href="/contact" className="text-violet-300 hover:text-violet-200 underline">Contact page</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
