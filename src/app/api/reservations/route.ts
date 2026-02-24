import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
import {
  listReservations,
  saveReservations,
  type ReservationRecord,
} from "@/lib/siteContent";

export const runtime = "nodejs";

const RESERVATIONS_EMAIL = "shyakayvany@gmail.com";

async function sendReservationEmail(record: ReservationRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL ?? "La Creola <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const lines = [
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    record.phone ? `Phone: ${record.phone}` : null,
    record.date ? `Date & Time: ${record.date}` : null,
    record.guests ? `Guests: ${record.guests}` : null,
    record.notes ? `Notes:\n${record.notes}` : null,
  ].filter(Boolean);

  await resend.emails.send({
    from,
    to: [RESERVATIONS_EMAIL],
    subject: `[La Creola] New reservation from ${record.name}`,
    text: `New table reservation request:\n\n${lines.join("\n")}\n\nSubmitted at: ${new Date(record.createdAt).toLocaleString()}`,
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        email?: string;
        phone?: string;
        date?: string;
        guests?: number;
        notes?: string;
      }
    | null;

  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim();
  const phone = (body?.phone ?? "").trim();
  const date = (body?.date ?? "").trim();
  const guests = Number(body?.guests ?? NaN);
  const notes = (body?.notes ?? "").trim();

  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Name and email are required" },
      { status: 400 }
    );
  }

  const record: ReservationRecord = {
    id: crypto.randomBytes(12).toString("hex"),
    createdAt: new Date().toISOString(),
    name,
    email,
    phone: phone || undefined,
    date: date || undefined,
    guests: Number.isFinite(guests) && guests > 0 ? guests : undefined,
    notes: notes || undefined,
    status: "new",
  };

  const existing = await listReservations();
  existing.unshift(record);
  await saveReservations(existing);

  try {
    await sendReservationEmail(record);
  } catch {
    // Email failure should not block the reservation
  }

  return NextResponse.json({ ok: true, id: record.id });
}

