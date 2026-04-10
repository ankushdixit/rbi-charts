import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
          <div className="mx-auto max-w-[1100px] px-8 py-3.5 flex items-center justify-between">
            <a href="/" className="font-serif text-lg font-black text-[#1c1917]" style={{ fontFamily: "'Fraunces', serif" }}>
              India in Charts
            </a>
            <nav className="flex items-center gap-7 text-[13px] font-medium text-[#78716c]">
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
