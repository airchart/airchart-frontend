import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { FadeIn } from "@/components/ui/FadeIn";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AirChart - 항공권 가격 추이 분석",
  description:
    "항공권 가격 추이를 한눈에 확인하고 최적의 구매 시점을 찾아보세요",
  icons: {
    icon: "/image/logo.png",
    apple: "/image/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
        />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed top-4 right-4 z-50">
          <a
            href="https://github.com/hiimjayson/airchart-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="GitHub 저장소로 이동"
          >
            <GitHubLogoIcon className="size-8 text-gray-400" />
          </a>
        </div>
        <FadeIn>{children}</FadeIn>
      </body>
    </html>
  );
}
