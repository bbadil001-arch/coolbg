# CoolBG.com — Next.js static-export project

Multi-page rebuild of the CoolBG background generator, structured for real
SEO and AdSense review (unlike the single-page artifact version, every route
below is a real, statically-generated HTML page with its own meta tags).

## Structure
```
pages/
  index.js            gallery + generator (home)
  about.js            About page
  privacy-policy.js   Privacy Policy (mentions ad cookies — required for AdSense)
  terms.js            Terms of Service
  contact.js          Contact
  blog/index.js       Blog listing
  blog/[slug].js       Individual articles, statically generated at build time
lib/
  generators.js       procedural background engine (pure functions)
  urlState.js         share-link encode/decode
  exportUtils.js       PNG/SVG export
  articles.js         blog content + target keywords
components/           Header, Footer, SEO, cards, editor modal, render surfaces
public/
  robots.txt
  sitemap.xml         every static + article route
```

## Run locally
```
npm install
npm run dev       # http://localhost:3000
```

## Build & deploy (static export)
```
npm run build      # outputs a static site to /out
```
`next.config.js` sets `output: "export"`, so `/out` is plain HTML/CSS/JS —
deployable to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static
host / S3 bucket with no server required.

## Before going live
1. Replace `https://www.coolbg.com` in `components/SEO.js`, `public/robots.txt`,
   and `public/sitemap.xml` with your real domain.
2. Replace `hello@coolbg.com` in `pages/contact.js` and `pages/privacy-policy.js`
   with a real, monitored address — AdSense reviewers do check this.
3. Add a real `public/ads.txt` file with your publisher ID once your AdSense
   account is approved (can't be generated before you have that ID).
4. Submit `sitemap.xml` in Google Search Console after deploying.

## Keyword research behind the blog content

Target keyword clusters chosen for `lib/articles.js`, based on known demand
patterns in the web-design-tooling space (confirm exact monthly volume with
Google Keyword Planner, Ahrefs, or Ubersuggest before expanding this further —
this project doesn't have live access to a keyword-volume API):

| Article | Primary target keywords |
|---|---|
| Free CSS Gradient Generator guide | css gradient generator, gradient generator free |
| SVG Background Patterns guide | svg pattern generator, svg background pattern |
| What Is a Mesh Gradient? | mesh gradient, mesh gradient generator |
| Best Free Website Background Generators 2026 | background generator, website background generator free |
| Hero Section Background Ideas | hero background ideas, landing page background |
| Animated Background (No JS Library) | animated background css, css animated gradient background |

These are commercial/informational hybrid queries — searchers are usually
evaluating tools, which matches CoolBG's actual product. Each article links
back to the relevant gallery category, so ranking traffic has a direct path
to the generator itself rather than being a dead-end blog post.

### Next steps to actually reach page one
- Content alone rarely ranks a brand-new domain on page one quickly — expect
  weeks to months, and expect to need a handful of backlinks (design tool
  directories like Product Hunt, BetterStack's "free tools" style listicles,
  dev.to / Hashnode posts linking back) alongside the on-page work here.
- Expand each article over time based on the "People also ask" questions
  Google shows for its target keyword — that's free, real intent data.
- Once you have Search Console data, use the "Hidden Gem" technique: find
  queries you already rank page 2 for and give them a dedicated article.
