import { getRelatedStories } from "@/lib/stories";
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
          {related.map((story) => (
            <Link
              key={story.slug}
              href={story.href}
              className="group rounded-xl bg-zinc-900 border border-zinc-800 p-6 hover:border-zinc-700 transition-colors"
            >
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: story.themeColor }}
              >
                {story.theme}
              </p>
              <p className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {story.title}
              </p>
              <p className="text-sm text-zinc-500 mb-4">{story.subtitle}</p>
              <p className="text-sm text-blue-400">Read story →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
