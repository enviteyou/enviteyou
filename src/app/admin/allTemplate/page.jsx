"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { Trash2, Search, Plus, Edit3 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";


function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "Not set";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function AllTemplate() {
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
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
        const res = await api.get("/templates");
        setList(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this template? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await api.delete(`/templates/${id}`);
      setList((current) => current.filter((template) => template._id !== id));
      toast.success("Template deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete template.");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return list;

    return list.filter((template) =>
      [template.title, template.category, template.description].some((value) =>
        String(value || "").toLowerCase().includes(term),
      ),
    );
  }, [list, query]);

  return authenticated ? (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Catalog</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black font-heading">Template Catalog</h1>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-black/55">
            Review design previews, configure catalog category tags, audit sell-pricing rules, and operate catalog templates.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-black/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 py-3 text-xs text-black outline-none transition placeholder:text-black/35 focus:border-[#74313d] focus:ring-4 focus:ring-[#74313d]/5 sm:w-64"
            />
          </div>
          <a
            href="/admin/addTemplate"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#74313d] hover:bg-[#5a202a] px-5 py-3 text-xs font-semibold text-white shadow-md shadow-[#74313d]/10 transition hover:-translate-y-0.5"
          >
            <Plus className="size-4" />
            <span>Add Template</span>
          </a>
        </div>
      </div>

      {/* Catalog Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#74313d]">
            Templates ({filtered.length})
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm font-semibold text-black/45">
            Loading templates...
          </div>
        ) : filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <article
                key={t._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image Previews & category tag */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-black/2 border-b border-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={t.featuredImage}
                    alt={t.title}
                    width={200}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />

                  <span className="absolute top-4 left-4 rounded-lg bg-white/90 backdrop-blur-md border border-black/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-black shadow-sm">
                    {t.category}
                  </span>
                  <span className="absolute top-4 right-4 rounded-lg bg-[#74313d] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                    ID: {t.templateId}
                  </span>
                </div>

                {/* Card Content details */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight text-black font-heading group-hover:text-[#74313d] transition-colors">
                      {t.title}
                    </h2>
                    <p className="line-clamp-2 text-xs leading-relaxed text-black/50">{t.description}</p>
                  </div>

                  {/* Pricing and Operations details */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between border-t border-black/5 pt-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-black/35">Selling Price</p>
                        <p className="mt-0.5 text-sm font-bold text-[#74313d]">{formatCurrency(t.sellPrice)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-black/35">Vendor Payout</p>
                        <p className="mt-0.5 text-xs font-semibold text-black/60">{formatCurrency(t.vendorPrice)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-black/5 pt-3">
                      <a
                        href={`/admin/updateTemplate/${t._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#74313d]/15 text-[#74313d] hover:bg-[#74313d] hover:text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition duration-200 text-center"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Edit</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(t._id)}
                        disabled={deletingId === t._id}
                        className="flex h-9.5 w-9.5 items-center justify-center rounded-xl border border-red-200 bg-red-50/50 text-red-600 transition hover:bg-red-600 hover:text-white hover:border-red-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        aria-label={`Delete ${t.title}`}
                        title="Delete template"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-black font-heading">No templates found</p>
            <p className="mt-2 text-xs text-black/50">Try modifying your search or start adding your first theme catalog page.</p>
            <a
              href="/admin/addTemplate"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              <span>Add First Template</span>
            </a>
          </div>
        )}
      </section>
    </div>
  ) : null;
}
