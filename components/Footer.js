import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-5 sm:px-8 pb-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-mono">
      <span>&copy; {new Date().getFullYear()} CoolBG.com &mdash; rendered client-side, no assets fetched</span>
      <nav className="flex items-center gap-4">
        <Link href="/about" className="hover:text-white/70 transition-colors">About</Link>
        <Link href="/blog" className="hover:text-white/70 transition-colors">Blog</Link>
        <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
        <Link href="/contact" className="hover:text-white/70 transition-colors">Contact</Link>
      </nav>
    </footer>
  );
}
