import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0B0E14" />
      </Head>
      <body className="bg-[#0B0E14] text-[#F4F5F7] font-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
