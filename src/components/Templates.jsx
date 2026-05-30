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
  return String(template?.price || template?.pricing || template?.sellPrice || "INR 3999").trim();
}

function getCategoryLabel(template) {
  return String(template?.category || template?.tag || "Wedding").trim();
}

function TemplatePhone({ src, alt }) {
  return (
    <div className="relative h-full w-24 overflow-hidden rounded-[1.5rem] border-4 border-black bg-transparent shadow-[-18px_26px_34px_rgba(0,0,0,0.28),-8px_12px_18px_rgba(0,0,0,0.18)] sm:w-28">
      <div className="absolute left-1/2 top-1.5 z-10 h-2.5 w-9 -translate-x-1/2 rounded-full bg-black/92" />
      <div className="absolute inset-[0.2rem] overflow-hidden rounded-[1.1rem] bg-black">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-black/5 via-black/0 to-black/10 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/30">
            No preview
          </div>
        )}
      </div>
    </div>
  );
}

function TemplatePanelImage({ src, alt }) {
  return (
    <div className="h-full w-24 overflow-hidden rounded border border-black bg-transparent shadow-[0_16px_42px_rgba(0,0,0,0.14)] sm:w-28">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-black/5 via-black/0 to-black/10 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/30">
          No preview
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template }) {
  const preview = template.preview || template.featuredImage;
  const secondaryPreview = template.secondaryImage || template.secondImage || preview;
  const priceLabel = getPriceLabel(template);
  const categoryLabel = getCategoryLabel(template);

  return (
    <Link href={`/templateInfo/${template.templateId || template.id}`} className="group block h-full w-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#f2ece5] shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:-translate-y-1.5">
        <div className="relative px-3.5 pb-3.5 pt-14 sm:px-4 sm:pb-4 sm:pt-14">
          <div className="absolute left-3.5 top-3.5 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-700/15 bg-emerald-600 px-3 py-1.5 text-[0.74rem] font-semibold tracking-wide text-white shadow-[0_8px_18px_rgba(16,185,129,0.18)] sm:left-4 sm:top-4">
            <span className="text-[0.9rem] leading-none">✦</span>
            <span>New</span>
          </div>

          <div className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full border border-black/10 bg-[#6b2d34] text-white shadow-[0_8px_18px_rgba(107,45,52,0.18)] sm:right-4 sm:top-4">
            <Eye className="size-4" />
          </div>
        </div>

        <div className="flex h-48 flex-row items-center justify-center gap-3 px-3.5 pb-4 sm:h-56 sm:gap-4 sm:px-5 lg:gap-5">
          <TemplatePhone src={preview} alt={template.name} />
          <TemplatePanelImage src={secondaryPreview} alt={template.name} />
        </div>

        <div className="mt-auto border-t border-black/8 bg-[#fbf6f0] px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h4 className="text-[1.35rem] font-medium leading-tight tracking-[-0.04em] text-[#5f4a46] sm:text-[1.7rem]">
                { "Bloom" || template.name}
              </h4>
              <p className="max-w-136 text-[0.92rem] leading-5 text-black/55 sm:text-[1rem] sm:leading-6">
                { "An invitation inspired by a dreamlike florla.white roses" || template.description }
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 lg:items-end ">
              <div className="inline-flex rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[0.82rem] font-medium text-black/65 shadow-[0_8px_18px_rgba(0,0,0,0.04)]">
                {priceLabel}
              </div>
              <div className=" rounded-2xl border border-black/10 bg-transparent px-4 py-1 text-[0.8rem] font-normal text-black/40">
                {categoryLabel}
              </div>
            </div>
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
          <div className="text-sm text-black/40">Responsive layout with stacked mobile cards</div>
        </div>

        {filteredTemplates.length ? (
          <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.templateId || template.id} template={template} />
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
