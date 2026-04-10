import { getRelatedStories, THEME_COLORS } from "@/lib/stories";
import Sparkline from "./Sparkline";
import Link from "next/link";

interface Props {
  currentSlug: string;
}

export default function ContinueExploring({ currentSlug }: Props) {
  const related = getRelatedStories(currentSlug);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="border-t border-zinc-800 pt-8">
        <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-6">
          Continue Exploring
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((story) => {
            const tagColor = THEME_COLORS[story.theme];
            return (
              <Link
                key={story.slug}
                href={story.href}
                className="group relative rounded-xl overflow-hidden p-6 min-h-[180px] flex flex-col justify-between hover:scale-[1.02] transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${story.cardColor}18 0%, #1e293b 100%)`,
                  border: `1px solid ${story.cardColor}25`,
                }}
              >
                {/* Sparkline background */}
                <div className="absolute bottom-0 left-0 right-0 opacity-40 pointer-events-none">
                  <Sparkline
                    data={story.sparkline}
                    color={story.cardColor}
                    type={story.sparklineType}
                    width={300}
                    height={70}
                  />
                </div>

                <div className="relative z-10">
                  <p
                    className="text-[10px] font-semibold tracking-widest uppercase mb-2"
                    style={{ color: tagColor }}
                  >
                    {story.category}
                  </p>
                  <p className="text-base font-bold text-white mb-1">
                    {story.title}
                  </p>
                  <p className="text-xs text-zinc-400">{story.subtitle}</p>
                </div>

                <p
                  className="relative z-10 text-xs mt-3 font-medium"
                  style={{ color: story.cardColor }}
                >
                  Read story →
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
