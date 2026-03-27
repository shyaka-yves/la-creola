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
export function getOptimizedImageUrl(src: string, options: ImageOptions = {}): string {
  if (!src.includes('supabase.co/storage/v1/object/public/')) {
    return src;
  }

  // Convert object/public to render/image/public
  let optimizedUrl = src.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');

  const params = new URLSearchParams();
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.quality) params.set('quality', options.quality.toString());
  if (options.format) params.set('format', options.format);
  if (options.resize) params.set('resize', options.resize);

  const queryString = params.toString();
  return queryString ? `${optimizedUrl}?${queryString}` : optimizedUrl;
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
