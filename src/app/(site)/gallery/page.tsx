import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { listGalleryImages } from "@/lib/galleryDb";
import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | La Creola",
  description: "Explore the ambiance, dishes, and environment of La Creola.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [content, galleryImages] = await Promise.all([getSiteContent(), listGalleryImages()]);

  const galleryFromDb = galleryImages ?? [];
  const galleryFromContent = content.gallery.items ?? [];
  const images =
    galleryFromDb.length > 0
      ? galleryFromDb.map((img) => ({
        id: img.id,
        src: img.imageUrl,
        label: img.label,
      }))
      : galleryFromContent.map((img, index) => ({
        id: `content-${index}`,
        src: img.imageSrc,
        label: img.alt,
      }));

  return (
    <div className="relative overflow-hidden">
      <section className="bg-black/95 pt-12 pb-6 sm:pt-16 sm:pb-8 md:pt-20 md:pb-10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <h1 className="heading-font text-3xl font-semibold text-[#D4AF37] sm:text-4xl">
              {content.gallery.title || "Our Gallery"}
            </h1>
          </FadeIn>
        </div>
      </section>

      <section className="bg-black/90 pt-0 pb-12 sm:pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl px-4">
          {images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-zinc-400">Gallery images coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {images.map((img, i) => (
                <FadeIn key={img.id} delay={30 * i}>
                  <div className="group relative w-full aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-700/70 bg-zinc-900/80 shadow-lg shadow-black/70 md:rounded-3xl">
                    <Image
                      src={img.src}
                      alt={img.label}
                      fill
                      unoptimized={img.src.startsWith("http")}
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

