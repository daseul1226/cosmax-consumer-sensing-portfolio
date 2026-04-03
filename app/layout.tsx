import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COSMAX Consumer Sensing Portfolio",
  description: "미국 스킨케어 리뷰를 고객 제안 인사이트로 전환한 코스맥스 지원용 포트폴리오 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
