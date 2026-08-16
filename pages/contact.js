import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F4F5F7]">
      <SEO title="Contact — CoolBG.com" description="Get in touch with the CoolBG.com team." path="/contact" />
      <Header variant="compact" />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
        <h1 className="font-display font-bold text-3xl mb-6">Contact</h1>
        <div className="space-y-4 text-sm leading-relaxed text-white/70">
          <p>Questions, bug reports, or takedown requests can be sent to the address below.</p>
          <a href="mailto:hello@coolbg.com" className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-white text-sm transition-colors">
            <Mail size={15} /> hello@coolbg.com
          </a>
          <p className="text-white/40 text-xs">Replace this with your real support address before launch.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
