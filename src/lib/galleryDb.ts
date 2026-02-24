import { promises as fs } from "node:fs";
import path from "node:path";

export type GalleryImage = {
  id: string;
  imageUrl: string;
  label: string;
  order: number;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const GALLERY_PATH = path.join(DATA_DIR, "gallery.json");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory exists
  }
}

async function readGallery(): Promise<GalleryImage[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(GALLERY_PATH, "utf8");
    return JSON.parse(raw) as GalleryImage[];
  } catch {
    return [];
  }
}

async function writeGallery(images: GalleryImage[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(GALLERY_PATH, JSON.stringify(images, null, 2), "utf8");
}

export async function listGalleryImages(): Promise<GalleryImage[]> {
  const images = await readGallery();
  return images.sort((a, b) => a.order - b.order);
}

export async function addGalleryImage(
  imageUrl: string,
  label: string,
  order?: number
): Promise<GalleryImage> {
  const images = await readGallery();
  const maxOrder = images.length > 0 ? Math.max(...images.map((i) => i.order)) : -1;
  const image: GalleryImage = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    imageUrl,
    label,
    order: order ?? maxOrder + 1,
    createdAt: new Date().toISOString(),
  };
  images.push(image);
  await writeGallery(images);
  return image;
}

export async function updateGalleryImage(
  id: string,
  updates: Partial<Pick<GalleryImage, "label" | "order" | "imageUrl">>
): Promise<boolean> {
  const images = await readGallery();
  const index = images.findIndex((i) => i.id === id);
  if (index === -1) return false;
  images[index] = { ...images[index], ...updates };
  await writeGallery(images);
  return true;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const images = await readGallery();
  const filtered = images.filter((i) => i.id !== id);
  if (filtered.length === images.length) return false;
  await writeGallery(filtered);
  return true;
}

export async function reorderGalleryImages(ids: string[]): Promise<void> {
  const images = await readGallery();
  const idMap = new Map(ids.map((id, index) => [id, index]));
  images.forEach((img) => {
    if (idMap.has(img.id)) {
      img.order = idMap.get(img.id)!;
    }
  });
  await writeGallery(images);
}
