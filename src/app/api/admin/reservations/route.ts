import { NextResponse } from "next/server";
import { listReservations, saveReservations, type ReservationRecord } from "@/lib/siteContent";

export const runtime = "nodejs";

export async function GET() {
  const items = await listReservations();
  return NextResponse.json({ ok: true, items });
}

export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { id?: string; status?: ReservationRecord["status"] }
    | null;
  const id = (body?.id ?? "").trim();
  const status = body?.status;

  if (!id || !status || !["new", "contacted", "closed"].includes(status)) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const items = await listReservations();
  const idx = items.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  items[idx] = { ...items[idx], status };
  await saveReservations(items);
  return NextResponse.json({ ok: true });
}

