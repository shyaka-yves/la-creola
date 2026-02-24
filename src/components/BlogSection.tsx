import Image from "next/image";
import { FadeIn } from "./FadeIn";

const POSTS = [
  {
    category: "Chef's Notes",
    title: "Designing a Menu that Moves with the Seasons",
    excerpt:
      "How our culinary team balances Kigali’s local markets with Asian pantry staples to create a menu that always feels alive.",
    image: "/blog-seasonal.jpg",
  },
  {
    category: "Behind the Bar",
    title: "The Art of Gold-Touched Cocktails",
    excerpt:
      "Step inside our bar program and discover how we layer aromatics, textures, and visual details into every pour.",
    image: "/blog-cocktail.jpg",
  },
  {
    category: "Culture & Space",
    title: "Crafting the Soundtrack of an Evening",
    excerpt:
      "From jazz to amapiano, how we curate the music that shapes the mood of your night at La Creola.",
    image: "/blog-soundtrack.jpg",
  },
];

export function BlogSection({ title }: { title?: string }) {
  const heading = title || "Stories from the kitchen & bar";

  return (
    <div>
      <FadeIn className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">
          From Our Blog
        </p>
        <h2 className="heading-font mt-3 text-2xl font-semibold text-white sm:text-3xl">
          {heading}
        </h2>
      </FadeIn>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {POSTS.map((post, index) => (
          <FadeIn key={post.title} delay={80 * index}>
            <article className="card-glass flex h-full flex-col overflow-hidden rounded-3xl">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                  {post.category}
                </p>
                <h3 className="mt-2 text-base font-semibold text-white">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-300 line-clamp-3">
                  {post.excerpt}
                </p>
                <a
                  href="#"
                  className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200 hover:text-gold"
                >
                  Read More
                </a>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

