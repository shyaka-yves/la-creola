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
