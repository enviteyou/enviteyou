"use client";

import { useState } from "react";
import TemplateDetail from "./TemplateDetail";
import TemplateForm, { initialForm } from "./TemplateForm";

export default function TemplateCustomizer({ template }) {
  const [previewData, setPreviewData] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("Essentials");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.15fr)] lg:items-start">
      <div className="lg:sticky lg:top-6">
        <TemplateForm
          template={template}
          onPreviewChange={setPreviewData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <TemplateDetail template={template} formData={previewData} activeTab={activeTab} />
    </div>
  );
}
