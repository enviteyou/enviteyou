"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/api/axios";
import { ArrowLeft, Upload, Check, Layout, AlertCircle } from "lucide-react";
import Image from "next/image";

const AVAILABLE_TABS = ["Essentials", "Invitation", "Events", "Story", "Gallery", "Info", "RSVP", "Music"];

const inputClass =
  "mt-2 w-full border border-black/10 bg-[#fbf9f7] rounded-xl px-4 py-3.5 text-sm text-black outline-none transition-all placeholder:text-black/30 focus:border-[#74313d] focus:bg-white focus:ring-4 focus:ring-[#74313d]/5";
const labelClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]/60 block";

export default function UpdateTemplate() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me-admin");
        if (res.status !== 200) return router.push("/admin/signin");
        const data = res.data;
        if (!data?.user || data.user.role !== "admin") {
          alert("Unauthorized access");
          return router.push("/admin/signin");
        }
        setAuthenticated(true);
      } catch (err) {
        router.push("/admin/signin");
      }
    })();
  }, [router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/templates/${id}`);
        const data = res.data;
        if (!data.allowedTabs || data.allowedTabs.length === 0) {
          data.allowedTabs = [...AVAILABLE_TABS];
        }
        setForm(data);
      } catch (err) {
        console.error(err);
        setMessage("Unable to load template.");
      }
    }

    if (id && authenticated) load();
  }, [id, authenticated]);

  useEffect(() => {
    if (!file) {
      setFilePreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function update(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (k === "allowedTabs") {
          fd.append(k, JSON.stringify(form[k] || []));
        } else {
          fd.append(k, form[k] ?? "");
        }
      });
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
        <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm font-semibold text-black/45 shadow-sm">
          Loading template workspace details...
        </div>
      </div>
    );
  }

  return authenticated ? (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header and Back buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Template Studio</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black font-heading">Update Template</h1>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-black/55">
            Modify theme configurations, adjust metadata values, and update catalog template image assets.
          </p>
        </div>
        <a
          href="/admin/allTemplate"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3.5 text-xs font-semibold text-black transition hover:bg-black hover:text-white"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Catalog</span>
        </a>
      </div>

      {/* Operations Form Workspace */}
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left main pane */}
        <section className="border border-black/5 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6">
          <div className="border-b border-black/5 pb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Section 1</p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-black font-heading">Theme details</h2>
          </div>

          <div className="grid gap-5">
            <label className={labelClass}>
              Template ID Reference
              <select
                required
                value={form.templateId || ""}
                onChange={(e) => update("templateId", e.target.value)}
                className={inputClass}
              >
                <option value="">Select Template ID</option>
                <option value="1">Template 01 (Royal Red Theme)</option>
                <option value="3">Template 03 (Elegant Pink Pastel Theme)</option>
                <option value="4">Template 04 (Golden Arch Motif Theme)</option>
                <option value="5">Template 05 (Festive Floral / Diya Theme)</option>
                <option value="6">Template 06 (Mewar Palace Udaipur Theme)</option>
              </select>
            </label>

            <label className={labelClass}>
              Template Title
              <input
                required
                placeholder="Template title"
                value={form.title || ""}
                onChange={(e) => update("title", e.target.value)}
                className={inputClass}
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Category Tag
                <select
                  required
                  value={form.category || ""}
                  onChange={(e) => update("category", e.target.value)}
                  className={inputClass}
                >
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
                Pricing Display Label
                <input
                  placeholder="INR 3,999"
                  value={form.pricing || ""}
                  onChange={(e) => update("pricing", e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Selling Price (INR)
                <input
                  required
                  type="number"
                  min="0"
                  value={form.sellPrice || ""}
                  onChange={(e) => update("sellPrice", e.target.value)}
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                Vendor Payout (INR)
                <input
                  required
                  type="number"
                  min="0"
                  value={form.vendorPrice || ""}
                  onChange={(e) => update("vendorPrice", e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>

            <label className={labelClass}>
              Theme Description
              <textarea
                required
                value={form.description || ""}
                onChange={(e) => update("description", e.target.value)}
                className={`${inputClass} min-h-32 resize-none leading-6`}
              />
            </label>

            {/* Allowed Tabs Checkbox Grid Cards */}
            <div className="mt-4 border-t border-black/5 pt-6 space-y-4">
              <div>
                <span className={labelClass}>Allowed Customizer Workspace Tabs</span>
                <p className="mt-1 text-xs text-black/45">Tick the sections that this theme layout supports.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {AVAILABLE_TABS.map((tab) => {
                  const isChecked = (form.allowedTabs || []).includes(tab);
                  return (
                    <label
                      key={tab}
                      className={`group flex items-center justify-between gap-2.5 cursor-pointer border rounded-xl p-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${isChecked
                          ? "border-[#74313d] bg-[#74313d]/2 text-[#74313d]"
                          : "border-black/5 bg-[#fbf9f7] text-black/60 hover:bg-black/5 hover:text-black"
                        }`}
                    >
                      <span className="font-sans font-bold tracking-wide">{tab}</span>
                      <div className="relative flex items-center justify-center shrink-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const currentTabs = form.allowedTabs || [];
                            const updated = isChecked
                              ? currentTabs.filter((t) => t !== tab)
                              : [...currentTabs, tab];
                            update("allowedTabs", updated);
                          }}
                          className="peer absolute inset-0 size-5 opacity-0 cursor-pointer"
                        />
                        <div
                          className={`flex size-5 items-center justify-center rounded-lg border transition-colors ${isChecked ? "bg-[#74313d] border-[#74313d] text-white" : "border-black/20 bg-white"
                            }`}
                        >
                          {isChecked && <Check className="size-3" strokeWidth={3} />}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Right sidebar pane */}
        <aside className="space-y-6">
          {/* Media box */}
          <div className="border border-black/5 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]/60">Section 2</p>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-black font-heading">Featured Image</h2>

            {filePreview ? (
              <div className="relative mt-4 aspect-4/3 w-full overflow-hidden rounded-xl border border-black/5 bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image src={filePreview} alt="Mockup preview" width={400}
                  height={400} className="h-full w-full object-cover" />
              </div>
            ) : form.featuredImage ? (
              <div className="relative mt-4 aspect-4/3 w-full overflow-hidden rounded-xl border border-black/5 bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image src={form.featuredImage} alt={form.title || "Template"} width={400}
                  height={400} className="h-full w-full object-cover" />
              </div>
            ) : null}

            <label className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/15 bg-[#fbf9f7] p-5 text-center transition-all duration-200 hover:border-[#74313d] hover:bg-[#74313d]/2 hover:text-[#74313d]">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Upload className="size-6 text-black/35 mb-2.5 group-hover:text-[#74313d]" />
              <span className="text-xs font-semibold text-black">{file ? file.name : "Replace Mockup Image"}</span>
              <span className="mt-1.5 text-[10px] leading-relaxed text-black/45">Leave empty to keep current image.</span>
            </label>

            {message ? (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-black/10 bg-[#fcfaf8] p-3 text-xs font-semibold text-black">
                <AlertCircle className="size-4 shrink-0 text-[#74313d] mt-0.5" />
                <span>{message}</span>
              </div>
            ) : null}

            <button
              disabled={loading}
              className="mt-5 w-full bg-[#74313d] hover:bg-[#5a202a] text-white py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-[#74313d]/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Updating..." : "Update Theme"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  ) : null;
}
