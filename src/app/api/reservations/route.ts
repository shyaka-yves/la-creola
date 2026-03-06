import { NextResponse } from "next/server";
import { BrevoClient } from "@getbrevo/brevo";
import { addReservation, type ReservationRecord } from "@/lib/reservationsDb";

export const runtime = "nodejs";

const RESERVATIONS_EMAIL = "it@azzurrirwanda.com";

async function sendReservationEmail(record: ReservationRecord) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Reservations] BREVO_API_KEY is missing");
    return;
  }

  const client = new BrevoClient({ apiKey });

  const lines = [
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    record.phone ? `Phone: ${record.phone}` : null,
    record.date ? `Date & Time: ${record.date}` : null,
    record.guests ? `Guests: ${record.guests}` : null,
    record.notes ? `Notes:\n${record.notes}` : null,
  ].filter(Boolean);

  await client.transactionalEmails.sendTransacEmail({
    subject: `[La Creola] New reservation from ${record.name}`,
    htmlContent: `<html><body><h3>New table reservation request:</h3><ul>${lines.map(l => `<li>${l}</li>`).join("")}</ul><p>Submitted at: ${new Date(record.createdAt).toLocaleString()}</p></body></html>`,
    sender: { name: "La Creola Website", email: "shyakayvany@gmail.com" },
    to: [{ email: RESERVATIONS_EMAIL }],
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

  // Normalize and validate requested date/time.
  let normalizedDate: string | undefined;
  if (date) {
    const requested = new Date(date);

    if (Number.isNaN(requested.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Please choose a valid date and time." },
        { status: 400 },
      );
    }

    const now = new Date();
    const min = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    if (requested < min) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bookings must be at least 2 hours from now. Please choose a later time.",
        },
        { status: 400 },
      );
    }

    normalizedDate = requested.toISOString();
  }

  const record = await addReservation({
    name,
    email,
    phone: phone || undefined,
    date: normalizedDate ?? (date || undefined),
    guests: Number.isFinite(guests) && guests > 0 ? guests : undefined,
    notes: notes || undefined,
    status: "new",
  });

  try {
    console.log("[Reservations] Attempting to send email via Brevo to:", RESERVATIONS_EMAIL);
    await sendReservationEmail(record);
    console.log("[Reservations] Email sent successfully");
  } catch (err) {
    console.error("[Reservations] Email failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true, id: record.id });
}

