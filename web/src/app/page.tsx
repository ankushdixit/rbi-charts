import Link from "next/link";
import { STORIES, THEMES, THEME_COLORS, STORY_COLORS } from "@/lib/stories";

const STATS = [
  { label: "UPI / month", value: "20.4B", color: STORY_COLORS["upi-explosion"] },
  { label: "FX Reserves", value: "$668B", color: STORY_COLORS["forex-fortress"] },
  { label: "Credit Cards", value: "110M+", color: STORY_COLORS["credit-card-wars"] },
  { label: "Savings / GDP", value: "6.0%", color: STORY_COLORS["savings-collapse"] },
];

const SPARKLINES: Record<string, React.ReactNode> = {
  "upi-explosion": (
    <path d="M0,28 L10,26 20,24 30,20 40,16 50,11 60,7 70,4 80,2" strokeWidth="2" fill="none" />
  ),
  "death-of-cash": (
    <path d="M0,28 L10,27 20,24 30,20 40,15 50,10 60,6 70,3 80,1" strokeWidth="2" fill="none" />
  ),
  "credit-card-wars": (
    <>
      <path d="M0,25 L10,24 20,22 30,20 40,17 50,14 60,10 70,6 80,3" strokeWidth="2" fill="none" />
      <path d="M0,28 L10,27 20,26 30,24 40,22 50,18 60,14 70,10 80,7" strokeWidth="1.5" fill="none" opacity="0.4" stroke={STORY_COLORS["upi-explosion"]} />
    </>
  ),
  "infra-shift": (
    <>
      <path d="M0,15 L10,14 20,13 30,13 40,14 50,15 60,17 70,19 80,22" strokeWidth="1.5" fill="none" opacity="0.5" stroke={STORY_COLORS["savings-collapse"]} />
      <path d="M0,28 L10,25 20,20 30,15 40,10 50,7 60,4 70,3 80,2" strokeWidth="2" fill="none" />
    </>
  ),
  "savings-collapse": (
    <>
      {[0, 12, 24, 36, 48, 60].map((x, i) => (
        <rect key={i} x={x} y={[6, 0, 4, 14, 12, 8][i]} width="8" height={[24, 30, 26, 16, 18, 22][i]} rx="2" opacity={[0.5, 0.7, 0.45, 0.55, 0.5, 0.6][i]} />
      ))}
    </>
  ),
  "forex-fortress": (
    <path d="M0,28 L10,27 20,26 30,24 40,18 50,12 60,7 70,4 80,2" strokeWidth="2" fill="none" />
  ),
  "money-flow": (
    <path d="M0,26 L10,24 20,22 30,20 40,18 50,14 60,10 70,6 80,3" strokeWidth="2" fill="none" />
  ),
  "inflation-gap": (
    <path d="M0,8 L10,12 20,6 30,14 40,10 50,18 60,12 70,16 80,14" strokeWidth="2" fill="none" />
  ),
  "hot-money": (
    <path d="M0,15 L10,8 20,22 30,5 40,20 50,10 60,18 70,12 80,16" strokeWidth="2" fill="none" />
  ),
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1100px] px-8 pt-24 pb-20 text-center">
        <p className="text-xs uppercase tracking-[3px] text-[#78716c] font-medium mb-6">
          Data Journalism · RBI · Open Source
        </p>
        <h1
          className="text-7xl font-black leading-[1.05] tracking-tight max-w-[800px] mx-auto mb-6"
          style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-3px" }}
        >
          The Indian Economy, Visualized.
        </h1>
        <p className="text-lg text-[#78716c] leading-relaxed max-w-[520px] mx-auto">
          Nine interactive stories from official Reserve Bank of India data.
          Free forever.
        </p>
      </section>

      {/* Stats ribbon */}
      <div className="flex justify-center gap-10 py-6 border-t border-b border-[#e7e1d8] max-w-[700px] mx-auto">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className="text-[28px] font-bold"
              style={{ fontFamily: "'Fraunces', serif", color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-[11px] uppercase tracking-[1.5px] text-[#78716c] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Story sections */}
      {Object.entries(THEMES).map(([themeName, theme]) => {
        const sectionColor = THEME_COLORS[themeName];
        const themeStories = theme.slugs
          .map((slug) => STORIES.find((s) => s.slug === slug)!)
          .filter(Boolean);

        return (
          <div key={themeName}>
            {/* Divider */}
            <div className="mx-auto max-w-[1100px] px-8 pt-14 flex items-center gap-4">
              <div className="flex-1 h-px bg-[#e7e1d8]" />
              <span
                className="text-[11px] uppercase tracking-[3px] font-medium"
                style={{ color: sectionColor }}
              >
                {themeName}
              </span>
              <div className="flex-1 h-px bg-[#e7e1d8]" />
            </div>

            {/* Section heading */}
            <div className="mx-auto max-w-[1100px] px-8 pt-8">
              <h2
                className="text-[28px] font-bold tracking-tight mb-1"
                style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-1px" }}
              >
                {theme.heading}
              </h2>
              <p className="text-sm text-[#78716c]">{theme.subtitle}</p>
            </div>

            {/* Story rows */}
            <div className="mx-auto max-w-[1100px] px-8 py-10">
              {themeStories.map((story, i) => {
                const storyColor = STORY_COLORS[story.slug];
                const sparkline = SPARKLINES[story.slug];

                return (
                  <Link
                    key={story.slug}
                    href={story.href}
                    className={`grid items-center gap-6 py-6 text-[#1c1917] no-underline hover:bg-[#f5f0eb] hover:border-transparent hover:rounded-xl hover:-mx-4 hover:px-4 ${
                      i === 0 ? "border-t border-[#ece7e0]" : ""
                    } border-b border-[#ece7e0]`}
                    style={{ gridTemplateColumns: "4px 180px 1fr auto" }}
                  >
                    <div
                      className="w-1 h-9 rounded-sm"
                      style={{ background: storyColor }}
                    />
                    <span
                      className="text-[11px] uppercase tracking-[2px] font-medium"
                      style={{ color: storyColor }}
                    >
                      {story.category}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-[22px] font-bold"
                        style={{
                          fontFamily: "'Fraunces', serif",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {story.title}
                      </span>
                      <span className="text-sm text-[#78716c]">
                        {story.subtitle}
                      </span>
                    </div>
                    <svg
                      width="80"
                      height="30"
                      viewBox="0 0 80 30"
                      className="opacity-60"
                      stroke={storyColor}
                      fill={storyColor}
                    >
                      {sparkline}
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
