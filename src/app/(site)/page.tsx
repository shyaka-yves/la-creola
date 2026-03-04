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
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-black lg:min-h-[90vh]">
        {/* Background image/video if any */}
        <div className="absolute inset-0 z-0">
          <video
            src="/uploads/pop.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pt-12 text-center">
          <FadeIn>
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="La Creola"
                width={400}
                height={120}
                className="h-auto w-64 md:w-80 lg:w-[450px]"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <p className="max-w-2xl text-sm font-light tracking-[0.3em] text-zinc-300 sm:text-base md:text-lg">
              The essence of Kigali nights, where African soul meets Asian finesse.
            </p>
          </FadeIn>

          <FadeIn delay={220}>
            <div className="mt-12 flex flex-col gap-5 sm:flex-row">
              <a
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-12 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-transform hover:scale-105 active:scale-95"
              >
                BOOK A TABLE
              </a>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-500/60 px-12 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-50 transition-colors hover:border-[#D4AF37] hover:bg-white/5"
              >
                VIEW MENU
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-black min-h-[70vh] flex items-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:gap-20">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl lg:rounded-2xl">
              <img
                src="/uploads/FRIDAYYY.png"
                alt="La Creola Interior"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077] md:text-5xl lg:text-6xl text-center lg:text-left">
                  About La Creola
                </h2>
                <div className="h-0.5 w-16 bg-[#EFD077] mx-auto lg:mx-0" />
              </div>

              <div className="space-y-6 text-zinc-400">
                <p className="text-lg leading-relaxed text-zinc-300">
                  At La Creola, we believe dining is more than just food — it&apos;s a story, a
                  feeling, and a journey. Located in the heart of Kigali, La Creola brings together
                  bold African spirit and refined Asian influence.
                </p>
                <p className="text-sm leading-relaxed sm:text-base">
                  Our culinary philosophy is rooted in fusion without compromise: blending vibrant
                  spices, fresh local ingredients, and innovative techniques to create dishes that
                  surprise and delight.
                </p>
                <p className="text-sm leading-relaxed sm:text-base">
                  Whether you&apos;re here for an evening dinner, a relaxed lunch, or a vibrant night with friends, La Creola is where refined hospitality meets a soulful soundtrack.
                </p>
              </div>

              <div className="flex gap-12 pt-4 border-t border-zinc-800/50">
                <div>
                  <p className="heading-font text-3xl font-semibold text-[#EFD077]">25+</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Years of Excellence</p>
                </div>
                <div>
                  <p className="heading-font text-3xl font-semibold text-[#EFD077]">100+</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Signature Dishes</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Excellence Section */}
      <section className="section-padding bg-black min-h-[60vh] flex items-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row-reverse lg:gap-20">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl lg:rounded-2xl max-w-md mx-auto">
              <img
                src={excellence.imageSrc || "/uploads/FRIDAYYY.png"}
                alt="Excellence"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-6">
              <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077] md:text-5xl">
                La Creola Excellence
              </h2>
              <div className="space-y-6 text-zinc-400">
                <p className="text-sm leading-relaxed sm:text-base">
                  Our chefs compose each plate as a story of provenance and precision. Seasonal ingredients, curated wines, and bespoke pairings converge in a dining experience where every detail—from glassware to garnish—is intentionally designed.
                </p>
                <p className="text-sm leading-relaxed sm:text-base italic text-zinc-500">
                  Sharing the essence of Rwanda with a world-class twist.
                </p>
              </div>

              <div className="flex gap-12 pt-4">
                <div className="border-l border-[#EFD077] pl-4">
                  <p className="heading-font text-2xl font-semibold text-[#EFD077]">20+</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Awards</p>
                </div>
                <div className="border-l border-[#EFD077] pl-4">
                  <p className="heading-font text-2xl font-semibold text-[#EFD077]">5k+</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Happy Guests</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Upcoming Events */}
      <EventsSection />

      {/* Description Content Section */}
      <section className="section-padding bg-black pt-0">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <FadeIn>
            <h2 className="heading-font text-3xl font-medium tracking-tight text-[#EFD077]">
              Description Content
            </h2>
            <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-4" />
          </FadeIn>
          <FadeIn delay={120}>
            <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
              Experience the vibrant spirit of Kigali through our curated events and intimate dining spaces. La Creola is proud to be part of Kigali’s thriving culinary scene, offering a unique story that is rooted in culture, creativity, and connection. Our space is designed for lingering, welcoming locals and travelers alike to create unforgettable memories.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-black pt-0">
        <div className="mx-auto max-w-5xl px-4">
          <FadeIn className="mb-12 text-center">
            <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077]">
              Testimonials
            </h2>
            <p className="mt-3 text-sm text-zinc-500 uppercase tracking-widest">
              What Our Clients Say
            </p>
          </FadeIn>
          <Testimonials />
        </div>
      </section>

      {/* Blog */}
      <section className="section-padding bg-black pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077]">
              From Our Blog
            </h2>
            <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-4" />
          </div>
          <BlogSection eyebrow={content.blog.eyebrow} title={""} items={blogItems} />
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="section-padding bg-black border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <FadeIn className="space-y-10">
              <div className="space-y-4">
                <h2 className="heading-font text-5xl font-medium tracking-tight text-[#EFD077]">
                  Visit Us
                </h2>
                <p className="text-zinc-400 text-sm max-w-md">
                  Experience our warm hospitality in the heart of Kigali. We look forward to welcoming you.
                </p>
              </div>

              <div className="space-y-8 text-zinc-300">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-[#EFD077]">Address</p>
                  <p className="text-sm">Kigali, Rwanda</p>
                  <p className="text-sm">KG 674 St, Kimihurura</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-[#EFD077]">Opening Hours</p>
                  <p className="text-sm">Mon - Sun: 10:00 AM - 12:00 PM</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-[#EFD077]">Contact</p>
                  <p className="text-sm">+250 788 300 000</p>
                  <p className="text-sm">info@lacreola.rw</p>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-10 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-transform hover:scale-105"
              >
                GET DIRECTION
              </a>
            </FadeIn>

            <FadeIn delay={120} className="relative aspect-video lg:aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.53036836!2d30.0886!3d-1.9547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTcnMTYuOSJTIDMwwrAwNScyNy42IkU!5e0!3m2!1sen!2srw!4v1620000000000!5m2!1sen!2srw"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80"
              />
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}

