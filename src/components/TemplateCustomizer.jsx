"use client";

import { useEffect, useState } from "react";
import TemplateDetail from "./TemplateDetail";
import TemplateForm, { initialForm } from "./TemplateForm";

export default function TemplateCustomizer({ template }) {
  const [previewData, setPreviewData] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("Essentials");
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  useEffect(() => {
    if (!isMobilePreviewOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobilePreviewOpen]);

  return (
    <div className="grid gap-6 lg:min-h-[calc(100dvh-15rem)] lg:grid-cols-[minmax(360px,0.88fr)_minmax(0,1.12fr)] lg:items-start xl:gap-8">
      <div className="min-h-0 lg:overflow-y-auto lg:pr-2 pb-20 lg:pb-0">
        <TemplateForm
          template={template}
          onPreviewChange={setPreviewData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
        <TemplateDetail template={template} formData={previewData} />
      </div>

      <button
        type="button"
        onClick={() => setIsMobilePreviewOpen(true)}
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] lg:hidden"
      >
        Preview
      </button>

      {isMobilePreviewOpen ? (
        <div className="fixed inset-0 z-60 bg-black/70 lg:hidden" role="dialog" aria-modal="true" aria-label="Template preview">
          <div className="flex h-full w-full flex-col bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white/95 px-4 py-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/40">Template preview</p>
                <p className="text-sm font-semibold text-black">{template?.name || "Wedding Website"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobilePreviewOpen(false)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black"
              >
                Close preview
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-[#faf7f3] pt-4">
              <TemplateDetail template={template} formData={previewData} fullscreen />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
