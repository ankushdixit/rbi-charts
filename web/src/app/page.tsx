import Link from "next/link";
import { STORIES, THEMES, THEME_COLORS } from "@/lib/stories";
import Sparkline from "@/components/Sparkline";

const HERO_STATS = [
  { label: "UPI Monthly", value: "20.4B", color: "#3b82f6" },
  { label: "FX Reserves", value: "$668B", color: "#10b981" },
  { label: "Credit Cards", value: "110M+", color: "#f59e0b" },
  { label: "Net Savings", value: "6% GDP", color: "#ef4444" },
];

export default function Home() {
  return (
    <div>
      {/* Hero — dark */}
      <section className="bg-[#0f172a] pt-12 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-6xl font-black tracking-tight text-white mb-4">
            The Indian Economy,
            <br />
            Visualized.
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mb-10">
            Beautiful, interactive charts from official Reserve Bank of India
            data. Updated automatically. Free forever.
          </p>

          <div className="flex gap-4 flex-wrap">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-700 bg-[#1e293b] px-5 py-3"
              >
                <p className="text-[10px] font-semibold text-zinc-500 tracking-widest uppercase mb-0.5">
                  {stat.label}
                </p>
                <p
                  className="text-xl font-black"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story sections — white background */}
      <div className="bg-white text-zinc-900">
        {Object.entries(THEMES).map(([themeName, theme]) => {
          const accentColor = THEME_COLORS[themeName];
          const themeStories = theme.slugs
            .map((slug) => STORIES.find((s) => s.slug === slug)!)
            .filter(Boolean);

          return (
            <section key={themeName} className="mx-auto max-w-7xl px-6 py-14">
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: accentColor }}
              >
                {theme.tag}
              </p>
              <h2 className="text-3xl font-bold text-zinc-900 mb-1">
                {theme.heading}
              </h2>
              <p className="text-zinc-500 mb-8 max-w-xl">{theme.subtitle}</p>

              <div
                className={`grid gap-4 ${
                  themeStories.length >= 4
                    ? "md:grid-cols-2 lg:grid-cols-4"
                    : themeStories.length === 3
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2"
                }`}
              >
                {themeStories.map((story, i) => {
                  const isLarge =
                    i === 0 && themeStories.length >= 3;
                  return (
                    <Link
                      key={story.slug}
                      href={story.href}
                      className={`group relative rounded-xl overflow-hidden border border-zinc-800 bg-[#0f172a] p-6 flex flex-col justify-between hover:border-zinc-600 transition-colors ${
                        isLarge
                          ? "md:col-span-2 md:row-span-2 min-h-[320px]"
                          : "min-h-[200px]"
                      }`}
                    >
                      {/* Sparkline background */}
                      <div className="absolute bottom-0 left-0 right-0 opacity-60">
                        <Sparkline
                          data={story.sparkline}
                          color={accentColor}
                          type={story.sparklineType}
                          width={isLarge ? 600 : 300}
                          height={isLarge ? 140 : 80}
                        />
                      </div>

                      <div className="relative z-10">
                        <p
                          className="text-[10px] font-semibold tracking-widest uppercase mb-2"
                          style={{ color: accentColor }}
                        >
                          {story.category}
                        </p>
                        <p
                          className={`font-bold text-white mb-1 group-hover:text-opacity-80 transition-colors ${
                            isLarge ? "text-2xl" : "text-base"
                          }`}
                        >
                          {story.title}
                        </p>
                        <p
                          className={`text-zinc-400 ${
                            isLarge ? "text-sm" : "text-xs"
                          }`}
                        >
                          {story.subtitle}
                        </p>
                      </div>

                      <p
                        className="relative z-10 text-xs mt-4"
                        style={{ color: accentColor }}
                      >
                        Read story →
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
