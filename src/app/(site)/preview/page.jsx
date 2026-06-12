"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { getTemplateById } from "@/lib/templateService";
import TemplateDetail from "@/components/TemplateDetail";

function PreviewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || searchParams.get("templateId");
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    getTemplateById(id)
      .then((data) => {
        setTemplate(data);
      })
      .catch((err) => {
        console.error("Failed to load template info:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f3] text-black/60">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/15 border-t-black" />
          <p className="text-xs font-semibold uppercase tracking-widest text-black/45">Loading template preview...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f3] text-black">
        <div className="max-w-md text-center px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Template not found</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Preview Unavailable</h2>
          <p className="mt-3 text-sm text-black/60">
            We couldn't load the template you requested. Please verify the URL or select another template.
          </p>
          <Link
            href="/template"
            className="mt-6 inline-block rounded bg-black px-6 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/90 transition shadow"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#faf7f3] relative">
      {/* Dynamic CSS Injection to hide website header & footer */}
      <style dangerouslySetInnerHTML={{ __html: `
        header, footer { display: none !important; }
      `}} />

      {/* Immersive Top Bar Controls */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-black/10 bg-white/85 px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="rounded bg-[#74313d]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#74313d]">
            Preview
          </span>
          <h2 className="text-sm font-semibold text-black">{template.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/templateInfo/${template.templateId || template.id}`}
            className="rounded bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/90 transition shadow-sm"
          >
            Customize
          </Link>
          <Link
            href="/template"
            className="rounded border border-black/15 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-black/5 transition"
          >
            Exit Preview
          </Link>
        </div>
      </div>

      {/* Main Template Detail Renderer */}
      <div className="w-full">
        <TemplateDetail template={template} formData={{}} fullscreen={true} />
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f3] text-black/60">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/15 border-t-black" />
          <p className="text-xs font-semibold uppercase tracking-widest text-black/45">Preparing preview...</p>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
