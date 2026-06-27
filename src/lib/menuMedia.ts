const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i;

export type MenuMediaKind = "pdf" | "image" | "unknown";

export function getMenuMediaKind(url: string): MenuMediaKind {
  const trimmed = url.trim();
  if (!trimmed) return "unknown";

  const lower = trimmed.toLowerCase();
  if (lower.includes(".pdf") || lower.includes("format=pdf") || lower.includes("/pdf/")) {
    return "pdf";
  }
  if (IMAGE_EXTENSIONS.test(trimmed)) {
    return "image";
  }
  return "pdf";
}

export function getMenuEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const kind = getMenuMediaKind(trimmed);
  if (kind === "image") return trimmed;

  return `/api/menu-pdf?url=${encodeURIComponent(trimmed)}`;
}
