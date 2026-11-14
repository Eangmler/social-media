import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "useoura living — Curated Technology & Daily Essentials",
  description: "Dieter Rams-inspired minimalist tech and automotive upgrades, delivered next-day via the Oura network across Ghana.",
  keywords: ["useoura living", "minimalist tech", "Braun aesthetic", "Dieter Rams", "Ghana tech", "Accra delivery", "curated electronics"],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F7F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F7F7F5] text-[#1A1A1A] antialiased selection:bg-[#1A1A1A] selection:text-[#F7F7F5]">
        {children}
      </body>
    </html>
  );
}
