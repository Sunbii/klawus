import "./globals.css";

export const metadata = {
  title: "K-lawus | 한인 법률·생활 정보 허브",
  description:
    "K-lawus는 한인 커뮤니티를 위한 법률 뉴스, 변호사 컬럼, 한인 업체 평점, 사기·분쟁 경고를 한곳에서 다루는 신뢰 매체입니다."
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
