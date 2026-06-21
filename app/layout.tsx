import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { ApiKeyProvider } from "@/context/ApiKeyContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Wanderlust — Explore the soul of any place",
  description:
    "An interactive travel & culture explorer. Discover attractions, cuisine, customs, history and language for anywhere on Earth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <ApiKeyProvider>{children}</ApiKeyProvider>
      </body>
    </html>
  );
}
