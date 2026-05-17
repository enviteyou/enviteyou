"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateDetail from "@/components/TemplateDetail";
import api from "@/api/axios";
import { getTemplateById } from "@/lib/templateService";

export default function InviteBySlugPage() {
  const params = useParams();
  const slug = params?.slug;
  const [result, setResult] = useState({
    slug: null,
    invitation: null,
    error: "",
  });
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let ignore = false;

    api
      .get(`/invitations/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!ignore) {
          setResult({
            slug,
            invitation: res?.data?.data || null,
            error: "",
          });
        }
      })
      .catch((err) => {
        const message = err?.response?.data?.message || err.message || "Unable to load invitation";
        if (!ignore) {
          setResult({
            slug,
            invitation: null,
            error: message,
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!result.invitation) return undefined;

    let ignore = false;
    const templateId = result.invitation?.templateId || result.invitation?.template || "";

    getTemplateById(templateId)
      .then((selectedTemplate) => {
        if (!ignore) {
          setTemplate(selectedTemplate);
        }
      })
      .catch(() => {
        if (!ignore) {
          setTemplate(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, [result.invitation]);

  // Determine template id: prefer an explicit template field if present, else default
  const loading = result.slug !== slug;
  const invitation = result.invitation;
  const error = result.error;

  return (
    <main className="px-4 py-10">
      {loading ? (
        <div className="mx-auto max-w-3xl text-center text-black/60">Loading invitation...</div>
      ) : error ? (
        <div className="mx-auto max-w-3xl rounded border border-black/10 bg-white p-6 text-center text-red-600">{error}</div>
      ) : invitation ? (
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-2">
          <TemplateDetail template={template} formData={invitation} />
        </div>
      ) : (
        <div className="mx-auto max-w-3xl text-center text-black/60">Invitation not found.</div>
      )}
    </main>
  );
}
