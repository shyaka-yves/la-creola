import { listGalleryImages } from "@/lib/galleryDb";
import { getSiteContent } from "@/lib/siteContent";
import { Metadata } from "next";
import { GalleryView } from "@/components/GalleryView";

export const metadata: Metadata = {
  title: "Gallery | La Creola",
  description: "Explore the ambiance, dishes, and environment of La Creola.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [content, galleryImages] = await Promise.all([getSiteContent(), listGalleryImages()]);

  return <GalleryView content={content} galleryImages={galleryImages} />;
}
