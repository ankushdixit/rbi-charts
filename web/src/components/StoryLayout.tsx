import { STORY_COLORS, THEMES, STORIES } from "@/lib/stories";
import ContinueExploring from "./ContinueExploring";
import Link from "next/link";

interface Stat {
  label: string;
  value: string;
  /** If true, use the story accent color. Otherwise use ink color. */
  accent?: boolean;
}

interface Insight {
  title: string;
  body: string;
}

interface Props {
  slug: string;
  children: React.ReactNode; // The chart component
  stats?: Stat[];
  meta?: { label: string; value: string }[];
  insights?: Insight[];
}

export default function StoryLayout({
  slug,
  children,
  stats,
  meta,
  insights,
}: Props) {
  const story = STORIES.find((s) => s.slug === slug);
  const color = STORY_COLORS[slug] || "#78716c";

  // Find which theme this story belongs to
  let themeName = "";
  for (const [name, theme] of Object.entries(THEMES)) {
    if (theme.slugs.includes(slug)) {
      themeName = name;
      break;
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1100px] px-8 pt-16 pb-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs uppercase tracking-[2px] font-medium no-underline"
            style={{ color }}
          >
            {themeName}
          </Link>
          <span className="text-xs text-[#78716c]"> / </span>
        </div>

        <h1
          className="text-[56px] font-black leading-[1.08] max-w-[700px] mb-5"
          style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-2px" }}
        >
          {story?.title}
        </h1>

        <p className="text-xl text-[#78716c] leading-relaxed max-w-[600px] mb-10">
          {story?.subtitle}
        </p>

        {stats && stats.length > 0 && (
          <div className="flex gap-12 py-6 border-t border-b border-[#e7e1d8] mb-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-[32px] font-bold"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    color: stat.accent ? color : "#1c1917",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-[11px] uppercase tracking-[1.5px] text-[#78716c] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {meta && meta.length > 0 && (
          <div className="flex gap-8 py-4 text-[13px] text-[#78716c]">
            {meta.map((m) => (
              <div key={m.label}>
                <span className="font-medium text-[#1c1917]">{m.label}:</span>{" "}
                {m.value}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Chart */}
      <section className="mx-auto max-w-[1100px] px-8 pb-12">
        <div className="bg-white border border-[#e7e1d8] rounded-2xl p-8">
          {children}
        </div>
      </section>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <section className="mx-auto max-w-[1100px] px-8 pb-16">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-[#e7e1d8]" />
            <span
              className="text-[11px] uppercase tracking-[3px] font-medium"
              style={{ color }}
            >
              Key Insights
            </span>
            <div className="flex-1 h-px bg-[#e7e1d8]" />
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="pl-5 border-l-[3px]"
                style={{ borderColor: i === 0 ? color : "#e7e1d8" }}
              >
                <h4
                  className="text-lg font-bold mb-2 leading-snug"
                  style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-0.3px" }}
                >
                  {insight.title}
                </h4>
                <p className="text-sm text-[#78716c] leading-relaxed">
                  {insight.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Continue Exploring */}
      <ContinueExploring currentSlug={slug} />
    </div>
  );
}
