/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",       // static export -> deployable to any static host (Vercel, Netlify, S3, GitHub Pages)
  images: { unoptimized: true },
  reactStrictMode: true,
  trailingSlash: true,    // avoids 404s on some static hosts for nested routes like /blog/slug/
};
module.exports = nextConfig;
