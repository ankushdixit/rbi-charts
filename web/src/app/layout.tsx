import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f172a] text-white" suppressHydrationWarning>
        <header className="border-b border-zinc-800">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-lg font-bold tracking-tight text-white">
              India in Charts
            </a>
            <nav className="flex items-center gap-6 text-sm text-zinc-400">
              <a href="/" className="hover:text-white transition-colors">
                Stories
              </a>
              <a href="/about" className="hover:text-white transition-colors">
                About
              </a>
              <a
                href="https://github.com/ankushdixit/rbi-charts"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>
              Data sourced from the{" "}
              <a
                href="https://www.rbi.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Reserve Bank of India
              </a>
              . Not affiliated with RBI.
            </p>
            <div className="flex gap-6">
              <a
                href="https://github.com/ankushdixit/rbi-charts"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a href="/about" className="hover:text-white transition-colors">
                About
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
