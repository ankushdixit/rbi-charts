/**
 * Central registry of all stories — used by landing page and "Continue Exploring" sections.
 */

export interface Story {
  slug: string;
  title: string;
  subtitle: string;
  theme: string;
  themeColor: string;
  href: string;
}

export const STORIES: Story[] = [
  // Payments Revolution
  {
    slug: "upi-explosion",
    title: "The UPI Explosion",
    subtitle: "From zero to 20 billion monthly transactions in under a decade.",
    theme: "Payments",
    themeColor: "#60a5fa",
    href: "/stories/upi-explosion",
  },
  {
    slug: "death-of-cash",
    title: "The Death of Cash",
    subtitle: "How digital payments replaced cheques and paper instruments.",
    theme: "Payments",
    themeColor: "#34d399",
    href: "/stories/death-of-cash",
  },
  {
    slug: "credit-card-wars",
    title: "Credit Card Wars",
    subtitle: "HDFC vs SBI vs ICICI vs Axis — a decade of competition.",
    theme: "Competition",
    themeColor: "#fbbf24",
    href: "/stories/credit-card-wars",
  },
  {
    slug: "infra-shift",
    title: "3,600 QR Codes for Every ATM",
    subtitle: "ATMs are declining. QR codes are exploding. India's infrastructure shift.",
    theme: "Infrastructure",
    themeColor: "#22d3ee",
    href: "/stories/infra-shift",
  },
  // India's Money Story
  {
    slug: "savings-collapse",
    title: "The Great Rebalancing",
    subtitle: "Household savings: from deposits to mutual funds and equity.",
    theme: "Savings",
    themeColor: "#f59e0b",
    href: "/stories/savings-collapse",
  },
  {
    slug: "forex-fortress",
    title: "The Forex Fortress",
    subtitle: "$5.8B to $668B — how India built the world's 4th largest reserves.",
    theme: "Reserves",
    themeColor: "#10b981",
    href: "/stories/forex-fortress",
  },
  {
    slug: "money-flow",
    title: "Where Does India's Money Flow?",
    subtitle: "Personal loans overtook industry. Services beat agriculture.",
    theme: "Credit",
    themeColor: "#a78bfa",
    href: "/stories/money-flow",
  },
  // Deep Dives
  {
    slug: "inflation-gap",
    title: "The Expectation Escalator",
    subtitle: "Households always expect inflation to get worse. 17 years of proof.",
    theme: "Inflation",
    themeColor: "#f87171",
    href: "/stories/inflation-gap",
  },
  {
    slug: "hot-money",
    title: "Steady Hands vs Quick Exits",
    subtitle: "FDI stays. Portfolio money runs. The quarterly data proves it.",
    theme: "Capital Flows",
    themeColor: "#38bdf8",
    href: "/stories/hot-money",
  },
];

export const THEMES = {
  "Payments Revolution": ["upi-explosion", "death-of-cash", "credit-card-wars", "infra-shift"],
  "India's Money Story": ["savings-collapse", "forex-fortress", "money-flow"],
  "Deep Dives": ["inflation-gap", "hot-money"],
};

/**
 * Get related stories for a given story slug (excludes itself, max 3).
 */
export function getRelatedStories(currentSlug: string): Story[] {
  // Find which theme the current story belongs to
  let sameTheme: string[] = [];
  for (const [, slugs] of Object.entries(THEMES)) {
    if (slugs.includes(currentSlug)) {
      sameTheme = slugs.filter((s) => s !== currentSlug);
      break;
    }
  }

  // Start with same-theme stories, then fill from other themes
  const related: Story[] = [];
  for (const slug of sameTheme) {
    const story = STORIES.find((s) => s.slug === slug);
    if (story) related.push(story);
  }

  // Fill up to 3 from other stories
  if (related.length < 3) {
    for (const story of STORIES) {
      if (story.slug !== currentSlug && !related.includes(story)) {
        related.push(story);
        if (related.length >= 3) break;
      }
    }
  }

  return related.slice(0, 3);
}
