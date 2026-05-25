"use client";

import { useState } from "react";
import TemplateDetail from "./TemplateDetail";
import TemplateForm, { initialForm } from "./TemplateForm";

export default function TemplateCustomizer({ template }) {
  const [previewData, setPreviewData] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("Essentials");

  return (
    <div className="grid gap-6 lg:min-h-[calc(100dvh-15rem)] lg:grid-cols-[minmax(360px,0.88fr)_minmax(0,1.12fr)] lg:items-start xl:gap-8">
      <div className="min-h-0 lg:overflow-y-auto lg:pr-2">
        <TemplateForm
          template={template}
          onPreviewChange={setPreviewData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <TemplateDetail template={template} formData={previewData} />
      </div>
    </div>
  );
}
