import Link from "next/link";
import SEO, { SITE_URL } from "../../components/SEO";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ARTICLES, getArticleBySlug } from "../../lib/articles";

export async function getStaticPaths() {
  return {
    paths: ARTICLES.map((a) => ({ params: { slug: a.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { notFound: true };
  return { props: { article } };
}

export default function ArticlePage({ article }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Organization", name: "CoolBG.com" },
    publisher: { "@type": "Organization", name: "CoolBG.com" },
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F4F5F7]">
      <SEO title={`${article.title} | CoolBG.com`} description={article.description} path={`/blog/${article.slug}`} jsonLd={jsonLd} />
      <Header variant="compact" />
      <main className="max-w-2xl mx-auto px-5 sm:px-8 py-14">
        <Link href="/blog" className="text-xs text-violet-300 hover:text-violet-200 font-mono">← All articles</Link>
        <div className="flex items-center gap-3 text-xs text-white/40 font-mono mt-4 mb-3">
          <time dateTime={article.date}>{new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
          <span>·</span>
          <span>{article.readingTime}</span>
        </div>
        <h1 className="font-display font-bold text-3xl leading-tight mb-6">{article.title}</h1>
        <p className="text-white/60 text-base leading-relaxed mb-8">{article.intro}</p>
        <article className="space-y-8">
          {article.sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-display font-semibold text-xl mb-3">{s.h2}</h2>
              <div className="space-y-3 text-sm leading-relaxed text-white/70">
                {s.body.map((p, j) => <p key={j}>{p}</p>)}
              </div>
            </section>
          ))}
        </article>
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/#gallery" className="inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-semibold px-4 py-2 hover:bg-white/90 transition-colors">
            Try the generator →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
