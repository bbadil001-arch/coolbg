import Head from "next/head";

const SITE_URL = "https://www.coolbg.com";
const DEFAULT_DESCRIPTION =
  "Generate, customize, and download unlimited procedural backgrounds — gradients, SVG patterns, color palettes, duotones, stripes, grain textures, and animated mesh canvases. Free, no signup, export as PNG or SVG.";
const DEFAULT_TITLE = "CoolBG.com — Free Procedural Background Generator (Gradients, SVG, Mesh)";

// Central <Head> component so every page ships real, server-rendered meta
// tags — this is the piece a client-only SPA cannot do, and the reason
// this project moved to Next.js static export.
export default function SEO({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, path = "/", jsonLd = null }) {
  const url = SITE_URL + path;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="CoolBG.com" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </Head>
  );
}

export { SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_TITLE };
