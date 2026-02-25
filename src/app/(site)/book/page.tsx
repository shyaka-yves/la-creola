\"use client\";

import { useState, useMemo } from \"react\";

function getMinDateTimeValue() {
  const now = new Date();
  // Add 2 hours
  now.setHours(now.getHours() + 2);
  // Round minutes up to nearest 5 minutes
  const minutes = now.getMinutes();
  const rounded = Math.ceil(minutes / 5) * 5;
  now.setMinutes(rounded, 0, 0);

  const iso = now.toISOString();
  return iso.slice(0, 16); // yyyy-MM-ddTHH:mm
}

export default function BookPage() {
  const minDateTime = useMemo(getMinDateTimeValue, []);

  const [name, setName] = useState(\"\");
  const [email, setEmail] = useState(\"\");
  const [phone, setPhone] = useState(\"\");
  const [dateTime, setDateTime] = useState(\"\");
  const [guests, setGuests] = useState(\"\"");
  const [notes, setNotes] = useState(\"\");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage(null);
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError(\"Name and email are required.\");
      return;
    }
    if (!dateTime) {
      setError(\"Please choose a date and time.\");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(\"/api/reservations\", {
        method: \"POST\",
        headers: { \"Content-Type\": \"application/json\" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: dateTime,
          guests: guests ? Number(guests) : undefined,
          notes,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.error || \"Something went wrong. Please try again.\");
      }

      setMessage(\"Thank you. Your booking request has been sent.\");
      setName(\"\");
      setEmail(\"\");
      setPhone(\"\");
      setDateTime(\"\");
      setGuests(\"\");
      setNotes(\"\");
    } catch (err) {
      setError(err instanceof Error ? err.message : \"Something went wrong. Please try again.\");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className=\"min-h-screen bg-gradient-to-b from-black via-slate-950 to-black\">
      <div className=\"mx-auto flex max-w-4xl flex-col gap-10 px-4 py-16 sm:py-20\">
        <div>
          <p className=\"text-xs uppercase tracking-[0.25em] text-gold\">Book a Table</p>
          <h1 className=\"heading-font mt-3 text-3xl font-semibold text-white sm:text-4xl\">
            Reserve your evening at La Creola
          </h1>
          <p className=\"mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base\">
            Share a few details and we&apos;ll confirm your reservation as soon as possible.
            Bookings must be at least{" "}
            <span className=\"font-semibold text-gold\">2 hours</span> from the current time.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className=\"card-glass grid gap-6 rounded-3xl border border-zinc-800 bg-black/60 p-6 shadow-xl shadow-black/60 sm:p-8 md:grid-cols-2\"
        >
          <div className=\"space-y-4\">
            <div>
              <label className=\"block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400\">
                Name *
              </label>
              <input
                type=\"text\"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className=\"mt-2 w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold\"
                required
              />
            </div>

            <div>
              <label className=\"block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400\">
                Email *
              </label>
              <input
                type=\"email\"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=\"mt-2 w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold\"
                required
              />
            </div>

            <div>
              <label className=\"block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400\">
                Phone
              </label>
              <input
                type=\"tel\"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className=\"mt-2 w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold\"
              />
            </div>
          </div>

          <div className=\"space-y-4\">
            <div>
              <label className=\"block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400\">
                Date &amp; Time *
              </label>
              <div className=\"relative mt-2\">
                <input
                  type=\"datetime-local\"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  min={minDateTime}
                  className=\"w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 pr-10 text-sm text-white outline-none ring-0 transition focus:border-gold\"
                  required
                />
                <span className=\"pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500\">
                  <svg
                    xmlns=\"http://www.w3.org/2000/svg\"
                    viewBox=\"0 0 24 24\"
                    className=\"h-4 w-4\"
                    aria-hidden=\"true\"
                  >
                    <rect
                      x=\"3\"
                      y=\"4\"
                      width=\"18\"
                      height=\"18\"
                      rx=\"2\"
                      ry=\"2\"
                      fill=\"none\"
                      stroke=\"currentColor\"
                      strokeWidth=\"1.5\"
                    />
                    <path
                      d=\"M3 9h18M9 3v4M15 3v4\"
                      fill=\"none\"
                      stroke=\"currentColor\"
                      strokeWidth=\"1.5\"
                      strokeLinecap=\"round\"
                    />
                  </svg>
                </span>
              </div>
              <p className=\"mt-1 text-[11px] text-zinc-500\">
                You can&apos;t select past times; minimum is 2 hours from now.
              </p>
            </div>

            <div>
              <label className=\"block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400\">
                Guests
              </label>
              <input
                type=\"number\"
                min={1}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className=\"mt-2 w-full rounded-full border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold\"
              />
            </div>

            <div>
              <label className=\"block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400\">
                Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className=\"mt-2 w-full rounded-2xl border border-zinc-700 bg-black/60 px-4 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-gold\"
                placeholder=\"Allergies, special occasions, or seating preferences\"
              />
            </div>
          </div>

          <div className=\"md:col-span-2 mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between\">
            <div className=\"space-y-1 text-xs text-zinc-400\">
              <p>
                By submitting this form, you&apos;re requesting a reservation at La Creola. We&apos;ll
                confirm by email or phone.
              </p>
            </div>

            <button
              type=\"submit\"
              disabled={submitting}
              className=\"gold-gradient inline-flex items-center justify-center rounded-full px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-md shadow-yellow-500/40 transition hover:shadow-yellow-400/60 disabled:cursor-not-allowed disabled:opacity-70\"
            >
              {submitting ? \"Sending...\" : \"Submit Booking\"}
            </button>
          </div>

          {error && (
            <p className=\"md:col-span-2 text-sm font-medium text-red-400\">
              {error}
            </p>
          )}
          {message && (
            <p className=\"md:col-span-2 text-sm font-medium text-emerald-400\">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

"use client";

import { FadeIn } from "@/components/FadeIn";
import { useState } from "react";

export default function BookPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          date: [date, time].filter(Boolean).join(" "),
          guests,
          notes: notes || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setMessage(data?.error ?? "Failed to submit request");
        setLoading(false);
        return;
      }
      setMessage("Reservation request received. We'll contact you shortly.");
      setName("");
      setEmail("");
      setDate("");
      setTime("");
      setPhone("");
      setGuests(1);
      setNotes("");
      setLoading(false);
    } catch {
      setMessage("Failed to submit request");
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <section className="section-padding bg-black/95">
        <div className="mx-auto max-w-xl px-4">
          <FadeIn>
            <h1 className="heading-font text-center text-2xl font-semibold text-[#D4AF37] sm:text-3xl">
              Reserve Your Table
            </h1>
            <p className="mt-2 text-center text-sm text-zinc-400">
              Fill in the details below and we&apos;ll get back to you to confirm.
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="card-glass mt-8 rounded-3xl px-6 py-7 sm:px-10 sm:py-10">
              <form onSubmit={submit} className="space-y-4">
                <Field label="Name">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </Field>

                <Field label="Phone">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Date">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </Field>
                  <Field label="Time">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </Field>
                </div>

                <Field label="Number of Guests">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="More Details">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-24 w-full rounded-xl border border-zinc-700/80 bg-black/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </Field>

                {message ? (
                  <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-200">
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="gold-gradient inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold text-black disabled:opacity-60"
                >
                  {loading ? "Submitting…" : "Reserve Table"}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-200">{label}</span>
      {children}
    </label>
  );
}
