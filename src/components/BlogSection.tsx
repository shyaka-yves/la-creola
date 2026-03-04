import Image from "next/image";
import { FadeIn } from "./FadeIn";

type BlogItem = {
  category: string;
  title: string;
  excerpt: string;
  imageSrc: string;
};

export function BlogSection({
  title,
  eyebrow,
  items,
}: {
  title?: string;
  eyebrow?: string;
  items?: BlogItem[];
}) {
  const heading = title || "Stories from the kitchen & bar";
  const smallCasing = eyebrow || "From Our Blog";
  const posts = items || [];

  return (
    <div>
      <FadeIn className="mb-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
          {smallCasing}
        </p>
        <h2 className="heading-font mt-4 text-3xl font-medium tracking-tight text-[#EFD077] md:text-4xl">
          {heading}
        </h2>
        <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-6" />
      </FadeIn>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <FadeIn key={`${post.title}-${index}`} delay={80 * index}>
            <article className="card-glass flex h-full flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  fill
                  unoptimized={post.imageSrc.startsWith("http")}
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                  {post.category}
                </p>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-white line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-zinc-400 line-clamp-3">
                  {post.excerpt}
                </p>
                <a
                  href="#"
                  className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FDE68A] hover:underline"
                >
                  READ MORE
                </a>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

