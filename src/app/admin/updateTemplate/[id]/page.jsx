"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/api/axios";

const inputClass =
  "mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-black/45";

export default function UpdateTemplate() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/templates/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Unable to load template.");
      }
    }

    if (id) load();
  }, [id]);

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k] || ""));
      if (file) fd.append("featuredImage", file);
      await api.put(`/templates/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      router.push("/admin/allTemplate");
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!form) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="border border-black/10 bg-white p-8 text-sm font-medium text-black/60">Loading template...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Template studio</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Update Template</h1>
        </div>
        <a href="/admin/allTemplate" className="border border-black bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white">
          Back to Templates
        </a>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-6">
          <div className="border-b border-black/10 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Content</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Template details</h2>
          </div>

          <div className="mt-6 grid gap-5">
            <label className={labelClass}>
              Title
              <input required placeholder="Template title" value={form.title || ""} onChange={(e) => update("title", e.target.value)} className={inputClass} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Category
                <input required placeholder="Category" value={form.category || ""} onChange={(e) => update("category", e.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                Pricing label
                <input placeholder="INR 3,999" value={form.pricing || ""} onChange={(e) => update("pricing", e.target.value)} className={inputClass} />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <label className={labelClass}>
                Regular price
                <input required type="number" min="0" value={form.regularPrice || ""} onChange={(e) => update("regularPrice", e.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                Sell price
                <input required type="number" min="0" value={form.sellPrice || ""} onChange={(e) => update("sellPrice", e.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                Vendor price
                <input required type="number" min="0" value={form.vendorPrice || ""} onChange={(e) => update("vendorPrice", e.target.value)} className={inputClass} />
              </label>
            </div>
            <label className={labelClass}>
              Description
              <textarea
                required
                value={form.description || ""}
                onChange={(e) => update("description", e.target.value)}
                className={`${inputClass} min-h-36 resize-none leading-6`}
              />
            </label>
          </div>
        </section>

        <aside className="border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Media</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Featured image</h2>
          {form.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.featuredImage} alt={form.title || "Template"} className="mt-5 aspect-[4/3] w-full border border-black/10 object-cover" />
          ) : null}
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center border border-dashed border-black/25 bg-black/2 p-5 text-center transition hover:border-black">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
            <span className="text-sm font-semibold text-black">{file ? file.name : "Replace image"}</span>
            <span className="mt-2 text-xs leading-5 text-black/45">Leave empty to keep current image.</span>
          </label>
          {message ? <p className="mt-5 border border-black/10 px-4 py-3 text-sm font-medium text-black">{message}</p> : null}
          <button disabled={loading} className="mt-5 w-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Updating..." : "Update Template"}
          </button>
        </aside>
      </form>
    </div>
  );
}
