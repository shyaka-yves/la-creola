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
 * Transforms a media URL (Supabase or Cloudinary) into an optimized transformation URL.
 */
export function getOptimizedImageUrl(src: string | undefined | null, options: ImageOptions = {}): string {
  if (!src || typeof src !== 'string') {
    return src || "";
  }

  // Handle Cloudinary URLs
  if (src.includes('res.cloudinary.com')) {
    const parts = src.split('/upload/');
    if (parts.length === 2) {
      const { width, quality = 80, format = 'auto' } = options;
      
      // Cloudinary transformations: f_auto (auto format), q_auto (auto quality)
      // If width is provided, we use c_limit or c_fill
      let params = `f_${format === 'webp' ? 'webp' : 'auto'},q_${quality === 100 ? 'auto:best' : 'auto'}`;
      
      if (width) {
        params += `,w_${width},c_limit`;
      }
      
      return `${parts[0]}/upload/${params}/${parts[1]}`;
    }
    return src;
  }

  // Handle Supabase URLs (Fallback)
  if (src.includes('supabase.co/storage/v1/object/public/')) {
    // Supabase Image Transformation is a paid feature (Pro Plan).
    // For now we return the original URL, but Next.js will optimize it 
    // because we added it to remotePatterns and removed global unoptimized: true.
    return src;
  }

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
