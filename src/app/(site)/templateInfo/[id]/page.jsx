"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateCustomizer from "@/components/TemplateCustomizer";
import { getTemplates } from "@/lib/templateService";

export default function TemplatePage() {
  const params = useParams();
  const id = params?.id;
  const [state, setState] = useState({ loading: true, template: null, templates: [], error: "" });

  useEffect(() => {
    if (!id) return undefined;

    let ignore = false;

    setState((current) => ({ ...current, loading: true, error: "" }));

    getTemplates()
      .then((templates) => {
        if (ignore) return;

        const normalizedId = String(id).toLowerCase().trim();
        const template = templates.find((item) => {
          const candidates = [item.templateId, item.id, item._id, item.title, item.name, item.category];
          return candidates.some((value) => String(value).toLowerCase().trim() === normalizedId);
        }) || null;

        setState({ loading: false, template, templates, error: "" });
      })
      .catch((error) => {
        if (!ignore) {
          setState({
            loading: false,
            template: null,
            templates: [],
            error: error?.response?.data?.message || error.message || "Unable to load templates",
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (state.loading) {
    return (
      <main className="bg-white px-5 py-10 text-black sm:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-7xl text-sm text-black/60">Loading template...</div>
      </main>
    );
  }

  const { template, templates, error } = state;

  if (error) {
    return (
      <main className="bg-white px-5 py-10 text-black sm:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-7xl rounded border border-black/10 bg-white p-6 text-sm text-red-600">{error}</div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="bg-white px-5 py-10 text-black sm:px-8 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Template not found</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black sm:text-5xl">Choose a design from the gallery.</h1>
            <p className="mt-4 text-base leading-7 text-black/60">The requested template id <strong>{String(id)}</strong> did not match any available templates. Select one below to continue.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {templates.map((t) => (
              <Link key={t.templateId || t.id} href={`/templateInfo/${t.templateId || t.id}`} className="rounded-lg border p-4 text-sm hover:shadow">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-black/60">{t.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white px-5 py-10 text-black sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl lg:min-h-[calc(100dvh-7rem)]">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Build your wedding website</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black sm:text-5xl">Customize your selected template.</h1>
          <p className="mt-4 text-base leading-7 text-black/60">Fill in the essentials and review the template details before you save your wedding website.</p>
        </div>

        <TemplateCustomizer template={template} />
      </div>
    </main>
  );
}
