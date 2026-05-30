"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

function normalizeCategory(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getPriceLabel(template) {
  const raw = template?.price ?? template?.pricing ?? template?.sellPrice ?? "3999";
  const s = String(raw).trim();
  // If it already contains the rupee symbol, return as-is
  if (/₹/.test(s)) return s;
  // If it contains 'INR', replace with the rupee symbol
  if (/\bINR\b/i.test(s)) return s.replace(/\bINR\b/i, "₹");
  // Otherwise prefix with the rupee symbol
  return `₹ ${s}`;
}

function getCategoryLabel(template) {
  return String(template?.category || template?.tag || "Wedding").trim();
}

function TemplateCard({ template }) {
  const preview = template.featuredImage || template.preview;
  const priceLabel = getPriceLabel(template);
  const categoryLabel = getCategoryLabel(template);

  return (
    <Link href={`/templateInfo/${template.templateId || template.id}`} className="group block h-full w-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:-translate-y-1.5">
        <div className="relative w-full">
          {preview ? (
            <img src={preview} alt={template.name} className="block h-72 w-full object-cover sm:h-80" />
          ) : (
            <div className="flex w-full items-center justify-center bg-linear-to-br from-black/5 via-black/0 to-black/10 py-16 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-black/30">
              No preview
            </div>
          )}

          <div className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-[0_8px_18px_rgba(107,45,52,0.18)] sm:right-4 sm:top-4">
            <Eye className="size-4" />
          </div>
        </div>

        <div className="mt-auto border-t border-black/8 bg-white p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-2xl border border-black/10 bg-transparent px-3.5 py-1 text-[0.8rem] font-normal text-black/60">
              {categoryLabel}
            </div>
            <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[0.9rem] font-medium text-black/75 shadow-[0_8px_18px_rgba(0,0,0,0.04)]">
              {priceLabel}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[1.35rem] font-medium leading-tight tracking-[-0.04em] text-[#5f4a46] sm:text-[1.7rem]">
              {template.name || "Bloom"}
            </h4>
            <p
              className="max-w-136 text-[0.92rem] leading-5 text-black/55 sm:text-[1rem] sm:leading-6"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {template.description || "An invitation inspired by a dreamlike florla.white roses"}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[0.88rem] font-medium text-black/55">View theme</span>
            <span className="text-[0.88rem] font-medium text-black/55">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Templates({ templates = [], activeCategory = "All" }) {
  const filteredTemplates = templates.filter((template) => {
    if (activeCategory === "All") return true;

    return normalizeCategory(template.category) === normalizeCategory(activeCategory);
  });

  return (
    <div className="order-3 w-full border-t border-black/10 bg-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-10 lg:py-8">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black">Templates</h3>
            <p className="text-sm text-black/60">Click a template to view details and customize.</p>
          </div>
       
        </div>

        {filteredTemplates.length ? (
          <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template._id || template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded border border-black/10 bg-white px-4 py-3 text-sm text-black/50">
            No templates available for {activeCategory}.
          </div>
        )}
      </div>
    </div>
  );
}
