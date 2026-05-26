"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";

function buildInviteUrl(slug) {
  if (!slug) return "";
  if (typeof window === "undefined") return `/invite/${encodeURIComponent(slug)}`;
  return `${window.location.origin}/invite/${encodeURIComponent(slug)}`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Invitation() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        const response = await api.get("/invitations/getMyInvitations");
        if (response?.data?.success) {
          setInvitations(Array.isArray(response.data.data) ? response.data.data : []);
          setError("");
        } else {
          setError("Unable to load invitations.");
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Unable to load invitations.");
      } finally {
        setLoading(false);
      }
    };

    loadInvitations();
  }, []);

  const stats = useMemo(() => {
    const total = invitations.length;
    const latest = invitations[0];
    const latestLabel = latest ? `${latest.bride || "Bride"} & ${latest.groom || "Groom"}` : "No invites yet";
    const templateCount = new Set(invitations.map((item) => item.templateId || item.template)).size;

    return [
      { label: "Total invitations", value: String(total).padStart(2, "0") },
      { label: "Templates used", value: String(templateCount).padStart(2, "0") },
      { label: "Latest invite", value: latestLabel },
    ];
  }, [invitations]);

  async function handleCopy(link, id) {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      window.clearTimeout(handleCopy._timer);
      handleCopy._timer = window.setTimeout(() => setCopiedId(""), 1400);
    } catch {
      setCopiedId("");
    }
  }

  function openInvite(slug) {
    const url = buildInviteUrl(slug);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return (
      <div className="space-y-4 rounded-3xl border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.05)]">
        <p className="text-sm font-medium text-black/60">Loading your invitations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.05)]">
        <div className="relative px-5 py-6 sm:px-7 sm:py-7">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(217,180,127,0.18),transparent_68%)] blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Private wedding dashboard</p>
          <div className="mt-3 flex flex-col gap-2">
            <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Your Invitations
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-black/60 sm:text-base">
              View every invitation created from your account, open the live link, and copy it instantly for sharing.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-black/10 bg-[#fbfbfa] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">{stat.label}</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-black sm:text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {invitations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">No invitations yet</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-black">Create your first invite</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-black/60">
            Once you create invitations, they will appear here with their live links and basic details.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">All invitations</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-black">Live links and details</h3>
            </div>
            <p className="text-sm text-black/50">{invitations.length} invitation{invitations.length === 1 ? "" : "s"}</p>
          </div>

          <div className="grid gap-4">
            {invitations.map((invitation) => {
              const liveUrl = buildInviteUrl(invitation.slug);
              const title = `${invitation.bride || "Bride"} & ${invitation.groom || "Groom"}`;

              return (
                <article key={invitation._id} className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Invitation</p>
                        <h4 className="mt-1 text-2xl font-semibold tracking-tight text-black">{title}</h4>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs font-medium text-black/55">
                        {invitation.date ? <span className="rounded-full border border-black/10 bg-[#faf9f7] px-3 py-1">{formatDate(invitation.date)}</span> : null}
                        {invitation.venue ? <span className="rounded-full border border-black/10 bg-[#faf9f7] px-3 py-1">{invitation.venue}</span> : null}
                        {invitation.templateId ? <span className="rounded-full border border-black/10 bg-[#faf9f7] px-3 py-1">Template {invitation.templateId}</span> : null}
                      </div>

                      <div className="rounded-2xl border border-black/10 bg-[#fbfbfa] p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40">Share link</p>
                        <p className="mt-2 break-all text-sm font-medium text-black">{liveUrl}</p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                      <button
                        type="button"
                        onClick={() => openInvite(invitation.slug)}
                        className="rounded-xl border border-black px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                      >
                        Open Live Invite
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(liveUrl, invitation._id)}
                        className="rounded-xl border border-black/10 bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/85"
                      >
                        {copiedId === invitation._id ? "Copied" : "Copy Link"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
