import "./globals.css";

export const metadata = {
  title: "Nova AI",
  description: "AI assistant website ready for Vercel deployment"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
