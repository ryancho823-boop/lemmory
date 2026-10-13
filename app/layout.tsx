import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

// Fraunces (a soft serif) for headings and big numbers, Source Sans 3 for body text.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lemmory: remember every formula",
  description: "Spaced-repetition formula practice for competition math academies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable} h-full`}>
      <body className="min-h-full font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
