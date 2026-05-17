"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";

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
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/auth/me');
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
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Catalog</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">All Templates</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Review template pricing, category, and artwork before editing the catalog.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
            className="w-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5 sm:w-72"
          />
          <a href="/admin/addTemplate" className="bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5">
            Add Template
          </a>
        </div>
      </div>

      <section className="border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Templates</p>
            <p className="mt-1 text-sm font-medium text-black">{filtered.length} visible</p>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm font-medium text-black/60">Loading templates...</div>
        ) : filtered.length ? (
          <div className="divide-y divide-black/10">
            {filtered.map((t) => (
              <article key={t._id} className="grid gap-4 p-5 transition hover:bg-black/3 lg:grid-cols-[120px_1fr_auto] lg:items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.featuredImage}
                  alt={t.title}
                  className="aspect-[4/3] w-full border border-black/10 object-cover lg:w-[120px]"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight text-black">{t.title}</h2>
                    <span className="border border-black/10 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-black/50">
                      {t.category}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-black/60">{t.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-black">
                    <span className="border border-black/10 px-3 py-2">Regular {formatCurrency(t.regularPrice)}</span>
                    <span className="border border-black bg-black px-3 py-2 text-white">Sell {formatCurrency(t.sellPrice)}</span>
                    <span className="border border-black/10 px-3 py-2">Vendor {formatCurrency(t.vendorPrice)}</span>
                  </div>
                </div>
                <a
                  href={`/admin/updateTemplate/${t._id}`}
                  className="border border-black px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                >
                  Edit
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-lg font-semibold text-black">No templates found</p>
            <p className="mt-2 text-sm text-black/50">Try a different search or add your first template.</p>
          </div>
        )}
      </section>
    </div>
  ) : null
}
