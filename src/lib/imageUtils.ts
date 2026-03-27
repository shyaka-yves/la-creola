/**
 * Options for Supabase image transformation
 */
export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'origin';
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Transforms a Supabase storage URL into an optimized transformation URL.
 * Standard URL: https://[id].supabase.co/storage/v1/object/public/[bucket]/[path]
 * Transformed: https://[id].supabase.co/storage/v1/render/image/public/[bucket]/[path]?width=...
 */
export function getOptimizedImageUrl(src: string | undefined | null, options: ImageOptions = {}): string {
  if (!src || typeof src !== 'string') {
    return src || "";
  }

  // NOTE: Supabase Image Transformation is a paid feature (Pro Plan).
  // Since the current project is on the Free Plan, we revert to standard public URLs.
  // Next.js will still optimize these images on the server side if unoptimized: true is removed from next.config.ts.
  
  if (!src.includes('supabase.co/storage/v1/object/public/')) {
    return src;
  }

  // We keep the original URL but we could theoretically add Next.js-compatible params 
  // if we were using a custom loader. For now, we'll just return the src and let 
  // Next.js Image component handle the optimization via proxying.
  return src;
}

/**
 * Preset transformations for common use cases
 */
export const IMAGE_PRESETS = {
  THUMBNAIL: { width: 400, quality: 75, format: 'webp' as const },
  GALLERY_GRID: { width: 600, quality: 80, format: 'webp' as const },
  HERO: { width: 1920, quality: 85, format: 'webp' as const },
  BLOG_CARD: { width: 800, quality: 80, format: 'webp' as const },
} as const;
