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

function cloudinaryDeliveryResourceType(resourceType: CloudinaryAsset["resourceType"]): "image" | "raw" {
  return resourceType === "raw" ? "raw" : "image";
}

export async function getCloudinarySignedUrl(url: string): Promise<string | null> {
  const asset = parseCloudinaryUrl(url);
  if (!asset || !hasCloudinaryCredentials()) return null;

  const deliveryResourceType = cloudinaryDeliveryResourceType(asset.resourceType);

  let deliveryType: "upload" | "authenticated" | "private" = "upload";
  let format: string | undefined;

  try {
    const resource = await cloudinary.api.resource(asset.publicId, {
      resource_type: deliveryResourceType,
    });
    if (resource.type === "authenticated" || resource.type === "private") {
      deliveryType = resource.type;
    }
    if (resource.format) {
      format = resource.format;
    }
  } catch {
    // Fall back to defaults from the stored URL.
  }

  return cloudinary.url(asset.publicId, {
    secure: true,
    resource_type: deliveryResourceType,
    type: deliveryType,
    sign_url: true,
    format,
  });
}

export async function fetchMenuBytes(url: string): Promise<{
  buffer: ArrayBuffer;
  contentType: string;
} | null> {
  const signed = await getCloudinarySignedUrl(url);
  const candidates = [signed, url].filter(
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

export async function resolveMenuDisplay(url: string): Promise<MenuDisplay | null> {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const kind = getMenuMediaKind(trimmed);
  if (kind === "image") {
    return { mode: "image", src: trimmed };
  }

  const signed = await getCloudinarySignedUrl(trimmed);
  const openUrl = signed ?? trimmed;
  const viewUrl = parseCloudinaryUrl(trimmed)
    ? `/api/menu-pdf?url=${encodeURIComponent(trimmed)}`
    : openUrl;

  return {
    mode: "pdf",
    viewUrl,
    openUrl,
  };
}
