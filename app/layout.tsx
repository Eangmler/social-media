import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "ViralPulse | Short-form Creator Engine",
  description: "Automated social media intelligence, short-form publishing, and comment-to-DM funnels built with Google Store design language.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ViralPulse",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b57d0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ViralPulse" />
      </head>
      <body className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] antialiased selection:bg-[#d3e3fd] selection:text-[#041e49]">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
