"use client";

import dynamic from "next/dynamic";

const Template01 = dynamic(() => import("./templates/Template01"), { ssr: false });
const Template04 = dynamic(() => import("./templates/Template04"), { ssr: false });
const Template05 = dynamic(() => import("./templates/Template05"), { ssr: false });
const Template03 = dynamic(() => import("./templates/Template03"), { ssr: false });
const templateComponentMap = {
  "1": Template01,
  "01": Template01,
  "2": Template01,
  "3": Template03,
  "03": Template03,
  template03: Template03,
  template3: Template03,
  "4": Template04,
  "04": Template04,
  template04: Template04,
  template4: Template04,
  template01: Template01,
  "5": Template05,
  "05": Template05,
  template05: Template05,
  default: Template01,
};

export default function TemplateDetail({ template, formData, fullscreen = false }) {
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

  if (fullscreen) {
    return (
      <div className="w-full bg-[#faf7f3]">
        <section className="relative w-full bg-black">
          <SelectedTemplate formData={formData} template={template} embedded fullscreen />
        </section>
      </div>
    );
  }

  return (
    <article className="min-h-[calc(100dvh-15rem)] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
      <div className="bg-[#faf7f3] px-3 py-3 sm:px-5 sm:py-5">
        <div className="mx-auto w-full max-w-[390px] overflow-visible rounded-[24px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.14)]">
          <section className="relative bg-black">
            <SelectedTemplate formData={formData} template={template} embedded />
          </section>
        </div>
      </div>
    </article>
  );
}
