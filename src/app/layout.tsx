import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import StyledJsxRegistry from "./registry";
import JsonLd from "@/components/seo/JsonLd";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://lucide.in";

export const metadata: Metadata = {
  // metadataBase resolves every relative OG/canonical URL — without it, social
  // previews break. All metadata flows from here.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lucide Tech — Premium Web Design & Development Agency",
    template: "%s | Lucide Tech",
  },
  description:
    "Lucide Tech (Tech Lucide) is a premium web design & development studio. We build bespoke, high-performance websites, web apps, and SaaS products that turn attention into revenue.",
  applicationName: "Lucide Tech",
  // Naturally includes the brand variants we're ranking for.
  keywords: [
    "Lucide Tech",
    "Tech Lucide",
    "Lucide",
    "Lucide agency",
    "web design agency",
    "web development agency",
    "bespoke website design",
    "SaaS development",
    "UI UX design studio",
    "SEO agency India",
  ],
  authors: [{ name: "Lucide Tech", url: SITE_URL }],
  creator: "Lucide Tech",
  publisher: "Lucide Tech",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Lucide Tech",
    title: "Lucide Tech — Premium Web Design & Development Agency",
    description:
      "Lucide Tech (Tech Lucide) builds bespoke, high-performance websites, web apps, and digital products for ambitious brands.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucide Tech — Premium Web Design & Development Agency",
    description:
      "Lucide Tech (Tech Lucide) builds bespoke, high-performance websites and digital products.",
    site: "@techlucide",
    creator: "@techlucide",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Paste the Google Search Console token here once verified.
  // verification: { google: "your-token-here" },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#06080d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,300;1,400&family=JetBrains+Mono:wght@300;400&family=Poppins:wght@300;400&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=cabinet-grotesk@400,500,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
        <JsonLd />
      </head>
      <body className="min-h-screen bg-void text-white font-body">
        <StyledJsxRegistry>
          <Cursor />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
