import { getRelatedStories, STORY_COLORS } from "@/lib/stories";
import Link from "next/link";

interface Props {
  currentSlug: string;
}

export default function ContinueExploring({ currentSlug }: Props) {
  const related = getRelatedStories(currentSlug);

  return (
    <section className="mx-auto max-w-[1100px] px-8 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-[#e7e1d8]" />
        <span className="text-[11px] uppercase tracking-[3px] font-medium text-[#78716c]">
          Continue Exploring
        </span>
        <div className="flex-1 h-px bg-[#e7e1d8]" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {related.map((story) => {
          const color = STORY_COLORS[story.slug];
          return (
            <Link
              key={story.slug}
              href={story.href}
              className="rounded-xl border border-[#e7e1d8] p-6 flex flex-col gap-3 hover:border-[#c8c0b4] hover:shadow-sm transition-all"
            >
              <span
                className="text-[10px] uppercase tracking-[2px] font-medium"
                style={{ color }}
              >
                {story.category}
              </span>
              <span
                className="text-lg font-bold leading-snug"
                style={{ fontFamily: "'Fraunces', serif", letterSpacing: "-0.3px" }}
              >
                {story.title}
              </span>
              <span className="text-[13px] text-[#78716c] leading-relaxed">
                {story.subtitle}
              </span>
              <span className="text-[13px] font-medium mt-auto" style={{ color }}>
                Read story →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
