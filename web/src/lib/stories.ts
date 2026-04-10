/**
 * Central registry of all stories — used by landing page and "Continue Exploring" sections.
 */

export interface Story {
  slug: string;
  title: string;
  subtitle: string;
  category: string;  // short label for the card tag
  theme: keyof typeof THEMES;
  href: string;
  /** Simple sparkline data — normalized 0-1 values for the mini chart */
  sparkline: number[];
  sparklineType: "area" | "bars" | "rising" | "volatile";
}

export const THEME_COLORS: Record<string, string> = {
  "Payments Revolution": "#3b82f6",
  "India's Money Story": "#f59e0b",
  "Deep Dives": "#ef4444",
};

export const THEMES = {
  "Payments Revolution": {
    tag: "FEATURED STORIES",
    heading: "India's Payments Revolution",
    subtitle: "How a billion people went from cash to QR codes in under a decade.",
    slugs: ["upi-explosion", "death-of-cash", "credit-card-wars", "infra-shift"],
  },
  "India's Money Story": {
    tag: "DEEP DIVES",
    heading: "India's Money Story",
    subtitle: "Savings, reserves, and credit — where the money goes and how it grows.",
    slugs: ["savings-collapse", "forex-fortress", "money-flow"],
  },
  "Deep Dives": {
    tag: "SURVEYS & FLOWS",
    heading: "Expectations & Capital",
    subtitle: "Inflation expectations, capital flows, and the data behind the headlines.",
    slugs: ["inflation-gap", "hot-money"],
  },
};

export const STORIES: Story[] = [
  // Payments Revolution
  {
    slug: "upi-explosion",
    title: "The UPI Explosion",
    subtitle: "From zero to 20 billion monthly transactions in under a decade.",
    category: "Payments",
    theme: "Payments Revolution",
    href: "/stories/upi-explosion",
    sparkline: [0, 0.01, 0.02, 0.05, 0.1, 0.15, 0.22, 0.3, 0.4, 0.52, 0.65, 0.78, 0.88, 0.95, 1.0],
    sparklineType: "area",
  },
  {
    slug: "death-of-cash",
    title: "The Death of Cash",
    subtitle: "How digital payments replaced cheques and paper instruments.",
    category: "Trends",
    theme: "Payments Revolution",
    href: "/stories/death-of-cash",
    sparkline: [0.05, 0.06, 0.07, 0.08, 0.1, 0.15, 0.22, 0.35, 0.5, 0.65, 0.78, 0.88, 0.95, 1.0],
    sparklineType: "area",
  },
  {
    slug: "credit-card-wars",
    title: "Credit Card Wars",
    subtitle: "HDFC vs SBI vs ICICI vs Axis — a decade of competition across 15 banks.",
    category: "Competition",
    theme: "Payments Revolution",
    href: "/stories/credit-card-wars",
    sparkline: [0.2, 0.25, 0.3, 0.35, 0.4, 0.5, 0.55, 0.6, 0.58, 0.65, 0.75, 0.85, 0.92, 1.0],
    sparklineType: "rising",
  },
  {
    slug: "infra-shift",
    title: "3,600 QR Codes for Every ATM",
    subtitle: "ATMs are declining. QR codes are exploding. India's infrastructure shift.",
    category: "Infrastructure",
    theme: "Payments Revolution",
    href: "/stories/infra-shift",
    sparkline: [0.3, 0.35, 0.4, 0.42, 0.43, 0.42, 0.4, 0.38, 0.35, 0.32, 0.28, 0.25],
    sparklineType: "area",
  },
  // India's Money Story
  {
    slug: "savings-collapse",
    title: "The Great Rebalancing",
    subtitle: "Household savings: from deposits to mutual funds and equity.",
    category: "Savings",
    theme: "India's Money Story",
    href: "/stories/savings-collapse",
    sparkline: [0.8, 1.0, 0.83, 0.49, 0.53, 0.6],
    sparklineType: "bars",
  },
  {
    slug: "forex-fortress",
    title: "The Forex Fortress",
    subtitle: "$5.8B to $668B — how India built the world's 4th largest reserves.",
    category: "Reserves",
    theme: "India's Money Story",
    href: "/stories/forex-fortress",
    sparkline: [0.01, 0.02, 0.03, 0.05, 0.1, 0.17, 0.3, 0.45, 0.5, 0.55, 0.7, 0.85, 0.9, 0.95, 1.0],
    sparklineType: "area",
  },
  {
    slug: "money-flow",
    title: "Where Does India's Money Flow?",
    subtitle: "Personal loans overtook industry. Services beat agriculture.",
    category: "Credit",
    theme: "India's Money Story",
    href: "/stories/money-flow",
    sparkline: [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.72, 0.75, 0.78, 0.82, 0.85, 0.88, 0.92, 0.95, 1.0],
    sparklineType: "rising",
  },
  // Deep Dives
  {
    slug: "inflation-gap",
    title: "The Expectation Escalator",
    subtitle: "Households always expect inflation to get worse. 17 years of proof.",
    category: "Inflation",
    theme: "Deep Dives",
    href: "/stories/inflation-gap",
    sparkline: [0.7, 0.75, 0.8, 0.72, 0.65, 0.5, 0.45, 0.5, 0.55, 0.65, 0.8, 0.7, 0.6, 0.55],
    sparklineType: "volatile",
  },
  {
    slug: "hot-money",
    title: "Steady Hands vs Quick Exits",
    subtitle: "FDI stays. Portfolio money runs. 19 quarters of quarterly data.",
    category: "Capital Flows",
    theme: "Deep Dives",
    href: "/stories/hot-money",
    sparkline: [0.6, 0.7, 0.3, 0.8, 0.2, 0.65, 0.4, 0.75, 0.1, 0.55, 0.35, 0.5],
    sparklineType: "volatile",
  },
];

/**
 * Get related stories for a given story slug (excludes itself, max 3).
 */
export function getRelatedStories(currentSlug: string): Story[] {
  const current = STORIES.find((s) => s.slug === currentSlug);
  if (!current) return STORIES.filter((s) => s.slug !== currentSlug).slice(0, 3);

  const theme = THEMES[current.theme];
  const sameThemeSlugs = theme.slugs.filter((s) => s !== currentSlug);

  const related: Story[] = [];
  for (const slug of sameThemeSlugs) {
    const story = STORIES.find((s) => s.slug === slug);
    if (story) related.push(story);
  }

  if (related.length < 3) {
    for (const story of STORIES) {
      if (story.slug !== currentSlug && !related.find((r) => r.slug === story.slug)) {
        related.push(story);
        if (related.length >= 3) break;
      }
    }
  }

  return related.slice(0, 3);
}
