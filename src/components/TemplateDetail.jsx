"use client";

import dynamic from "next/dynamic";

const Template01 = dynamic(() => import("./templates/Template01"), { ssr: false });
const templateComponentMap = {
  "1": Template01,
  "2": Template01,
  "3": Template01,
  template01: Template01,
  default: Template01,
};

export default function TemplateDetail({ template, formData }) {
  if (!template) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-black shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Template not found</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Choose a design from the gallery.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
          This invitation is not available right now. Please contact the host and ask them to resend the link.
        </p>
      </div>
    );
  }

  const normalizedTemplateId = String(
    template?.templateId || template?.id || template?.slug || template?.previewComponent || template?.name || "default"
  )
    .toLowerCase()
    .trim();

  const SelectedTemplate = templateComponentMap[normalizedTemplateId] || templateComponentMap.default;

  return (
    <article className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
      <div className="border-b border-black/10 bg-[linear-gradient(180deg,rgba(255,248,242,0.95),rgba(255,255,255,0.98))] px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-black/45">Live preview</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-black sm:text-xl">Scroll the invitation to view every section.</h2>
          </div>
          <div className="hidden rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/55 md:block">
            Best viewed in desktop layout
          </div>
        </div>
      </div>

      <div className="bg-[#faf7f3] px-3 py-3 sm:px-5 sm:py-5">
        <div className="mx-auto w-full max-w-97.5 overflow-visible rounded-[24px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.14)]">
          <section className="relative bg-black">
            <SelectedTemplate formData={formData} template={template} embedded />
          </section>
        </div>
      </div>
    </article>
  );
}
