"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { toast } from "sonner";
import { ArrowLeft, Upload, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";

const emptyForm = {
  title: "",
  shortDescription: "",
  description: "",
  meta_title: "",
  meta_description: "",
};

const inputClass =
  "mt-2 w-full border border-black/10 bg-[#fbf9f7] rounded-xl px-4 py-3.5 text-sm text-black outline-none transition-all placeholder:text-black/30 focus:border-[#74313d] focus:bg-white focus:ring-4 focus:ring-[#74313d]/5";
const labelClass = "text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]/60 block";

export default function AdminAddBlog() {
  const [form, setForm] = useState(emptyForm);
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      toast.error("Featured image is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        fd.append(k, form[k] ?? "");
      });
      fd.append("featuredImage", file);

      await api.post("/blogs/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog created successfully.");
      router.push("/admin/blogs");
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "Create failed.";
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  if (!authenticated) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Blog Studio</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black font-heading">Add New Blog</h1>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-black/55">
            Compose dynamic content posts, write SEO keywords, and upload featured editorial cover graphics.
          </p>
        </div>
        <a
          href="/admin/blogs"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3.5 text-xs font-semibold text-black transition hover:bg-black hover:text-white"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Blogs</span>
        </a>
      </div>

      {/* Form Workspace */}
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left main form details */}
        <section className="border border-black/5 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6">
          <div className="border-b border-black/5 pb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Section 1</p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-black font-heading">Post Content</h2>
          </div>

          <div className="grid gap-5">
            <label className={labelClass}>
              Blog Title
              <input
                required
                placeholder="Trends in Modern Digital Wedding Invitations"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Short Description / Summary
              <textarea
                required
                placeholder="A brief 2-3 sentence overview shown in blog grids and card descriptions..."
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                className={`${inputClass} min-h-20 resize-none leading-relaxed`}
              />
            </label>

            <label className={labelClass}>
              Full Blog Description / Article Body
              <textarea
                required
                placeholder="Compose the full detailed article body here..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className={`${inputClass} min-h-64 resize-y leading-relaxed`}
              />
            </label>
          </div>

          {/* Section 2: SEO configuration */}
          <div className="border-t border-black/5 pt-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-black/60 flex items-center gap-1.5 font-sans">
                <Sparkles className="size-4 text-[#74313d]" />
                <span>SEO Configurations (Optional)</span>
              </h3>
              <p className="text-[11px] text-black/40 mt-1">Configure title tags and summaries to boost organic search index visibility.</p>
            </div>

            <div className="grid gap-5">
              <label className={labelClass}>
                Meta Title Tag
                <input
                  placeholder="Digital Wedding Cards Design Trends - EnviteYou"
                  value={form.meta_title}
                  onChange={(e) => update("meta_title", e.target.value)}
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                Meta Description Tag
                <textarea
                  placeholder="Explore the top digital invitation style guides. Learn about paste theme layouts, RSVP integrations, and tracking metrics from EnviteYou."
                  value={form.meta_description}
                  onChange={(e) => update("meta_description", e.target.value)}
                  className={`${inputClass} min-h-20 resize-none leading-relaxed`}
                />
              </label>
            </div>
          </div>
        </section>

        {/* Right sidebar form details */}
        <aside className="space-y-6">
          <div className="border border-black/5 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]/60">Section 2</p>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-black font-heading">Featured Image</h2>

            {filePreview && (
              <div className="relative mt-4 aspect-16/10 w-full overflow-hidden rounded-xl border border-black/5 bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image src={filePreview} alt="Blog preview" width={400}
                  height={400} className="h-full w-full object-cover" />
              </div>
            )}

            <label className="mt-4 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/15 bg-[#fbf9f7] p-5 text-center transition-all duration-200 hover:border-[#74313d] hover:bg-[#74313d]/2 hover:text-[#74313d]">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Upload className="size-6 text-black/35 mb-2.5" />
              <span className="text-xs font-semibold text-black max-w-full truncate px-2">
                {file ? file.name : "Choose Cover Image"}
              </span>
              <span className="mt-1.5 text-[10px] leading-relaxed text-black/45">PNG, JPG, or WEBP layout previews.</span>
            </label>

            {message && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-black/10 bg-[#fcfaf8] p-3 text-xs font-semibold text-black">
                <AlertCircle className="size-4 shrink-0 text-[#74313d] mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full bg-[#74313d] hover:bg-[#5e232c] text-white py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-[#74313d]/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating Post..." : "Publish Blog"}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
