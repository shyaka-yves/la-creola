import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { Testimonials } from "@/components/Testimonials";
import { BlogSection } from "@/components/BlogSection";
import { listEvents } from "@/lib/eventsDb";
import { listGalleryImages } from "@/lib/galleryDb";
import { getSiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

const MOCK_EVENTS = [
  {
    id: "1",
    eyebrow: "MUSIC / NIGHT PARTY",
    title: "Neon Night Party",
    description: "The ultimate night of dance and electronic music on the decks",
    imageUrl: "/uploads/FRIDAYYY.png",
  },
  {
    id: "2",
    eyebrow: "SUNSET / COCKTAILS",
    title: "Beats Sunset Vibe",
    description: "Relaxing rhythms with a selection of premium cocktails",
    imageUrl: "/uploads/FRIDAYYY.png",
  },
  {
    id: "3",
    eyebrow: "ANNUAL EVENT",
    title: "Halloween Costume Bash",
    description: "Creepy vibes and unforgettable memories in the heart of Kigali",
    imageUrl: "/uploads/FRIDAYYY.png",
  },
];

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden lg:min-h-[90vh]">
        <div className="absolute inset-0 z-0">
          {content.hero.mediaType === "video" ? (
            <video
              src={content.hero.mediaSrc || "/uploads/bg.mp4"}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-30"
            />
          ) : (
            <img
              src={content.hero.mediaSrc || "/uploads/FRIDAYYY.png"}
              alt="Hero"
              className="h-full w-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
          <FadeIn>
            <div className="mb-10 lg:mb-14">
              <Image
                src="/logo.png"
                alt={content.hero.brand}
                width={450}
                height={150}
                className="h-auto w-48 md:w-64 lg:w-[350px]"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <p className="max-w-3xl text-sm font-light uppercase tracking-[0.4em] text-zinc-400 md:text-base lg:text-lg">
              {content.hero.tagline}
            </p>
          </FadeIn>

          <FadeIn delay={220}>
            <div className="mt-14 flex flex-col gap-8 sm:flex-row">
              <a
                href={content.hero.primaryCtaHref}
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-14 py-4 text-xs font-bold uppercase tracking-[0.3em] text-black transition-all hover:brightness-110 active:scale-95 shadow-2xl shadow-yellow-500/10"
              >
                {content.hero.primaryCtaLabel}
              </a>
              <Link
                href={content.hero.secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-14 py-4 text-xs font-bold uppercase tracking-[0.4em] text-white transition-all hover:bg-white/5 active:scale-95"
              >
                {content.hero.secondaryCtaLabel}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding py-24 lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:gap-24">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl border border-white/5">
              <img
                src={content.about.imageSrc}
                alt={content.about.title}
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="h-0.5 w-16 bg-[#EFD077]" />
              </div>

              <div className="space-y-10">
                {content.about.paragraphs.map((p, i) => (
                  <p key={i} className={`leading-relaxed font-light ${i === 0 ? "text-xl lg:text-2xl text-zinc-300" : "text-base lg:text-lg text-zinc-400"} ${p.includes("meaning") ? "italic" : ""}`}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="flex gap-16 pt-10 border-t border-white/10">
                <div>
                  <p className="heading-font text-5xl font-semibold text-[#EFD077]">25+</p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mt-2 font-bold">Years of Excellence</p>
                </div>
                <div>
                  <p className="heading-font text-5xl font-semibold text-[#EFD077]">100+</p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mt-2 font-bold">Signature Dishes</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Excellence Section */}
      <section className="section-padding py-24 lg:py-32 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row-reverse lg:gap-24">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-900 shadow-2xl border border-white/5 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <img
                src={content.excellence.imageSrc}
                alt={content.excellence.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="heading-font text-5xl font-medium tracking-tight text-[#EFD077] md:text-7xl">
                  {content.excellence.title}
                </h2>
                <div className="h-0.5 w-16 bg-[#EFD077]" />
              </div>

              <div className="space-y-8 text-base leading-relaxed text-zinc-400 font-light lg:text-lg">
                <p>{content.excellence.description}</p>
                {content.excellence.quote && (
                  <p className="italic text-zinc-500 text-sm lg:text-base">
                    {content.excellence.quote}
                  </p>
                )}
              </div>

              <div className="flex gap-16 pt-8">
                {content.excellence.stats.map((stat, i) => (
                  <div key={i} className="border-l-2 border-[#EFD077] pl-8 py-1">
                    <p className="heading-font text-5xl font-semibold text-[#EFD077]">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 mt-2 font-bold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-black">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="heading-font text-5xl font-medium tracking-tight text-[#EFD077] md:text-6xl">
              {content.events.title}
            </h2>
            <p className="mt-4 text-[12px] uppercase tracking-[0.4em] text-zinc-500">
              {content.events.description}
            </p>
            <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-8" />
          </FadeIn>

          <div className="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {content.events.items.map((event, index) => (
              <FadeIn key={index} delay={80 * index}>
                <article className="card-glass flex h-full flex-col overflow-hidden rounded-2xl border-white/5 transition hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={event.imageSrc}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-10 pt-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                      {event.date}
                    </p>
                    <h3 className="mt-4 text-2xl font-medium tracking-tight text-white group-hover:text-[#EFD077] transition-colors">
                      {event.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-400 font-light lg:text-base">{event.description}</p>
                    <Link
                      href="/book"
                      className="mt-10 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#EFD077] to-[#D4AF37] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-xl shadow-yellow-500/10 hover:brightness-110 active:scale-95 transition-all"
                    >
                      View More
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Description Content */}
      <section className="section-padding py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <h2 className="heading-font text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
              {content.descriptionSection.heading}
            </h2>
            <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-6" />
            <div className="mt-10 space-y-6">
              {content.descriptionSection.paragraphs.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-zinc-300 font-light">
                  {p}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding pt-0 pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-14 text-center">
            <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077]">
              {content.testimonials.title}
            </h2>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              {content.testimonials.eyebrow}
            </p>
          </FadeIn>
          <Testimonials items={content.testimonials.items} />
        </div>
      </section>

      {/* Blog */}
      <section className="section-padding bg-[#030712] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <BlogSection eyebrow={content.blog.eyebrow} title={content.blog.title} items={content.blog.items} />
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="section-padding py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
            <FadeIn className="space-y-12">
              <div className="space-y-6">
                <h2 className="heading-font text-6xl font-medium tracking-tight text-[#EFD077]">
                  {content.contact.title}
                </h2>
                <p className="text-zinc-400 text-[15px] max-w-md leading-relaxed">
                  {content.contact.addressNote}
                </p>
              </div>

              <div className="space-y-10">
                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Address</p>
                  <div className="text-zinc-300 space-y-1">
                    {content.contact.addressLines.map((line, i) => (
                      <p key={i} className={i === 0 ? "text-xl" : "text-base font-light"}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Opening Hours</p>
                  {content.contact.hoursLines.map((line, i) => (
                    <p key={i} className="text-zinc-300 text-xl font-light">{line}</p>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Contact</p>
                  <div className="text-zinc-300 space-y-1 text-xl">
                    <p>{content.contact.phone}</p>
                    <p className="text-base font-light">{content.contact.email}</p>
                  </div>
                </div>
              </div>

              <a
                href={content.contact.mapEmbedSrc}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-14 py-4 text-xs font-bold uppercase tracking-[0.3em] text-black transition-all hover:scale-105 active:scale-95"
              >
                GET DIRECTION
              </a>
            </FadeIn>

            <FadeIn delay={120} className="relative aspect-square overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
              <iframe
                src={content.contact.mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-60 invert"
              />
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

