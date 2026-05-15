"use client";

import { useState } from "react";
import TemplateDetail from "./TemplateDetail";
import TemplateForm, { initialForm } from "./TemplateForm";

export default function TemplateCustomizer({ template }) {
  const [previewData, setPreviewData] = useState(initialForm);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.15fr)] lg:items-start">
      <TemplateForm template={template} onPreviewChange={setPreviewData} />
      <TemplateDetail template={template} formData={previewData} />
    </div>
  );
}
