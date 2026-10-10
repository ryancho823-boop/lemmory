import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

// Sora for headings and display numbers, Inter for body text.
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lemmory: remember every formula",
  description: "Spaced-repetition formula practice for competition math academies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} h-full`}>
      <body className="min-h-full font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
