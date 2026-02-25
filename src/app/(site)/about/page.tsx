import { FadeIn } from "@/components/FadeIn";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <section className="section-padding bg-black/95">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 sm:gap-10 md:flex-row md:items-stretch">
          <FadeIn className="w-full md:w-1/2">
            <div className="relative h-64 overflow-hidden rounded-2xl border border-white/20 bg-zinc-900 shadow-2xl sm:h-72 md:h-[420px] md:rounded-3xl">
              <img
                src="/uploads/FRIDAYYY.png"
                alt="La Creola is a vibrant dining destination"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/50" />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full md:w-1/2">
            <div className="space-y-5">
              <h1 className="heading-font border-b-2 border-[#D4AF37] pb-1 text-2xl font-semibold text-[#D4AF37] sm:text-3xl md:text-4xl">
                About La Creola
              </h1>
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                We curate a sensory experience that celebrates the rhythm of Kigali nights. Our menu
                is an intimate dialogue between bold African flavors and delicate Asian
                craftsmanship, plated with meticulous artistry and served in a space designed for
                lingering.
              </p>
              <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                From candlelit dinners to private celebrations, La Creola is where refined
                hospitality, crafted cocktails, and a soulful soundtrack meet under a softly lit
                ceiling.
              </p>
              <a
                href="/book"
                className="gold-gradient inline-flex items-center justify-center rounded px-6 py-2.5 text-sm font-semibold text-black"
              >
                Book a Table
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

