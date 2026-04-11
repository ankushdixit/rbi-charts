import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "India in Charts — RBI Data Visualized",
  description:
    "Beautiful, interactive visualizations of Reserve Bank of India statistical data. Payments, credit, savings, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fffdf9] text-[#1c1917]" suppressHydrationWarning>
        <header className="sticky top-0 z-50 bg-[#fffdf9]/92 backdrop-blur-xl border-b border-[#e7e1d8]">
          <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-3.5 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-serif text-base md:text-lg font-black text-[#1c1917]" style={{ fontFamily: "'Fraunces', serif" }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.584" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 8H12C13.1046 8 14 8.89543 14 10V11.1429C14 12.2474 13.1046 13.1429 12 13.1429H9.33333L13.3333 17" stroke="currentColor" strokeWidth="1.584" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 8L16 8" stroke="currentColor" strokeWidth="1.584" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 10.5718L16 10.5718" stroke="currentColor" strokeWidth="1.584" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              India in Charts
            </a>
            <nav className="flex items-center gap-4 md:gap-7 text-[13px] font-medium text-[#78716c]">
              <a href="/" className="hover:text-[#1c1917] transition-colors">
                Stories
              </a>
              <a href="/about" className="hover:text-[#1c1917] transition-colors">
                About
              </a>
              <a
                href="https://github.com/ankushdixit/rbi-charts"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1c1917] transition-colors"
              >
                GitHub ↗
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Analytics />
        <footer className="border-t border-[#e7e1d8] py-6 text-center text-xs text-[#78716c]">
          Data from the{" "}
          <a
            href="https://www.rbi.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#1c1917] transition-colors"
          >
            Reserve Bank of India
          </a>
          . Not affiliated. ·{" "}
          <a
            href="https://github.com/ankushdixit/rbi-charts"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#1c1917] transition-colors"
          >
            GitHub
          </a>{" "}
          ·{" "}
          <a href="/about" className="underline hover:text-[#1c1917] transition-colors">
            About
          </a>
        </footer>
      </body>
    </html>
  );
}
