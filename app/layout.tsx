import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ViralPulse | Short-form Creator Engine",
  description: "Automated social media intelligence, short-form publishing, and comment-to-DM funnels built with Google Store design language.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] antialiased selection:bg-[#d3e3fd] selection:text-[#041e49]">
        {children}
      </body>
    </html>
  );
}
