import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8"/>
        <link rel="icon" href="/favicon.svg"/>
        <meta name="theme-color" content="#0B0E14"/>

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3FD5DJ3RQ6"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-3FD5DJ3RQ6');
            `,
          }}
        />
      </Head>
      <body className="bg-[#0B0E14] text-[#F4F5F7] font-body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
