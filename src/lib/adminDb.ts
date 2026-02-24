import { promises as fs } from "node:fs";
import path from "node:path";

export type AdminUser = {
  id: string;
  username: string;
  passwordHash: string; // bcrypt hash
  createdAt: string;
  lastLogin?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const ADMINS_PATH = path.join(DATA_DIR, "admins.json");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory exists
  }
}

async function readAdmins(): Promise<AdminUser[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(ADMINS_PATH, "utf8");
    return JSON.parse(raw) as AdminUser[];
  } catch {
    return [];
  }
}

async function writeAdmins(admins: AdminUser[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(ADMINS_PATH, JSON.stringify(admins, null, 2), "utf8");
}

export async function listAdmins(): Promise<AdminUser[]> {
  return readAdmins();
}

export async function findAdminByUsername(username: string): Promise<AdminUser | null> {
  const admins = await readAdmins();
  return admins.find((a) => a.username === username) ?? null;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export async function createAdmin(username: string, passwordHash: string): Promise<AdminUser> {
  const admins = await readAdmins();
  const admin: AdminUser = {
    id: generateId(),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  admins.push(admin);
  await writeAdmins(admins);
  return admin;
}

export async function updateAdminLastLogin(username: string): Promise<void> {
  const admins = await readAdmins();
  const admin = admins.find((a) => a.username === username);
  if (admin) {
    admin.lastLogin = new Date().toISOString();
    await writeAdmins(admins);
  }
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const admins = await readAdmins();
  const filtered = admins.filter((a) => a.id !== id);
  if (filtered.length === admins.length) return false;
  await writeAdmins(filtered);
  return true;
}
