/**
 * Optimizes Supabase storage URLs for better performance and reduced bandwidth.
 * 
 * Transformation service documentation:
 * https://supabase.com/docs/guides/storage/serving/image-transformations
 */
export function getOptimizedStorageUrl(
  url: string | undefined | null,
  options: {
    width?: number;
    quality?: number;
    format?: "webp" | "origin" | "avif";
    resize?: "cover" | "contain" | "fill";
  } = {}
): string {
  if (!url) return "";

  // Only optimize Supabase storage URLs
  // Standard format: https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[path]
  if (!url.includes(".supabase.co/storage/v1/object/public/")) {
    return url;
  }

  const {
    width = 800,
    quality = 60,
    format = "webp",
    resize = "cover",
  } = options;

  // Swap /object/public/ with /render/image/public/ for transformation service
  const transformedUrl = url.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/"
  );

  // Add optimization parameters
  const params = new URLSearchParams();
  if (width) params.append("width", width.toString());
  if (quality) params.append("quality", quality.toString());
  if (format) params.append("format", format);
  if (resize) params.append("resize", resize);

  return `${transformedUrl}?${params.toString()}`;
}
