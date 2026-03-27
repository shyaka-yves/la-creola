import { FadeIn } from "@/components/FadeIn";
import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";
import Image from "next/image";
import { getOptimizedStorageUrl } from "@/lib/image-utils";

export const metadata: Metadata = {
  title: "About Us | La Creola",
  description: "Learn more about the story behind La Creola.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <div className="relative overflow-hidden">
      <section className="bg-black/95 pt-20 pb-12 sm:pt-24 sm:pb-16 min-h-[calc(100vh-80px)] flex items-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:gap-16">
          <FadeIn className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl lg:rounded-2xl">
              <Image
                src={getOptimizedStorageUrl(content.about.imageSrc || "/uploads/FRIDAYYY.png", { width: 800 })}
                alt="La Creola Interior"
                fill
                className="absolute inset-0 h-full w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </FadeIn>

          <FadeIn delay={120} className="w-full lg:w-1/2">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="heading-font text-4xl font-medium tracking-tight text-[#EFD077] md:text-5xl lg:text-6xl">
                  About La Creola
                </h1>
                <div className="h-0.5 w-16 bg-[#EFD077]" />
              </div>

              <div className="space-y-6 text-zinc-300">
                <p className="text-lg leading-relaxed">
                  At La Creola, we believe dining is more than just food — it&apos;s a story, a
                  feeling, and a journey. Located in the heart of Kigali, La Creola brings together
                  bold African spirit and refined Asian influence in a way that feels both familiar
                  and refreshingly new.
                </p>
                <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                  Our culinary philosophy is rooted in fusion without compromise: blending vibrant
                  spices, fresh local ingredients, and innovative techniques to create dishes that
                  surprise and delight. From shareable tapas inspired by the rhythms of Africa to
                  signature creations with an Asian twist, each plate is crafted to ignite
                  conversation and curiosity. We pair our food with creative cocktails and drinks,
                  designed to complement the menu and elevate your experience — whether you’re here
                  for an evening dinner, a relaxed lunch, or a vibrant night with friends.
                </p>
                <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                  But La Creola is more than a restaurant — it&apos;s a place to gather, celebrate,
                  and create memories. Our warm, inviting space and attentive service reflect
                  Rwandan hospitality at its best, welcoming locals and travelers alike. We’re proud
                  to be part of Kigali’s thriving culinary scene, offering a unique dining story
                  that is rooted in culture, creativity, and connection.
                </p>
              </div>

              <a
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-[#FDE68A] px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-500/10"
              >
                BOOK A TABLE
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

