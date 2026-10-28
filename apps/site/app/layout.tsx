import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

// Source Serif 4 (a classic textbook serif) for headings and big numbers, Source Sans 3 for body text.
const serif = Source_Serif_4({ variable: "--font-site-serif", subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lemmory: remember every formula",
  description: "Spaced-repetition formula practice for competition math academies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sourceSans.variable} h-full`}>
      <body className="min-h-full font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
