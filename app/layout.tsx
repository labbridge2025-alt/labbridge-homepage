import SiteShell from "@/components/SiteShell";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VisitTracker from "@/components/VisitTracker";
import MetaPixel from "@/components/MetaPixel";
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

  title: "화장품 제조·소량생산 1000개부터 | 랩브릿지 LABBRIDGE",

  description:
    "랩브릿지 LABBRIDGE는 화장품 OEM·ODM 전문 제조 플랫폼입니다. 화장품 소량생산 및 1000개 생산부터 제형 개발, 용기, 패키지, 충진·포장까지 한 번에 진행합니다.",

  keywords: [
    "랩브릿지",
    "LABBRIDGE",
    "화장품 제조",
    "화장품제조",
    "화장품 소량생산",
    "화장품 소량 생산",
    "화장품 1000개 생산",
    "화장품 1000개",
    "화장품 OEM",
    "화장품 ODM",
    "화장품 OEM ODM",
    "화장품 제조업체",
    "화장품 제조사",
    "화장품 제작",
    "화장품 소량제작",
    "화장품 브랜드 제작",
    "스킨케어 OEM",
    "스킨케어 ODM",
    "화장품 공장",
  ],

  verification: {
    other: {
      "naver-site-verification":
        "9206a188863f0beac1bd0fa1040da5f422081aab",
    },
  },

  alternates: {
    canonical: "https://labbridge.co.kr",
  },

  openGraph: {
    title: "화장품 제조·소량생산 1000개부터 | 랩브릿지 LABBRIDGE",
    description:
      "랩브릿지는 화장품 OEM·ODM, 소량생산, 1000개 생산부터 제형 개발, 용기, 패키지, 충진·포장까지 한 번에 진행합니다.",
    url: "https://labbridge.co.kr",
    siteName: "랩브릿지 LABBRIDGE",
    locale: "ko_KR",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
  <MetaPixel />
  <SiteShell>{children}</SiteShell>
</body>
    </html>
  );
}