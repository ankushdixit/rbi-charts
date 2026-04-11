import { describe, it, expect } from "vitest";
import { STORIES, THEMES, STORY_COLORS, THEME_COLORS, getRelatedStories } from "./stories";

describe("STORIES registry", () => {
  it("has at least 11 stories", () => {
    expect(STORIES.length).toBeGreaterThanOrEqual(11);
  });

  it("every story has required fields", () => {
    for (const story of STORIES) {
      expect(story.slug).toBeTruthy();
      expect(story.title).toBeTruthy();
      expect(story.subtitle).toBeTruthy();
      expect(story.category).toBeTruthy();
      expect(story.theme).toBeTruthy();
      expect(story.href).toBeTruthy();
      expect(story.sparkline.length).toBeGreaterThan(0);
      expect(["area", "bars", "rising", "volatile"]).toContain(story.sparklineType);
    }
  });

  it("every story slug is unique", () => {
    const slugs = STORIES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every story href matches its slug", () => {
    for (const story of STORIES) {
      expect(story.href).toBe(`/stories/${story.slug}`);
    }
  });

  it("every story has a color defined", () => {
    for (const story of STORIES) {
      expect(STORY_COLORS[story.slug]).toBeTruthy();
    }
  });

  it("every story belongs to a valid theme", () => {
    const themeNames = Object.keys(THEMES);
    for (const story of STORIES) {
      expect(themeNames).toContain(story.theme);
    }
  });
});

describe("THEMES registry", () => {
  it("every theme has a color", () => {
    for (const name of Object.keys(THEMES)) {
      expect(THEME_COLORS[name]).toBeTruthy();
    }
  });

  it("every slug in themes exists in STORIES", () => {
    const storySlugs = new Set(STORIES.map((s) => s.slug));
    for (const [name, theme] of Object.entries(THEMES)) {
      for (const slug of theme.slugs) {
        expect(storySlugs.has(slug)).toBe(true);
      }
    }
  });

  it("every story appears in exactly one theme's slugs", () => {
    const slugToThemes: Record<string, string[]> = {};
    for (const [name, theme] of Object.entries(THEMES)) {
      for (const slug of theme.slugs) {
        if (!slugToThemes[slug]) slugToThemes[slug] = [];
        slugToThemes[slug].push(name);
      }
    }
    for (const story of STORIES) {
      expect(slugToThemes[story.slug]?.length).toBe(1);
    }
  });
});

describe("getRelatedStories", () => {
  it("returns exactly 3 stories", () => {
    const related = getRelatedStories("upi-explosion");
    expect(related.length).toBe(3);
  });

  it("excludes the current story", () => {
    const related = getRelatedStories("upi-explosion");
    expect(related.find((s) => s.slug === "upi-explosion")).toBeUndefined();
  });

  it("prioritizes same-theme stories", () => {
    const related = getRelatedStories("upi-explosion");
    const currentTheme = STORIES.find((s) => s.slug === "upi-explosion")!.theme;
    const sameTheme = related.filter((s) => s.theme === currentTheme);
    // UPI is in Payments Revolution which has 4 stories, so 3 same-theme
    expect(sameTheme.length).toBe(3);
  });

  it("fills from other themes when same-theme has fewer than 3", () => {
    // Find a theme with only 1-2 stories
    const related = getRelatedStories("it-exports");
    expect(related.length).toBe(3);
  });

  it("handles non-existent slug without crashing", () => {
    const related = getRelatedStories("nonexistent-slug");
    expect(related.length).toBe(3);
  });
});
