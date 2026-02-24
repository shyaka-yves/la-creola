import { promises as fs } from "node:fs";
import path from "node:path";

export type Event = {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const EVENTS_PATH = path.join(DATA_DIR, "events.json");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory exists
  }
}

async function readEvents(): Promise<Event[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(EVENTS_PATH, "utf8");
    return JSON.parse(raw) as Event[];
  } catch {
    return [];
  }
}

async function writeEvents(events: Event[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(EVENTS_PATH, JSON.stringify(events, null, 2), "utf8");
}

export async function listEvents(): Promise<Event[]> {
  const events = await readEvents();
  return events.sort((a, b) => a.order - b.order);
}

export async function addEvent(
  date: string,
  title: string,
  description: string,
  imageUrl: string,
  order?: number
): Promise<Event> {
  const events = await readEvents();
  const maxOrder = events.length > 0 ? Math.max(...events.map((e) => e.order)) : -1;
  const event: Event = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    date,
    title,
    description,
    imageUrl,
    order: order ?? maxOrder + 1,
    createdAt: new Date().toISOString(),
  };
  events.push(event);
  await writeEvents(events);
  return event;
}

export async function updateEvent(
  id: string,
  updates: Partial<Pick<Event, "date" | "title" | "description" | "imageUrl" | "order">>
): Promise<boolean> {
  const events = await readEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return false;
  events[index] = { ...events[index], ...updates };
  await writeEvents(events);
  return true;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const events = await readEvents();
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return false;
  await writeEvents(filtered);
  return true;
}

export async function reorderEvents(ids: string[]): Promise<void> {
  const events = await readEvents();
  const idMap = new Map(ids.map((id, index) => [id, index]));
  events.forEach((event) => {
    if (idMap.has(event.id)) {
      event.order = idMap.get(event.id)!;
    }
  });
  await writeEvents(events);
}
