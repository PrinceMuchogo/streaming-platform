import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import { Provider } from "@/components/Provider/Provider";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Code Red Studios - Video Streaming Platform",
  description: "Experience seamless video streaming with Code Red Studios. Your gateway to innovative content and immersive entertainment.",
  keywords: "Code Red Studios, video streaming, online platform, entertainment, CodeRed, studios",
  openGraph: {
    title: "Code Red Studios",
    description: "A modern video streaming platform by Code Red Studios.",
    url: "https://www.coderedstudios.org",
    type: "website",
    images: [
      {
        url: "https://www.coderedstudios.org/logo.png",
        width: 800,
        height: 600,
        alt: "Code Red Studios Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@coderedstudios",
    title: "Code Red Studios - Video Streaming Platform",
    description: "Enjoy high-quality video streaming with Code Red Studios.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Head>
        <title>Code Red Studios - Video Streaming Platform</title>
        <meta name="description" content="Experience seamless video streaming with Code Red Studios." />
        <meta name="keywords" content="Code Red Studios, video streaming, online platform, entertainment, CodeRed, studios" />
        <meta name="author" content="Code Red Studios" />
        <meta property="og:title" content="Code Red Studios - Video Streaming Platform" />
        <meta property="og:description" content="Your gateway to innovative video streaming and immersive entertainment." />
        <meta property="og:image" content="https://www.coderedstudios.org/logo.png" />
        <meta property="og:url" content="https://www.coderedstudios.org" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Code Red Studios",
            "url": "https://www.coderedstudios.org",
            "logo": "https://www.coderedstudios.org/logo.png",
            "sameAs": [
              "https://www.facebook.com/coderedstudios",
              "https://www.twitter.com/coderedstudios",
              "https://www.linkedin.com/company/coderedstudios"
            ],
            "description": "Innovative video streaming solutions by Code Red Studios.",
          })}
        </script>
      </Head>
      <body suppressHydrationWarning={true}>
        <Provider>
          <ToastContainer />
          {children}
        </Provider>
      </body>
    </html>
  );
}
