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
    eyebrow: "COCKTAILS / NIGHT PARTY",
    title: "Vibe Rebel affair",
    description: "The ultimate night of dance and music on the decks",
    imageUrl: "/uploads/FRIDAYYY.png", // Fallback, would ideally be the rebel glass
  },
  {
    id: "2",
    eyebrow: "FOOD & DRINKS",
    title: "Fiesta Thursday",
    description: "Traditional flavors with a modern twist",
    imageUrl: "/uploads/FRIDAYYY.png",
  },
  {
    id: "3",
    eyebrow: "CHEFS SELECTION",
    title: "Fine Picking",
    description: "The soul of the flavors",
    imageUrl: "/uploads/FRIDAYYY.png",
  },
];

async function EventsSection() {
  return (
    <section className="section-padding bg-black">
      <div className="mx-auto max-w-6xl px-4">
        <FadeIn className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
            EVENINGS AT LA CREOLA
          </p>
          <h2 className="heading-font mt-4 text-3xl font-medium tracking-tight text-[#EFD077] md:text-4xl">
            Upcoming Party Events
          </h2>
          <p className="mt-4 text-sm text-zinc-400 max-w-2xl mx-auto">
            Experience unforgettable nights with curated DJs, live performances, and tasting menus
            crafted for celebration.
          </p>
          <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-6" />
        </FadeIn>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_EVENTS.map((event, index) => (
            <FadeIn key={event.id} delay={80 * index}>
              <article className="card-glass flex h-full flex-col overflow-hidden rounded-2xl border-white/5 transition hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                    {event.eyebrow}
                  </p>
                  <h3 className="mt-3 text-lg font-medium tracking-tight text-white">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">{event.description}</p>
                  <Link
                    href="/book"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#EFD077] px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-yellow-500/20 transition hover:bg-[#FDE68A]"
                  >
                    LEARN MORE
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
  const content = await getSiteContent();
  const blogItems = [
    {
      category: "FOOD & DRINKS",
      title: "Summer cocktails set up the bar",
      excerpt: "Whether you crave a classic mojito or our signature palm wine cooler.",
      imageSrc: "/uploads/FRIDAYYY.png",
    },
    {
      category: "NEWS AND UPDATES",
      title: "Chef’s notes: A classy touch",
      excerpt: "How we fuse African soul and Asian flair in every dish.",
      imageSrc: "/uploads/FRIDAYYY.png",
    },
    {
      category: "TEAM",
      title: "Monalisa Joining the news center in kigali",
      excerpt: "A journey through the story of our cafe and bakery shop news center.",
      imageSrc: "/uploads/FRIDAYYY.png",
    }
  ];

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden lg:min-h-[90vh]">
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

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
          <FadeIn>
            <div className="mb-10 lg:mb-14">
              <Image
                src="/logo.png"
                alt="La Creola"
                width={450}
                height={150}
                className="h-auto w-64 md:w-80 lg:w-[480px]"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <p className="max-w-2xl text-[13px] font-light uppercase tracking-[0.4em] text-zinc-400 sm:text-sm md:text-base">
              An Equisite Culinary Saga - African and Asian Tapas and cocktails
            </p>
          </FadeIn>

          <FadeIn delay={220}>
            <div className="mt-14 flex flex-col gap-6 sm:flex-row">
              <a
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-500/10"
              >
                BOOK A TABLE
              </a>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white transition-all hover:border-[#FDE68A] hover:bg-white/5 active:scale-95"
              >
                VIEW MENU
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding py-24 lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:gap-24">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-900 shadow-2xl border border-white/5">
              <img
                src="/uploads/FRIDAYYY.png"
                alt="About La Creola"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="heading-font text-5xl font-medium tracking-tight text-[#EFD077] md:text-7xl lg:text-8xl">
                  About La Creola
                </h2>
                <div className="h-0.5 w-16 bg-[#EFD077]" />
              </div>

              <div className="space-y-8">
                <p className="text-lg leading-relaxed text-zinc-300 font-light">
                  La Creola is a vibrant dining destination in Kigali, offering a refined fusion of African and Asian flavors. Our menu is built around sharing plates, bold tastes, and creative cocktails — designed for discovery, connection, and enjoyment.

                  Whether you’re joining us for a relaxed meal or an energetic evening, every visit is crafted to feel memorable.

                  Experience the full La Creola dining experience, and try our menu – meaning “I leave it up to you” in Kigali.
                </p>
                <div className="space-y-6 text-[15px] leading-relaxed text-zinc-400">
                  <p>
                    Our culinary philosophy is rooted in fusion without compromise: blending vibrant
                    spices, fresh local ingredients, and innovative techniques to create dishes that
                    surprise and delight.
                  </p>
                  <p>
                    Whether you&apos;re here for an evening dinner, a relaxed lunch, or a vibrant night with friends, La Creola is where refined hospitality meets a soulful soundtrack.
                  </p>
                </div>
              </div>

              <div className="flex gap-16 pt-8 border-t border-white/10">
                <div>
                  <p className="heading-font text-4xl font-semibold text-[#EFD077]">25+</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">Years of Excellence</p>
                </div>
                <div>
                  <p className="heading-font text-4xl font-semibold text-[#EFD077]">100+</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">Signature Dishes</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Excellence Section */}
      <section className="section-padding py-24 lg:py-32 bg-[#030712]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row-reverse lg:gap-24">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-900 shadow-2xl border border-white/5 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <img
                src="/uploads/FRIDAYYY.png"
                alt="La Creola Excellence"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077] md:text-6xl">
                  La Creola Excellence
                </h2>
                <div className="h-0.5 w-16 bg-[#EFD077]" />
              </div>

              <div className="space-y-8 text-[15px] leading-relaxed text-zinc-400">
                <p>
                  Our chefs compose each plate as a story of provenance and precision. Seasonal ingredients, curated wines, and bespoke pairings converge in a dining experience where every detail—from glassware to garnish—is intentionally designed.
                </p>
                <p className="italic text-zinc-500">
                  Sharing the essence of Rwanda with a world-class twist.
                </p>
              </div>

              <div className="flex gap-16 pt-8 border-t border-white/10">
                <div className="border-l-2 border-[#EFD077] pl-6">
                  <p className="heading-font text-4xl font-semibold text-[#EFD077]">20+</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">Awards</p>
                </div>
                <div className="border-l-2 border-[#EFD077] pl-6">
                  <p className="heading-font text-4xl font-semibold text-[#EFD077]">5k+</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-2">Happy Guests</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Upcoming Events */}
      <EventsSection />

      {/* Description Content */}
      <section className="section-padding py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <h2 className="heading-font text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
              Description Content
            </h2>
            <div className="h-0.5 w-12 bg-[#EFD077] mx-auto mt-6" />
            <p className="mt-10 text-lg leading-relaxed text-zinc-300 font-light">
              Experience the vibrant spirit of Kigali through our curated events and intimate dining spaces. La Creola is proud to be part of Kigali’s thriving culinary scene, offering a unique story that is rooted in culture, creativity, and connection. Our space is designed for lingering, welcoming locals and travelers alike to create unforgettable memories.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding pt-0 pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="mb-14 text-center">
            <h2 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077]">
              Testimonials
            </h2>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              What Our Clients Say
            </p>
          </FadeIn>
          <Testimonials />
        </div>
      </section>

      {/* Blog */}
      <section className="section-padding bg-[#030712] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <BlogSection eyebrow="NEWS AND UPDATES" title="Stories from the kitchen & bar" items={blogItems} />
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="section-padding py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
            <FadeIn className="space-y-12">
              <div className="space-y-6">
                <h2 className="heading-font text-6xl font-medium tracking-tight text-[#EFD077]">
                  Visit Us
                </h2>
                <p className="text-zinc-400 text-[15px] max-w-md leading-relaxed">
                  Experience our warm hospitality in the heart of Kigali. We look forward to welcoming you.
                </p>
              </div>

              <div className="space-y-10">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Address</p>
                  <div className="text-zinc-300 space-y-1">
                    <p className="text-lg">Kigali, Rwanda</p>
                    <p className="text-sm font-light">KG 674 St, Kimihurura</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Opening Hours</p>
                  <p className="text-zinc-300 text-lg">Mon - Sun: 10:00 AM - 12:00 PM</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Contact</p>
                  <div className="text-zinc-300 space-y-1 text-lg">
                    <p>+250 788 300 000</p>
                    <p className="text-sm font-light">info@lacreola.rw</p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-12 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-black transition-all hover:scale-105 active:scale-95"
              >
                GET DIRECTION
              </a>
            </FadeIn>

            <FadeIn delay={120} className="relative aspect-square overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15949.8817683!2d30.0886!3d-1.9547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTcnMTYuOSJTIDMwwrAwNScyNy42IkU!5e0!3m2!1sen!2srw!4v1620000000000!5m2!1sen!2srw"
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

