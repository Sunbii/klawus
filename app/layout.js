import "./globals.css";

export const metadata = {
  title: "K-lawus | Evidence-led community protection",
  description:
    "K-lawus helps communities prevent fraud, navigate landlord-tenant disputes, and report harm with evidence-first workflows."
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
