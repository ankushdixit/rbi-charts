/**
 * Central registry of all stories - used by landing page and "Continue Exploring" sections.
 */

export interface Story {
  slug: string;
  title: string;
  subtitle: string;
  category: string;  // short label for the card tag
  theme: keyof typeof THEMES;
  href: string;
  /** Simple sparkline data - normalized 0-1 values for the mini chart */
  sparkline: number[];
  sparklineType: "area" | "bars" | "rising" | "volatile";
}

/** Section accent colors - used for divider labels */
export const THEME_COLORS: Record<string, string> = {
  "Payments Revolution": "#5b7fc4",
  "India's Money Story": "#c4976a",
  "Deep Dives": "#5b9ea6",
};

/** Per-story colors - pastel palette */
export const STORY_COLORS: Record<string, string> = {
  "upi-explosion": "#6190e8",
  "death-of-cash": "#6aab93",
  "credit-card-wars": "#e08a6d",
  "infra-shift": "#9b8ec4",
  "savings-collapse": "#d4827a",
  "forex-fortress": "#5ea88e",
  "money-flow": "#c9a46c",
  "inflation-gap": "#c4976a",
  "hot-money": "#5b9ea6",
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
    subtitle: "Savings, reserves, and credit - where the money goes and how it grows.",
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
    sparkline: [0.011, 0.016, 0.011, 0.03, 0.058, 0.062, 0.074, 0.123, 0.154, 0.17, 0.239, 0.27, 0.305, 0.316, 0.406, 0.463, 0.494, 0.536, 0.63, 0.674, 0.7, 0.73, 0.854, 0.918, 0.94, 0.937],
    sparklineType: "area",
  },
  {
    slug: "death-of-cash",
    title: "The Death of Cash",
    subtitle: "How digital payments replaced cheques and paper instruments.",
    category: "Trends",
    theme: "Payments Revolution",
    href: "/stories/death-of-cash",
    sparkline: [0.001, 0.001, 0.013, 0.015, 0.024, 0.034, 0.051, 0.061, 0.088, 0.08, 0.132, 0.154, 0.246, 0.3, 0.388, 0.452, 0.577, 0.652, 0.777, 0.849, 0.999],
    sparklineType: "area",
  },
  {
    slug: "credit-card-wars",
    title: "Credit Card Wars",
    subtitle: "HDFC vs SBI vs ICICI vs Axis - a decade of competition across 15 banks.",
    category: "Competition",
    theme: "Payments Revolution",
    href: "/stories/credit-card-wars",
    sparkline: [0.003, 0.022, 0.043, 0.071, 0.002, 0.019, 0.047, 0.059, 0.138, 0.173, 0.243, 0.308, 0.356, 0.42, 0.461, 0.466, 0.509, 0.537, 0.605, 0.7, 0.798, 0.894, 0.978],
    sparklineType: "rising",
  },
  {
    slug: "infra-shift",
    title: "3,600 QR Codes for Every ATM",
    subtitle: "ATMs are declining. QR codes are exploding. India's infrastructure shift.",
    category: "Infrastructure",
    theme: "Payments Revolution",
    href: "/stories/infra-shift",
    sparkline: [0.0, 0.081, 0.173, 0.282, 0.456, 0.657, 0.74, 0.819, 0.881, 0.916, 0.911, 0.901, 0.911, 0.929, 0.911, 0.946, 0.937, 0.981, 0.996, 1.0, 0.969, 0.957, 0.914],
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
    sparkline: [0.0, 0.495, 0.307, 0.607, 0.752, 0.696, 0.505, 1.0, 0.584, 0.249, 0.446, 0.826, 0.102, 0.122, 0.115, 0.443, 0.231, 0.094, 0.116, 0.889, 0.651, 0.536, 0.067, 0.906],
    sparklineType: "bars",
  },
  {
    slug: "forex-fortress",
    title: "The Forex Fortress",
    subtitle: "$5.8B to $668B - how India built the world's 4th largest reserves.",
    category: "Reserves",
    theme: "India's Money Story",
    href: "/stories/forex-fortress",
    sparkline: [0.0, 0.002, 0.007, 0.012, 0.053, 0.439, 0.511, 0.832, 0.842, 0.853, 0.832, 0.848, 0.874, 0.911, 0.914, 0.932, 0.97, 0.971, 0.914, 0.902, 0.962, 0.988],
    sparklineType: "area",
  },
  {
    slug: "money-flow",
    title: "Where Does India's Money Flow?",
    subtitle: "Personal loans overtook industry. Services beat agriculture.",
    category: "Credit",
    theme: "India's Money Story",
    href: "/stories/money-flow",
    sparkline: [0.0, 0.146, 0.374, 0.739, 0.795, 0.811, 0.824, 0.84, 0.868, 0.887, 0.899, 0.914, 0.937, 0.946, 0.972, 1.0],
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
    sparkline: [0.813, 0.08, 0.68, 0.88, 0.867, 0.813, 0.733, 0.947, 1.0, 0.627, 0.493, 0.293, 0.32, 0.493, 0.373, 0.467, 0.627, 0.707, 0.613, 0.6, 0.507, 0.493, 0.44, 0.347],
    sparklineType: "volatile",
  },
  {
    slug: "hot-money",
    title: "Steady Hands vs Quick Exits",
    subtitle: "FDI stays. Portfolio money runs. 19 quarters of quarterly data.",
    category: "Capital Flows",
    theme: "Deep Dives",
    href: "/stories/hot-money",
    sparkline: [0.445, 0.544, 0.267, 0.0, 0.017, 0.62, 0.565, 0.386, 0.883, 0.575, 0.776, 0.759, 0.461, 1.0, 0.11, 0.267, 0.48, 0.27, 0.429],
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
