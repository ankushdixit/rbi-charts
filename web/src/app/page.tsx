import Link from "next/link";
import { STORIES, THEMES } from "@/lib/stories";

const THEME_META: Record<
  string,
  { color: string; subtitle: string }
> = {
  "Payments Revolution": {
    color: "#3b82f6",
    subtitle:
      "How a billion people went from cash to QR codes in under a decade.",
  },
  "India's Money Story": {
    color: "#f59e0b",
    subtitle:
      "Savings, reserves, and credit — where the money goes and how it grows.",
  },
  "Deep Dives": {
    color: "#ef4444",
    subtitle:
      "Inflation expectations, capital flows, and the data behind the headlines.",
  },
};

const HERO_STATS = [
  { label: "UPI Monthly", value: "20.4B", color: "#3b82f6" },
  { label: "FX Reserves", value: "$668B", color: "#10b981" },
  { label: "Credit Cards", value: "110M+", color: "#f59e0b" },
  { label: "Stories", value: "9", color: "#a78bfa" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12">
        <h1 className="text-6xl font-black tracking-tight mb-4">
          The Indian Economy,
          <br />
          Visualized.
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mb-10">
          Beautiful, interactive charts from official Reserve Bank of India data.
          Updated automatically. Free forever.
        </p>

        <div className="flex gap-6 mb-8 flex-wrap">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-4"
            >
              <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story sections by theme */}
      {Object.entries(THEMES).map(([themeName, slugs]) => {
        const meta = THEME_META[themeName];
        const themeStories = slugs
          .map((slug) => STORIES.find((s) => s.slug === slug)!)
          .filter(Boolean);

        return (
          <section key={themeName} className="mx-auto max-w-7xl px-6 pb-16">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{ color: meta.color }}
            >
              {themeName}
            </p>
            <h2 className="text-3xl font-bold text-white mb-2">{themeName}</h2>
            <p className="text-zinc-500 mb-8">{meta.subtitle}</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {themeStories.map((story, i) => {
                const isLarge = i === 0 && themeStories.length >= 3;
                return (
                  <Link
                    key={story.slug}
                    href={story.href}
                    className={`group rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-600 transition-colors ${
                      isLarge ? "md:col-span-2 md:row-span-2" : ""
                    }`}
                  >
                    <p
                      className="text-xs font-semibold tracking-widest uppercase mb-3"
                      style={{ color: story.themeColor }}
                    >
                      {story.theme}
                    </p>
                    <p
                      className={`font-bold text-white mb-2 group-hover:text-blue-400 transition-colors ${
                        isLarge ? "text-2xl" : "text-lg"
                      }`}
                    >
                      {story.title}
                    </p>
                    <p
                      className={`text-zinc-500 ${
                        isLarge ? "text-base mb-6" : "text-sm mb-4"
                      }`}
                    >
                      {story.subtitle}
                    </p>
                    <p className="text-sm text-blue-400">Read story →</p>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
