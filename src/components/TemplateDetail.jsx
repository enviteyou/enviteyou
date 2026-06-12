"use client";

import dynamic from "next/dynamic";

const TemplateSkeleton = () => (
  <div
    className="relative w-full min-h-screen bg-[#faf7f3] flex flex-col items-center justify-center p-6 animate-pulse"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="size-24 rounded-full border border-[#7d2432]/20 bg-[#7d2432]/5 flex items-center justify-center mb-6">
      <div className="size-16 rounded-full border border-dashed border-[#7d2432]/30 animate-spin-slow" style={{ animationDuration: "8s" }} />
    </div>
    <div className="h-4 w-48 bg-[#7d2432]/10 rounded mb-4" />
    <div className="h-8 w-64 bg-[#7d2432]/15 rounded mb-4" />
    <div className="h-4 w-36 bg-[#7d2432]/10 rounded" />
    <div className="mt-4">
      Lets go...
    </div>
    <span className="sr-only">Loading wedding invitation template...</span>
  </div>
);

const Template01 = dynamic(() => import("./templates/Template01"), { ssr: false, loading: TemplateSkeleton });
const Template04 = dynamic(() => import("./templates/Template04"), { ssr: false, loading: TemplateSkeleton });
const Template05 = dynamic(() => import("./templates/Template05"), { ssr: false, loading: TemplateSkeleton });
const Template03 = dynamic(() => import("./templates/Template03"), { ssr: false, loading: TemplateSkeleton });

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

export default function TemplateDetail({ template, formData, fullscreen = false, embedded = false }) {

  const normalizedTemplateId = String(
    template?.templateId || template?.id || template?.slug || template?.previewComponent || template?.name || "default"
  )
    .toLowerCase()
    .trim();

  const SelectedTemplate = templateComponentMap[normalizedTemplateId] || templateComponentMap.default;

  if (fullscreen) {
    return (
      <article className="w-full bg-[#faf7f3]" aria-label="Wedding Invitation Website">
        <div className="relative w-full bg-black">
          <SelectedTemplate formData={formData} template={template} embedded={embedded} fullscreen />
        </div>
      </article>
    );
  }

  return (
    <article
      className=" overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
      aria-label="Wedding Invitation Preview Card"
    >
      <div className="bg-[#faf7f3] px-3 py-3 sm:px-5 sm:py-5">
        <div className="mx-auto w-full max-w-[390px] overflow-visible rounded-[24px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.14)]">
          <div className="relative bg-black" role="region" aria-label="Phone Preview Frame">
            <SelectedTemplate formData={formData} template={template} embedded={embedded} />
          </div>
        </div>
      </div>
    </article>
  );
}

