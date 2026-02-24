import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { listGalleryImages } from "@/lib/galleryDb";

export default async function GalleryPage() {
  const galleryImages = await listGalleryImages();

  return (
    <div className="relative overflow-hidden">
      <section className="bg-black/95 pt-12 pb-6 sm:pt-16 sm:pb-8 md:pt-20 md:pb-10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <h1 className="heading-font text-3xl font-semibold text-[#D4AF37] sm:text-4xl">
              Our Gallery
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="bg-black/90 pt-0 pb-12 sm:pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl px-4">
          {galleryImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-zinc-400">Gallery images coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {galleryImages.map((img, i) => (
                <FadeIn key={img.id} delay={30 * i}>
                  <div className="group relative w-full aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900/80 shadow-lg shadow-black/70 md:rounded-3xl">
                    <Image
                      src={img.imageUrl}
                      alt={img.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-xs font-medium text-zinc-200">
                      {img.label}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery is images only; no extra copy section */}
    </div>
  );
}

