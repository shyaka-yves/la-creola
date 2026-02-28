import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { Testimonials } from "@/components/Testimonials";
import { BlogSection } from "@/components/BlogSection";
import { listEvents } from "@/lib/eventsDb";
import { listGalleryImages } from "@/lib/galleryDb";
import { getSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

async function EventsSection() {
  const events = await listEvents();

  if (events.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-black via-slate-950 to-black">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            Evenings at La Creola
          </p>
          <h2 className="heading-font mt-3 text-2xl font-semibold text-white sm:text-3xl">
            Upcoming Party Events
          </h2>
          <p className="mt-3 text-sm text-zinc-300 sm:text-base">
            Experience unforgettable nights with curated DJs, live performances, and tasting menus
            crafted for celebration.
          </p>
        </FadeIn>

        <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((event, index) => (
            <FadeIn key={event.id} delay={80 * index}>
              <article className="card-glass mx-auto flex h-full w-full sm:w-auto sm:max-w-[260px] flex-col overflow-hidden rounded-3xl">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                    {event.date}
                  </p>
                  <h3 className="mt-1.5 text-sm font-semibold text-white">
                    {event.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-300 line-clamp-2">{event.description}</p>
                  <Link
                    href="/events"
                    className="gold-gradient mt-5 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-black shadow-md shadow-yellow-500/25 transition hover:shadow-yellow-400/40"
                  >
                    Learn More
                  </Link>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const [content, galleryImages] = await Promise.all([getSiteContent(), listGalleryImages()]);
  const blogTitle = content.blog.title;
  const blogItems = content.blog.items ?? [];

  const hero = content.hero;
  const about = content.about;
  const excellence = content.excellence;
  const menuIntro = content.menuIntro;

  const galleryFromDb = galleryImages ?? [];
  const galleryFromContent = content.gallery.items ?? [];
  const galleryCards =
    galleryFromDb.length > 0
      ? galleryFromDb.slice(0, 6).map((img) => ({
        id: img.id,
        src: img.imageUrl,
        alt: img.label,
      }))
      : galleryFromContent.slice(0, 6).map((img, index) => ({
        id: `content-${index}`,
        src: img.imageSrc,
        alt: img.alt,
      }));

  const hasHeroMedia = typeof hero.mediaSrc === "string" && hero.mediaSrc.trim().length > 0;

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] sm:min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-900 via-black to-black lg:min-h-[90vh]">
        {/* Hero media: from content with fallback */}
        {hasHeroMedia ? (
          <>
            {hero.mediaType === "video" ? (
              <video
                src={hero.mediaSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            ) : (
              <img
                src={hero.mediaSrc}
                alt={hero.headline || hero.brand || "Hero background"}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
          </>
        ) : (
          <>
            <video
              src="/uploads/pop.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
          </>
        )}

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-8 text-center sm:py-12">
          <FadeIn>
            <h1 className="heading-font text-4xl font-semibold tracking-[0.2em] text-[#D4AF37] sm:text-5xl md:text-6xl">
              {hero.headline || hero.brand || "La Creola"}
            </h1>
          </FadeIn>

          {hero.tagline && (
            <FadeIn delay={120}>
              <p className="mt-6 max-w-2xl text-sm text-zinc-200 sm:text-base md:text-lg">
                {hero.tagline}
              </p>
            </FadeIn>
          )}

          {hero.subheadline && (
            <FadeIn delay={180}>
              <p className="mt-4 max-w-2xl text-xs text-zinc-300 sm:text-sm">
                {hero.subheadline}
              </p>
            </FadeIn>
          )}

          <FadeIn delay={220}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={hero.primaryCtaHref || "/book"}
                className="gold-gradient inline-flex items-center justify-center rounded-full px-10 py-3 text-sm font-semibold tracking-wide text-black shadow-lg shadow-yellow-500/25 transition hover:shadow-yellow-400/40"
              >
                {hero.primaryCtaLabel || "Book a Table"}
              </a>
              <Link
                href={hero.secondaryCtaHref || "/menu"}
                className="inline-flex items-center justify-center rounded-full border border-zinc-500/60 px-10 py-3 text-sm font-semibold tracking-wide text-zinc-50 transition hover:border-gold hover:bg-white/5"
              >
                {hero.secondaryCtaLabel || "View Menu"}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-black/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 sm:gap-10 md:flex-row md:items-stretch">
          <FadeIn className="w-full md:w-1/2">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                {about.eyebrow || "About La Creola"}
              </p>
              <h2 className="heading-font text-2xl font-semibold text-white sm:text-3xl">
                {about.title || "La Creola is a vibrant dining destination"}
              </h2>
              {(about.paragraphs && about.paragraphs.length > 0
                ? about.paragraphs
                : [
                  "La Creola brings together bold African spirit and refined Asian influence in a way that feels both familiar and refreshingly new.",
                ]
              ).map((p, idx) => (
                <p key={idx} className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {p}
                </p>
              ))}
              <a
                href={about.ctaHref || "/book"}
                className="inline-flex items-center text-sm font-medium text-gold underline-offset-4 hover:underline"
              >
                {about.ctaLabel || "Book a Table"}
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full md:w-1/2">
            <div className="relative h-64 overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900 shadow-2xl sm:h-72 md:h-[420px] md:rounded-3xl">
              <img
                src={about.imageSrc || "/uploads/FRIDAYYY.png"}
                alt={about.title || "About La Creola"}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/50" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Excellence */}
      {(excellence.title || excellence.description || excellence.imageSrc) && (
        <section className="section-padding bg-gradient-to-b from-black via-slate-950 to-black">
          <div className={`mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 ${excellence.imageSrc ? 'md:flex-row' : ''}`}>
            <FadeIn className={`w-full ${excellence.imageSrc ? 'md:w-1/2' : 'max-w-3xl text-center'}`}>
              <div className={`space-y-6 ${excellence.imageSrc ? '' : 'flex flex-col items-center'}`}>
                <p className="text-xs uppercase tracking-[0.25em] text-gold">
                  {excellence.eyebrow || "The Standard"}
                </p>
                <h2 className="heading-font text-2xl font-semibold text-white sm:text-3xl">
                  {excellence.title || "La Creola Excellence"}
                </h2>
                {(
                  excellence.description
                    ? [excellence.description]
                    : [
                      "Our chefs compose each plate as a story of provenance and precision. Seasonal ingredients, curated wines, and bespoke pairings converge in a dining experience where every detail—from glassware to garnish—is intentionally designed.",
                    ]
                ).map((p, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                    {p}
                  </p>
                ))}
                {excellence.stats && excellence.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-6">
                    {excellence.stats.map((stat, idx) => (
                      <div
                        key={`${stat.label}-${idx}`}
                        className="rounded-3xl border border-zinc-700/70 bg-black/40 px-6 py-5 shadow-xl shadow-black/40"
                      >
                        <p className="heading-font text-3xl font-semibold text-gold">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>

            {excellence.imageSrc && (
              <FadeIn delay={150} className="w-full md:w-1/2">
                <div className="relative h-64 overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900 shadow-[0_25px_80px_rgba(0,0,0,0.85)] sm:h-72 md:h-[420px] md:rounded-3xl">
                  <img
                    src={excellence.imageSrc}
                    alt={excellence.title || "La Creola Excellence"}
                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      )}

      {/* Menu Intro */}
      <section className="section-padding bg-black/90">
        <div className={`mx-auto max-w-6xl px-4 ${menuIntro.imageSrc ? 'grid gap-12 lg:grid-cols-2 lg:items-center' : 'text-center max-w-4xl'}`}>
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.25em] text-gold">
              {menuIntro.eyebrow || "Tasting Notes"}
            </p>
            <h2 className="heading-font mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {menuIntro.title || "A fusion of African soul & Asian finesse"}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              {menuIntro.description ||
                "From delicate sashimi with Rwandan citrus to slow-braised cuts infused with aromatic spices, our menu is designed for sharing."}
            </p>
          </FadeIn>

          {menuIntro.imageSrc && (
            <FadeIn delay={150}>
              <div className="relative h-[300px] w-full overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900 shadow-xl sm:h-[400px]">
                <img
                  src={menuIntro.imageSrc}
                  alt={menuIntro.title || "Tasting Notes"}
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/20" />
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <EventsSection />

      {/* Gallery */}
      <section className="section-padding bg-black/90">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">
              {content.gallery.eyebrow || "Inside La Creola"}
            </p>
            <h2 className="heading-font mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {content.gallery.title || "Gallery"}
            </h2>
          </FadeIn>
          {galleryCards.length === 0 ? (
            <p className="text-center text-sm text-zinc-400">Gallery images coming soon.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {galleryCards.map((image, index) => (
                  <FadeIn key={image.id} delay={70 * index}>
                    <div className="group relative h-44 overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900/80 shadow-lg shadow-black/70 sm:h-48 md:h-64 md:rounded-3xl">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        unoptimized={image.src.startsWith("http")}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                  </FadeIn>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center rounded-full border border-zinc-600/70 px-8 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-100 hover:border-gold hover:bg-white/5"
                >
                  View Full Gallery
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="mx-auto max-w-5xl px-4">
          <FadeIn className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">
              Voices of our guests
            </p>
            <h2 className="heading-font mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Testimonials
            </h2>
            <p className="mt-3 text-sm text-zinc-300 sm:text-base">
              What Our Clients Say
            </p>
          </FadeIn>
          <Testimonials />
        </div>
      </section>

      {/* Blog */}
      <section className="section-padding bg-black/90">
        <div className="mx-auto max-w-6xl px-4">
          <BlogSection eyebrow={content.blog.eyebrow} title={blogTitle} items={blogItems} />
        </div>
      </section>
    </div>
  );
}

