import SiteShell from "@/components/SiteShell";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://labbridge.co.kr"),

  title: "LABBRIDGE | 화장품 OEM ODM 제조 플랫폼",

  description:
    "화장품 OEM·ODM 개발부터 제형, 용기, 패키지까지 한 번에 확인할 수 있는 LABBRIDGE 화장품 제조 플랫폼입니다.",

  openGraph: {
    title: "LABBRIDGE | 화장품 OEM ODM 제조 플랫폼",
    description:
      "화장품 OEM·ODM 개발부터 제형, 용기, 패키지까지 한 번에 확인할 수 있는 LABBRIDGE 화장품 제조 플랫폼입니다.",
    url: "https://labbridge.co.kr",
    siteName: "LABBRIDGE",
    locale: "ko_KR",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <VisitTracker />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}