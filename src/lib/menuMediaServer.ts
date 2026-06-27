import { getMenuMediaKind } from "@/lib/menuMedia";
import { cloudinary } from "@/lib/cloudinary";

type CloudinaryAsset = {
  publicId: string;
  resourceType: "image" | "raw" | "video";
};

export type MenuDisplay =
  | { mode: "image"; src: string }
  | { mode: "pdf"; viewUrl: string; openUrl: string };

function hasCloudinaryCredentials(): boolean {
  return Boolean(
    process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
}

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

type CloudinaryResource = {
  publicId: string;
  resourceType: "image" | "raw";
  deliveryType: "upload" | "authenticated" | "private";
  format: string;
};

async function resolveCloudinaryResource(url: string): Promise<CloudinaryResource | null> {
  const asset = parseCloudinaryUrl(url);
  if (!asset || !hasCloudinaryCredentials()) return null;

  const preferred = asset.resourceType === "raw" ? "raw" : "image";
  const alternate = preferred === "raw" ? "image" : "raw";

  for (const resourceType of [preferred, alternate]) {
    try {
      const resource = await cloudinary.api.resource(asset.publicId, {
        resource_type: resourceType,
      });
      const deliveryType = resource.type as CloudinaryResource["deliveryType"];
      return {
        publicId: asset.publicId,
        resourceType: resourceType as "image" | "raw",
        deliveryType:
          deliveryType === "authenticated" || deliveryType === "private"
            ? deliveryType
            : "upload",
        format: resource.format || "pdf",
      };
    } catch {
      // Try the other resource type.
    }
  }

  return null;
}

export async function getCloudinarySignedUrl(url: string): Promise<string | null> {
  const resource = await resolveCloudinaryResource(url);
  if (!resource) return null;

  return cloudinary.url(resource.publicId, {
    secure: true,
    resource_type: resource.resourceType,
    type: resource.deliveryType,
    sign_url: true,
    format: resource.format,
  });
}

export async function getCloudinaryDownloadUrl(url: string): Promise<string | null> {
  const resource = await resolveCloudinaryResource(url);
  if (!resource || !hasCloudinaryCredentials()) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  return cloudinary.utils.private_download_url(resource.publicId, resource.format, {
    resource_type: resource.resourceType,
    type: resource.deliveryType,
    expires_at: expiresAt,
    attachment: false,
  });
}

export async function fetchMenuBytes(url: string): Promise<{
  buffer: ArrayBuffer;
  contentType: string;
} | null> {
  const candidates = [
    await getCloudinaryDownloadUrl(url),
    await getCloudinarySignedUrl(url),
    url,
  ].filter((candidate, index, arr) => candidate && arr.indexOf(candidate) === index) as string[];

  for (const candidate of candidates) {
    const response = await fetch(candidate, { cache: "no-store" });
    if (!response.ok) continue;

    const contentType = response.headers.get("content-type") ?? "application/pdf";
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength === 0) continue;

    return { buffer, contentType };
  }

  return null;
}

function menuProxyUrl(sourceUrl: string): string {
  return `/api/menu-pdf?url=${encodeURIComponent(sourceUrl)}`;
}

export async function resolveMenuDisplay(url: string): Promise<MenuDisplay | null> {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const kind = getMenuMediaKind(trimmed);
  if (kind === "image") {
    return { mode: "image", src: trimmed };
  }

  // Always serve PDFs from our domain — Cloudinary often blocks inline embed/download in browsers.
  const proxyUrl = menuProxyUrl(trimmed);

  return {
    mode: "pdf",
    viewUrl: proxyUrl,
    openUrl: proxyUrl,
  };
}
