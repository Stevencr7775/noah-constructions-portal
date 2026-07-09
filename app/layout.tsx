import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://noahconstructions.com'),
  title: {
    default: "NOAH INFRA PROJECTS | Premium Real Estate & Construction",
    template: "%s | NOAH INFRA PROJECTS"
  },
  description: "Leading developers of premium residential and commercial properties. Buy, sell, and explore our ongoing projects.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "NOAH INFRA PROJECTS",
    title: "NOAH INFRA PROJECTS | Premium Real Estate & Construction",
    description: "Leading developers of premium residential and commercial properties.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOAH INFRA PROJECTS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "NOAH INFRA PROJECTS",
    description: "Leading developers of premium residential and commercial properties.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}
