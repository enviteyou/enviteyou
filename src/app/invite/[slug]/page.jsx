"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateDetail from "@/components/TemplateDetail";
import { getTemplateById } from "@/lib/templates";

export default function InviteBySlugPage() {
  const params = useParams();
  const slug = params?.slug;
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");

    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    fetch(`${backend}/invitations/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Failed to fetch invitation (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setInvitation(data?.data || null);
      })
      .catch((err) => {
        setError(err.message || "Unable to load invitation");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Determine template id: prefer an explicit template field if present, else default
  const templateId = invitation?.templateId || invitation?.template || "mountain";
  const template = getTemplateById(templateId);

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
