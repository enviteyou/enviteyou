"use client";

import Link from "next/link";

function normalizeCategory(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function TemplateCard({ template }) {
  return (
    <Link href={`/templateInfo/${template.templateId || template.id}`} className="shrink-0">
      <div className="block w-64 rounded-lg border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-1">
        <div className="h-40 w-full overflow-hidden rounded-t-lg bg-black">
          {template.preview ? (
            <img src={template.preview} alt={template.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white">No preview</div>
          )}
        </div>
        <div className="p-3">
          <div className="text-sm font-semibold text-black">{template.name}</div>
          <div className="text-xs text-black/60 line-clamp-2">{template.description}</div>
        </div>
      </div>
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
      <div className="mx-auto w-full max-w-6xl px-5 py-6 md:px-10">
        <h3 className="text-lg font-semibold text-black">Templates</h3>
        <p className="text-sm text-black/60">Click a template to view details and customize.</p>

        {filteredTemplates.length ? (
          <div className="mt-4 flex w-full gap-4 overflow-x-auto py-3">
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
