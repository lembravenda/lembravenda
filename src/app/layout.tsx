import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"]
});

export const metadata: Metadata = {
  title: "LembraVenda",
  description:
    "Agenda de vendas para quem vende pelo WhatsApp organizar clientes, pedidos, cobranças e recompras.",
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1D6348"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakartaSans.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
