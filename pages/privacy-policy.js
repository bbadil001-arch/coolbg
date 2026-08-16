import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F4F5F7]">
      <SEO title="Privacy Policy — CoolBG.com" description="How CoolBG.com handles data, cookies, and third-party advertising." path="/privacy-policy" />
      <Header variant="compact" />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
        <h1 className="font-display font-bold text-3xl mb-6">Privacy Policy</h1>
        <div className="space-y-5 text-sm leading-relaxed text-white/70">
          <p className="text-white/40 font-mono text-xs">Last updated: August 2026</p>
          <section>
            <h2 className="font-display font-semibold text-base text-white mb-2">What we collect</h2>
            <p>CoolBG.com does not require an account and does not store the backgrounds you create — every gradient, pattern, and mesh is generated and held only in your browser's memory.</p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-base text-white mb-2">Cookies &amp; advertising</h2>
            <p>This site may show ads served by third-party vendors, including Google. These vendors may use cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this site and/or other sites on the internet. You may opt out of personalized advertising by visiting Google's Ads Settings at <span className="font-mono">adssettings.google.com</span>.</p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-base text-white mb-2">Analytics</h2>
            <p>We may use basic, aggregate analytics (page views, referrers) to understand traffic to the site. No personally identifying information is sold or shared with third parties for purposes unrelated to operating the site.</p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-base text-white mb-2">Your choices</h2>
            <p>You can disable cookies at any time in your browser settings. Core background-generation, editing, and download features will continue to work without them.</p>
          </section>
          <section>
            <h2 className="font-display font-semibold text-base text-white mb-2">Contact</h2>
            <p>Questions about this policy can be sent through the <a href="/contact" className="text-violet-300 hover:text-violet-200 underline">Contact page</a>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
