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
        <header className="border-b border-zinc-800 px-6 py-4">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <a href="/" className="text-xl font-semibold tracking-tight text-white">
              India in Charts
            </a>
            <nav className="flex gap-6 text-sm text-zinc-400">
              <a href="/" className="hover:text-white">
                Home
              </a>
              <a href="/payments" className="hover:text-white">
                Payments
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-800 px-6 py-4 text-center text-sm text-zinc-500">
          Data sourced from the Reserve Bank of India. Updated automatically.
        </footer>
      </body>
    </html>
  );
}
