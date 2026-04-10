import Link from "next/link";
import { STORIES, THEMES, THEME_COLORS, STORY_COLORS } from "@/lib/stories";

const STATS = [
  { label: "UPI / month", value: "20.4B", color: STORY_COLORS["upi-explosion"] },
  { label: "FX Reserves", value: "$668B", color: STORY_COLORS["forex-fortress"] },
  { label: "Credit Cards", value: "110M+", color: STORY_COLORS["credit-card-wars"] },
  { label: "Savings / GDP", value: "6.0%", color: STORY_COLORS["savings-collapse"] },
];

/** Hand-crafted sparklines that mirror each chart's visual signature */
const SPARKLINES: Record<string, React.ReactNode> = {
  // Area chart — exponential UPI growth curve
  "upi-explosion": (
    <>
      <path d="M0,28 Q20,27 35,24 Q50,20 60,14 Q70,8 80,3" stroke={STORY_COLORS["upi-explosion"]} strokeWidth="2" fill="none" />
      <path d="M0,28 Q20,27 35,24 Q50,20 60,14 Q70,8 80,3 L80,30 L0,30Z" fill={STORY_COLORS["upi-explosion"]} opacity="0.15" />
    </>
  ),
  // Stacked area — multiple colored layers growing
  "death-of-cash": (
    <>
      <path d="M0,28 L10,27 20,26 30,25 40,24 50,22 60,20 70,18 80,17 L80,30 L0,30Z" fill="#e08a6d" opacity="0.3" />
      <path d="M0,26 L10,25 20,23 30,20 40,17 50,14 60,11 70,9 80,7 L80,17 L0,28Z" fill="#9b8ec4" opacity="0.3" />
      <path d="M0,24 L10,23 20,21 30,18 40,14 50,10 60,7 70,5 80,3 L80,7 L0,26Z" fill={STORY_COLORS["death-of-cash"]} opacity="0.4" />
    </>
  ),
  // Multiple racing lines — 3 banks diverging
  "credit-card-wars": (
    <>
      <path d="M0,20 L10,19 20,17 30,15 40,13 50,11 60,8 70,5 80,3" stroke={STORY_COLORS["credit-card-wars"]} strokeWidth="2" fill="none" />
      <path d="M0,24 L10,23 20,22 30,20 40,18 50,15 60,12 70,9 80,7" stroke={STORY_COLORS["upi-explosion"]} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M0,27 L10,26 20,25 30,24 40,22 50,19 60,16 70,13 80,11" stroke={STORY_COLORS["forex-fortress"]} strokeWidth="1.5" fill="none" opacity="0.4" />
    </>
  ),
  // Crossing lines — ATMs down (red), QR up (green)
  "infra-shift": (
    <>
      <path d="M0,10 L10,10 20,11 30,12 40,13 50,15 60,18 70,21 80,25" stroke="#d4827a" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M0,28 L10,25 20,22 30,18 40,14 50,10 60,7 70,5 80,3" stroke={STORY_COLORS["infra-shift"]} strokeWidth="2" fill="none" />
    </>
  ),
  // Stacked bars — volatile quarterly savings
  "savings-collapse": (
    <>
      {[0, 12, 24, 36, 48, 60].map((x, i) => (
        <rect key={i} x={x} y={[8, 2, 6, 16, 14, 10][i]} width="8" height={[22, 28, 24, 14, 16, 20][i]} rx="2" opacity={[0.5, 0.7, 0.45, 0.55, 0.5, 0.6][i]} />
      ))}
    </>
  ),
  // Single area — long exponential reserves growth
  "forex-fortress": (
    <>
      <path d="M0,28 L10,28 20,27 30,26 40,22 50,15 60,8 70,5 80,3" stroke={STORY_COLORS["forex-fortress"]} strokeWidth="2" fill="none" />
      <path d="M0,28 L10,28 20,27 30,26 40,22 50,15 60,8 70,5 80,3 L80,30 L0,30Z" fill={STORY_COLORS["forex-fortress"]} opacity="0.15" />
    </>
  ),
  // Multiple lines — 4 sectors, personal loans on top
  "money-flow": (
    <>
      <path d="M0,22 L20,20 40,17 60,14 80,10" stroke={STORY_COLORS["money-flow"]} strokeWidth="2" fill="none" />
      <path d="M0,24 L20,22 40,19 60,16 80,13" stroke={STORY_COLORS["infra-shift"]} strokeWidth="1.5" fill="none" opacity="0.4" />
      <path d="M0,26 L20,25 40,23 60,21 80,19" stroke={STORY_COLORS["upi-explosion"]} strokeWidth="1.5" fill="none" opacity="0.35" />
      <path d="M0,28 L20,27 40,26 60,25 80,24" stroke={STORY_COLORS["forex-fortress"]} strokeWidth="1.5" fill="none" opacity="0.3" />
    </>
  ),
  // Three parallel lines — current, 3m, 1y expectations (never converge)
  "inflation-gap": (
    <>
      <path d="M0,18 L10,16 20,19 30,14 40,17 50,12 60,15 70,13 80,14" stroke={STORY_COLORS["inflation-gap"]} strokeWidth="2" fill="none" />
      <path d="M0,12 L10,10 20,13 30,8 40,11 50,7 60,10 70,8 80,9" stroke={STORY_COLORS["inflation-gap"]} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M0,6 L10,4 20,7 30,3 40,6 50,2 60,5 70,3 80,4" stroke={STORY_COLORS["inflation-gap"]} strokeWidth="1" fill="none" opacity="0.3" />
    </>
  ),
  // Bars — above and below zero line showing FDI/FII volatility
  "hot-money": (
    <>
      <line x1="0" y1="15" x2="80" y2="15" stroke="#e7e1d8" strokeWidth="0.5" />
      {[0, 10, 20, 30, 40, 50, 60, 70].map((x, i) => {
        const vals = [6, -8, 4, -12, 10, -5, 8, -3];
        const h = Math.abs(vals[i]);
        const y = vals[i] > 0 ? 15 - h : 15;
        const color = vals[i] > 0 ? STORY_COLORS["upi-explosion"] : STORY_COLORS["savings-collapse"];
        return <rect key={i} x={x + 1} y={y} width="6" height={h} rx="1" fill={color} opacity="0.6" />;
      })}
    </>
  ),
  // Two parallel lines - current (red, below zero) and future (green, above zero)
  "consumer-confidence": (
    <>
      <line x1="0" y1="15" x2="80" y2="15" stroke="#e7e1d8" strokeWidth="0.5" />
      <path d="M0,20 Q10,22 20,24 Q30,19 40,22 Q50,18 60,20 Q70,21 80,19" stroke="#d4827a" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M0,8 Q10,6 20,9 Q30,5 40,7 Q50,4 60,6 Q70,5 80,6" stroke="#5ea88e" strokeWidth="1.5" fill="none" opacity="0.7" />
    </>
  ),
  // Rising bars - IT exports growing each quarter
  "it-exports": (
    <>
      {[0, 9, 18, 27, 36, 45, 54, 63].map((x, i) => {
        const heights = [10, 12, 14, 16, 18, 20, 23, 26];
        return <rect key={i} x={x} y={30 - heights[i]} width="7" height={heights[i]} rx="1" fill={STORY_COLORS["it-exports"]} opacity={0.5 + i * 0.06} />;
      })}
    </>
  ),
  // Stacked bars with a line on top - reserves illusion
  "reserves-illusion": (
    <>
      <line x1="0" y1="15" x2="80" y2="15" stroke="#e7e1d8" strokeWidth="0.5" />
      {[0, 14, 28, 42, 56].map((x, i) => {
        const ca = [-8, 4, -12, -6, -10];
        const val = [0, 0, 0, 2, 16];
        const caH = Math.abs(ca[i]);
        const caY = ca[i] > 0 ? 15 - caH : 15;
        return <g key={i}>
          <rect x={x} y={caY} width="10" height={caH} rx="1" fill="#d4827a" opacity="0.5" />
          <rect x={x} y={15 - val[i]} width="10" height={val[i] || 0.5} rx="1" fill="#c9a46c" opacity="0.6" />
        </g>;
      })}
    </>
  ),
  // Stacked area - personal loans growing
  "personal-loans": (
    <>
      <path d="M0,28 L13,26 27,22 40,16 53,15 67,14 80,13 L80,30 L0,30Z" fill={STORY_COLORS["it-exports"]} opacity="0.25" />
      <path d="M0,24 L13,22 27,18 40,12 53,11 67,10 80,9 L80,13 L67,14 53,15 40,16 27,22 13,26 0,28Z" fill="#9b8ec4" opacity="0.25" />
      <path d="M0,22 L13,20 27,16 40,10 53,9 67,8 80,7 L80,9 L67,10 53,11 40,12 27,18 13,22 0,24Z" fill="#e08a6d" opacity="0.3" />
      <path d="M0,22 L13,20 27,16 40,10 53,9 67,8 80,7" stroke={STORY_COLORS["personal-loans"]} strokeWidth="1.5" fill="none" />
    </>
  ),
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1100px] px-5 md:px-8 pt-16 md:pt-24 pb-14 md:pb-20 text-center">
        <p className="text-[10px] md:text-xs uppercase tracking-[3px] text-[#78716c] font-medium mb-4 md:mb-6">
          Data Journalism · RBI · Open Source
        </p>
        <h1
          className="text-4xl md:text-7xl font-black leading-[1.1] md:leading-[1.05] tracking-tight max-w-[800px] mx-auto mb-4 md:mb-6"
          style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-2px" }}
        >
          The Indian Economy, Visualized.
        </h1>
        <p className="text-base md:text-lg text-[#78716c] leading-relaxed max-w-[520px] mx-auto">
          Thirteen interactive stories from official Reserve Bank of India data.
          Free forever.
        </p>
      </section>

      {/* Stats ribbon */}
      <div className="grid grid-cols-2 md:flex md:justify-center gap-6 md:gap-10 py-6 border-t border-b border-[#e7e1d8] max-w-[700px] mx-auto px-5 md:px-0">
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
            <div className="mx-auto max-w-[1100px] px-5 md:px-8 pt-10 md:pt-14 flex items-center gap-4">
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
            <div className="mx-auto max-w-[1100px] px-5 md:px-8 pt-6 md:pt-8">
              <h2
                className="text-[28px] font-bold tracking-tight mb-1"
                style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-1px" }}
              >
                {theme.heading}
              </h2>
              <p className="text-sm text-[#78716c]">{theme.subtitle}</p>
            </div>

            {/* Story rows */}
            <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-8 md:py-10">
              {themeStories.map((story, i) => {
                const storyColor = STORY_COLORS[story.slug];
                const sparkline = SPARKLINES[story.slug];

                return (
                  <Link
                    key={story.slug}
                    href={story.href}
                    className={`flex items-start md:items-center gap-4 md:gap-6 py-5 md:py-6 text-[#1c1917] no-underline hover:bg-[#f5f0eb] hover:rounded-xl hover:-mx-3 hover:px-3 ${
                      i === 0 ? "border-t border-[#ece7e0]" : ""
                    } border-b border-[#ece7e0]`}
                  >
                    <div
                      className="w-1 h-9 rounded-sm shrink-0 mt-1 md:mt-0"
                      style={{ background: storyColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] md:text-[11px] uppercase tracking-[2px] font-medium"
                        style={{ color: storyColor }}
                      >
                        {story.category}
                      </span>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span
                          className="text-lg md:text-[22px] font-bold"
                          style={{
                            fontFamily: "'Fraunces', serif",
                            letterSpacing: "-0.5px",
                          }}
                        >
                          {story.title}
                        </span>
                        <span className="text-xs md:text-sm text-[#78716c]">
                          {story.subtitle}
                        </span>
                      </div>
                    </div>
                    <svg
                      width="80"
                      height="30"
                      viewBox="0 0 80 30"
                      className="opacity-60 shrink-0 hidden md:block"
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
