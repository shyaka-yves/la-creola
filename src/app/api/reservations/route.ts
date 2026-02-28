import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addReservation, type ReservationRecord } from "@/lib/reservationsDb";

export const runtime = "nodejs";

const RESERVATIONS_EMAIL = "bushali716@gmail.com";

async function sendReservationEmail(record: ReservationRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  // Use Resend's default onboarding sender by default so it works without a custom domain.
  // You can override this with RESEND_FROM_EMAIL later when you have your own domain.
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "La Creola Website <onboarding@resend.dev>";
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
    await sendReservationEmail(record);
  } catch (err) {
    // Log so you can see in Vercel logs; reservation still succeeds
    console.error("[Reservations] Email failed:", err instanceof Error ? err.message : err);
    // If using a custom domain in Resend, set RESEND_FROM_EMAIL to that verified sender (e.g. La Creola <reservations@yourdomain.com>)
  }

  return NextResponse.json({ ok: true, id: record.id });
}

