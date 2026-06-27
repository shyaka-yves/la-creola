import { cloudinary } from "@/lib/cloudinary";

type CloudinaryAsset = {
  publicId: string;
  resourceType: "image" | "raw" | "video";
};

export function parseCloudinaryUrl(url: string): CloudinaryAsset | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("cloudinary.com")) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex < 2) return null;

    const resourceType = segments[uploadIndex - 1];
    if (resourceType !== "image" && resourceType !== "raw" && resourceType !== "video") {
      return null;
    }

    const afterUpload = segments.slice(uploadIndex + 1);
    const withoutVersion =
      afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].slice(1))
        ? afterUpload.slice(1)
        : afterUpload;

    const publicIdWithExt = withoutVersion.join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    return {
      publicId,
      resourceType: resourceType as CloudinaryAsset["resourceType"],
    };
  } catch {
    return null;
  }
}

export function getCloudinarySignedUrl(url: string): string | null {
  const asset = parseCloudinaryUrl(url);
  if (!asset) return null;

  return cloudinary.url(asset.publicId, {
    secure: true,
    resource_type: asset.resourceType,
    type: "upload",
    sign_url: true,
  });
}

export async function fetchMenuBytes(url: string): Promise<{
  buffer: ArrayBuffer;
  contentType: string;
} | null> {
  const candidates = [url, getCloudinarySignedUrl(url)].filter(
    (candidate, index, arr) => candidate && arr.indexOf(candidate) === index
  ) as string[];

  for (const candidate of candidates) {
    const response = await fetch(candidate, { cache: "no-store" });
    if (!response.ok) continue;

    const contentType = response.headers.get("content-type") ?? "application/pdf";
    const buffer = await response.arrayBuffer();
    return { buffer, contentType };
  }

  return null;
}

/** Best URL for embedding PDFs in the browser (signed Cloudinary when needed). */
export function resolveMenuEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const signed = getCloudinarySignedUrl(trimmed);
  return signed ?? trimmed;
}
