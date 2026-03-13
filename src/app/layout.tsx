import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MusicPress AI — PR Platform for Music Artists & Venues | Powered by TrueFans CONNECT",
  description:
    "AI-powered PR and media outreach platform built for music artists, bands, and live music venues. Find music journalists, bloggers, playlist curators, and podcasters. Distribute press releases, manage campaigns, and grow your audience — powered by TrueFans CONNECT.",
  keywords:
    "music PR, press release, music journalist database, playlist curators, venue PR, live music promotion, TrueFans CONNECT, music marketing, AI PR platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
