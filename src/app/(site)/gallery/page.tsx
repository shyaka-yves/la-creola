import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { GallerySlideshow } from "@/components/GallerySlideshow";
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

  const images = galleryImages.length > 0
    ? galleryImages.map(img => ({ id: img.id, src: img.imageUrl, label: img.label }))
    : content.gallery.items.map((img, idx) => ({ id: `content-${idx}`, src: img.imageSrc, label: img.alt }));

  return (
    <div className="relative overflow-hidden min-h-screen bg-black">
      <section className="bg-black/95 pt-20 pb-8 sm:pt-24 sm:pb-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <h1 className="heading-font text-4xl font-semibold text-[#D4AF37] sm:text-5xl lg:text-6xl tracking-tight">
              {content.gallery.title || "Our Gallery"}
            </h1>
            <div className="h-0.5 w-16 bg-[#D4AF37]/70 mx-auto mt-6" />
          </FadeIn>
        </div>
      </section>

      <section className="bg-black/95 pb-20">
        <FadeIn delay={100}>
          <GallerySlideshow images={images} />
        </FadeIn>
      </section>
    </div>
  );
}

