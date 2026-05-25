"use client";

import { useState } from "react";
import TemplateDetail from "./TemplateDetail";
import TemplateForm, { initialForm } from "./TemplateForm";

export default function TemplateCustomizer({ template }) {
  const [previewData, setPreviewData] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("Essentials");

  return (
    <div className="grid gap-6 scroll-smooth lg:min-h-[calc(100dvh-15rem)] lg:grid-cols-[minmax(360px,0.88fr)_minmax(0,1.12fr)] lg:items-start xl:gap-8">
      <div className="min-h-0 pb-20 lg:overflow-y-auto lg:pr-2 lg:pb-0">
        <TemplateForm
          template={template}
          onPreviewChange={setPreviewData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div id="template-detail" className="scroll-mt-24 lg:sticky lg:top-6 lg:self-start">
        <TemplateDetail template={template} formData={previewData} />
      </div>

      <a
        href="#template-detail"
        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] lg:hidden"
      >
        Preview
      </a>
    </div>
  );
}
