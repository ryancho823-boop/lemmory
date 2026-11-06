import type { Metadata } from "next";
import { connection } from "next/server";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

// Fraunces (a soft serif) for headings and big numbers, Source Sans 3 for body text.
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lemmory for teachers",
  description: "Assign formulas and see what your class is forgetting.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Rendered per request, so every page gets its script nonce (see proxy.ts).
  await connection();
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable} h-full`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
