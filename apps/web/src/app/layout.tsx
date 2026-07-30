import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Desafio Volta à Vela", template: "%s | Desafio Volta à Vela" },
  description: "Fundação técnica do Desafio Volta à Vela 2026.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
