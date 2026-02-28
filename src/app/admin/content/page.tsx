"use client";

import { useEffect, useMemo, useState } from "react";

type SiteContent = unknown;

type MediaFile = { name: string; url: string; type: "image" | "video" | "pdf" };

export default function AdminContentPage() {
  const [content, setContent] = useState<any>(null);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const imageOptions = useMemo(
    () => media.filter((m) => m.type === "image"),
    [media]
  );
  const videoOptions = useMemo(
    () => media.filter((m) => m.type === "video"),
    [media]
  );
  const pdfOptions = useMemo(
    () => media.filter((m) => m.type === "pdf"),
    [media]
  );

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [cRes, mRes] = await Promise.all([
        fetch("/api/admin/content", { cache: "no-store" }),
        fetch("/api/admin/media", { cache: "no-store" }),
      ]);

      const cData = (await cRes.json()) as any;
      const mData = (await mRes.json()) as any;

      if (!cData.ok) throw new Error(cData.error ?? "Failed to load content");
      if (!mData.ok) throw new Error(mData.error ?? "Failed to load media");

      setContent(cData.content);
      setMedia(mData.files);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content as SiteContent),
      });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Save failed");
      }
      setOkMsg("Saved");
      setSaving(false);
      setTimeout(() => setOkMsg(null), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-zinc-400">Loading content…</div>;
  }

  if (!content) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        Failed to load content.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            Content
          </p>
          <h1 className="mt-2 text-xl font-semibold text-white">
            Hero & content images
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Change hero background (image or video) and all content images. Upload files in{" "}
            <a className="text-zinc-200 underline" href="/admin/media">Media Library</a>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {okMsg ? (
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              {okMsg}
            </span>
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="gold-gradient inline-flex h-10 items-center justify-center rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] text-black disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <EditorCard title="Hero background">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Media type"
            value={content.hero.mediaType}
            options={[
              { label: "Image", value: "image" },
              { label: "Video", value: "video" },
            ]}
            onChange={(v) =>
              setContent((c: any) => ({ ...c, hero: { ...c.hero, mediaType: v } }))
            }
          />
          <div className="space-y-3">
            <Select
              label="Choose from Media Library"
              value={content.hero.mediaSrc}
              options={[
                { label: "— Select —", value: "" },
                ...(content.hero.mediaType === "video"
                  ? videoOptions.map((m) => ({ label: m.name, value: m.url }))
                  : imageOptions.map((m) => ({ label: m.name, value: m.url }))),
              ]}
              onChange={(v) =>
                setContent((c: any) => ({ ...c, hero: { ...c.hero, mediaSrc: v } }))
              }
            />
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                Or paste media URL / path
              </p>
              <input
                type="text"
                value={content.hero.mediaSrc}
                onChange={(e) =>
                  setContent((c: any) => ({
                    ...c,
                    hero: { ...c.hero, mediaSrc: e.target.value },
                  }))
                }
                placeholder="e.g. /uploads/hero.mp4 or https://..."
                className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </EditorCard>

      <EditorCard title="About section image">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Select
            label="Choose from Media Library"
            value={content.about.imageSrc}
            options={[
              { label: "— Select —", value: "" },
              ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
            ]}
            onChange={(v) =>
              setContent((c: any) => ({ ...c, about: { ...c.about, imageSrc: v } }))
            }
          />
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Or paste image URL / path
            </p>
            <input
              type="text"
              value={content.about.imageSrc}
              onChange={(e) =>
                setContent((c: any) => ({
                  ...c,
                  about: { ...c.about, imageSrc: e.target.value },
                }))
              }
              placeholder="e.g. /uploads/about.jpg or https://..."
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Excellence section image">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Select
            label="Choose from Media Library"
            value={content.excellence.imageSrc}
            options={[
              { label: "— Select —", value: "" },
              ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
            ]}
            onChange={(v) =>
              setContent((c: any) => ({
                ...c,
                excellence: { ...c.excellence, imageSrc: v },
              }))
            }
          />
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Or paste image URL / path
            </p>
            <input
              type="text"
              value={content.excellence.imageSrc}
              onChange={(e) =>
                setContent((c: any) => ({
                  ...c,
                  excellence: { ...c.excellence, imageSrc: e.target.value },
                }))
              }
              placeholder="e.g. /uploads/excellence.jpg or https://..."
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Events section images">
        <div className="grid gap-4 md:grid-cols-2">
          {(content.events.items ?? []).map((_: any, i: number) => (
            <Select
              key={i}
              label={`Event ${i + 1} image`}
              value={content.events.items[i].imageSrc}
              options={[
                { label: "— Select —", value: "" },
                ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
              ]}
              onChange={(v) =>
                setContent((c: any) => {
                  const items = [...(c.events.items ?? [])];
                  if (!items[i]) items[i] = { date: "", title: "", description: "", imageSrc: "" };
                  items[i] = { ...items[i], imageSrc: v };
                  return { ...c, events: { ...c.events, items } };
                })
              }
            />
          ))}
        </div>
      </EditorCard>

      <EditorCard title="Menu PDF">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Select
            label="Choose from Media Library"
            value={content.menu?.pdfUrl || ""}
            options={[
              { label: "— Select —", value: "" },
              ...pdfOptions.map((m) => ({ label: m.name, value: m.url })),
            ]}
            onChange={(v) =>
              setContent((c: any) => ({
                ...c,
                menu: { ...c.menu, pdfUrl: v },
              }))
            }
          />
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
              Or paste PDF URL / path
            </p>
            <input
              type="text"
              value={content.menu?.pdfUrl || ""}
              onChange={(e) =>
                setContent((c: any) => ({
                  ...c,
                  menu: { ...c.menu, pdfUrl: e.target.value },
                }))
              }
              placeholder="e.g. /uploads/menu.pdf or https://..."
              className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>
        </div>
      </EditorCard>

      <EditorCard title="Blog section">
        <div className="grid gap-8">
          {(content.blog.items ?? []).map((_: any, i: number) => (
            <div key={i} className="space-y-4 border-b border-zinc-800 pb-6 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-zinc-300">Blog Item {i + 1}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Image"
                  value={content.blog.items[i].imageSrc || ""}
                  options={[
                    { label: "— Select —", value: "" },
                    ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
                  ]}
                  onChange={(v) =>
                    setContent((c: any) => {
                      const items = [...(c.blog.items ?? [])];
                      if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                      items[i] = { ...items[i], imageSrc: v };
                      return { ...c, blog: { ...c.blog, items } };
                    })
                  }
                />

                <div className="space-y-4">
                  <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      Category
                    </p>
                    <input
                      type="text"
                      value={content.blog.items[i].category || ""}
                      onChange={(e) =>
                        setContent((c: any) => {
                          const items = [...(c.blog.items ?? [])];
                          if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                          items[i] = { ...items[i], category: e.target.value };
                          return { ...c, blog: { ...c.blog, items } };
                        })
                      }
                      placeholder="e.g. Chef's Notes"
                      className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      Title
                    </p>
                    <input
                      type="text"
                      value={content.blog.items[i].title || ""}
                      onChange={(e) =>
                        setContent((c: any) => {
                          const items = [...(c.blog.items ?? [])];
                          if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                          items[i] = { ...items[i], title: e.target.value };
                          return { ...c, blog: { ...c.blog, items } };
                        })
                      }
                      className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                      Excerpt
                    </p>
                    <textarea
                      value={content.blog.items[i].excerpt || ""}
                      onChange={(e) =>
                        setContent((c: any) => {
                          const items = [...(c.blog.items ?? [])];
                          if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                          items[i] = { ...items[i], excerpt: e.target.value };
                          return { ...c, blog: { ...c.blog, items } };
                        })
                      }
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-zinc-700/80 bg-black/70 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </EditorCard>

      <EditorCard title="Blog section images">
        <div className="grid gap-4 md:grid-cols-2">
          {(content.blog.items ?? []).map((_: any, i: number) => (
            <Select
              key={i}
              label={`Blog ${i + 1} image`}
              value={content.blog.items[i].imageSrc}
              options={[
                { label: "— Select —", value: "" },
                ...imageOptions.map((m) => ({ label: m.name, value: m.url })),
              ]}
              onChange={(v) =>
                setContent((c: any) => {
                  const items = [...(c.blog.items ?? [])];
                  if (!items[i]) items[i] = { category: "", title: "", excerpt: "", imageSrc: "" };
                  items[i] = { ...items[i], imageSrc: v };
                  return { ...c, blog: { ...c.blog, items } };
                })
              }
            />
          ))}
        </div>
      </EditorCard>
    </div>
  );
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-glass rounded-3xl p-6">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-10 w-full rounded-full border border-zinc-700/80 bg-black/70 px-4 text-sm text-zinc-100 focus:border-[#D4AF37] focus:outline-none"
      >
        {options.map((o) => (
          <option key={`${o.label}-${o.value}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
