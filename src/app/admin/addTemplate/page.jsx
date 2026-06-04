"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";

const emptyForm = {
  templateId: "",
  category: "",
  pricing: "",
  sellPrice: "",
  vendorPrice: "",
  title: "",
  description: "",
};

const inputClass =
  "mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-black/45";

export default function AddTemplate() {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/auth/me-admin');
        if (res.status !== 200) return router.push('/admin/signin');
        const data = res.data;
        if (!data?.user || data.user.role !== 'admin') {
          alert('Unauthorized access');
          return router.push('/admin/signin');
        }
        setAuthenticated(true);
      } catch (err) {
        router.push('/admin/signin');
      }
    })();
  }, [router]);

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (file) fd.append("featuredImage", file);

      await api.post("/templates/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Template created successfully.");
      setForm(emptyForm);
      setFile(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Create failed.");
    } finally {
      setLoading(false);
    }
  }

  return authenticated ? (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Template studio</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Add Template</h1>
        </div>
        <a href="/admin/allTemplate" className="border border-black bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white">
          View All Templates
        </a>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-6">
          <div className="border-b border-black/10 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Content</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Template details</h2>
          </div>

          <div className="mt-6 grid gap-5">
            <label className={labelClass}>
              Template ID
              <input placeholder="1" value={form.templateId} onChange={(e) => update("templateId", e.target.value)} className={inputClass} />
            </label>
            <label className={labelClass}>
              Title
              <input required placeholder="Heritage Mahal" value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Category
                <select required value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass}>
                  <option value="">Select category</option>
                  <option value="Hindu Weddings">Hindu Weddings</option>
                  <option value="Christian Weddings">Christian Weddings</option>
                  <option value="Sikh Weddings">Sikh Weddings</option>
                  <option value="Muslim Weddings">Muslim Weddings</option>
                  <option value="South-Indian Weddings">South-Indian Weddings</option>
                  <option value="Save the date">Save the date</option>
                </select>
              </label>
              <label className={labelClass}>
                Pricing label
                <input placeholder="INR 3,999" value={form.pricing} onChange={(e) => update("pricing", e.target.value)} className={inputClass} />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Sell price
                <input required type="number" min="0" placeholder="3999" value={form.sellPrice} onChange={(e) => update("sellPrice", e.target.value)} className={inputClass} />
              </label>
              <label className={labelClass}>
                Vendor price
                <input required type="number" min="0" placeholder="1999" value={form.vendorPrice} onChange={(e) => update("vendorPrice", e.target.value)} className={inputClass} />
              </label>
            </div>
            <label className={labelClass}>
              Description
              <textarea
                required
                placeholder="Describe the template style, use case, and included sections."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className={`${inputClass} min-h-36 resize-none leading-6`}
              />
            </label>
          </div>
        </section>

        <aside className="border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Media</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Featured image</h2>
          <label className="mt-5 flex min-h-52 cursor-pointer flex-col items-center justify-center border border-dashed border-black/25 bg-black/2 p-5 text-center transition hover:border-black">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
            <span className="text-sm font-semibold text-black">{file ? file.name : "Upload image"}</span>
            <span className="mt-2 text-xs leading-5 text-black/45">PNG, JPG, or WEBP preview image.</span>
          </label>
          {message ? <p className="mt-5 border border-black/10 px-4 py-3 text-sm font-medium text-black">{message}</p> : null}
          <button disabled={loading} className="mt-5 w-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Creating..." : "Create Template"}
          </button>
        </aside>
      </form>
    </div>
  ) : null;
}
