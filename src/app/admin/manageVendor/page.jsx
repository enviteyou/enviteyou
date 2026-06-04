"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { Mail, Phone, ExternalLink, ShieldCheck, ShieldAlert, Check } from "lucide-react";

function formatVendorLabel(vendor) {
  return vendor.name || vendor.email || "Vendor";
}

function getInitials(name) {
  if (!name) return "V";
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminVendorPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me-admin");
        if (res.status !== 200) return router.push("/admin/signin");
        const data = res.data;
        if (!data?.user || data.user.role !== "admin") {
          alert("Unauthorized access");
          return router.push("/admin/signin");
        }
        setAuthenticated(true);
      } catch (err) {
        router.push("/admin/signin");
      }
    })();
  }, [router]);

  useEffect(() => {
    async function loadVendors() {
      try {
        const res = await api.get("/users/vendors");
        setVendors(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (authenticated) {
      loadVendors();
    }
  }, [authenticated]);

  async function toggleVendor(vendor) {
    setSavingId(vendor._id);
    try {
      const nextValue = !vendor.isVendorAuthenticate;
      const res = await api.patch(`/users/vendors/${vendor._id}`, {
        isVendorAuthenticate: nextValue,
      });

      setVendors((current) =>
        current.map((item) =>
          item._id === vendor._id ? { ...item, isVendorAuthenticate: res.data?.vendor?.isVendorAuthenticate ?? nextValue } : item,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId("");
    }
  }

  return authenticated ? (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header Info */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Vendor Registry</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black font-heading">Vendor Registrations</h1>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-black/55">
            Audit signup information, inspect vendor portfolios, and toggle access credentials for vendor dashboard operations.
          </p>
        </div>
      </div>

      {/* Vendors Board */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#74313d]">
            Registry List ({loading ? "..." : `${vendors.length} items`})
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm font-semibold text-black/45">
            Loading vendors directory...
          </div>
        ) : vendors.length ? (
          <div className="grid gap-4">
            {vendors.map((vendor) => {
              const active = Boolean(vendor.isVendorAuthenticate);
              const label = formatVendorLabel(vendor);
              const initials = getInitials(vendor.name);

              return (
                <article
                  key={vendor._id}
                  className="group flex flex-col gap-6 border border-black/5 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 hover:shadow-md hover:border-black/10 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* User Avatar Initials */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#74313d]/5 text-[15px] font-bold tracking-wide text-[#74313d] font-heading border border-[#74313d]/10">
                      {initials}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-lg font-semibold tracking-tight text-black font-heading">{label}</h2>
                        <span
                          className={`rounded-lg border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            active
                              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                              : "border-amber-100 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {active ? "Approved" : "Pending Approval"}
                        </span>
                      </div>

                      {/* Contact metadata info with icons */}
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-black/50">
                        <div className="flex items-center gap-1.5">
                          <Mail className="size-3.5 text-black/30" />
                          <span>{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="size-3.5 text-black/30" />
                          <span>{vendor.number || "Phone not configured"}</span>
                        </div>
                        {vendor.googleMyBusinessLink ? (
                          <a
                            href={vendor.googleMyBusinessLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#74313d] hover:underline font-semibold"
                          >
                            <ExternalLink className="size-3.5" />
                            <span>Google My Business</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-1.5 text-black/35">
                            <ExternalLink className="size-3.5" />
                            <span>No GMB link</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Approve / Revoke Action Buttons */}
                  <button
                    type="button"
                    onClick={() => toggleVendor(vendor)}
                    disabled={savingId === vendor._id}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                      active
                        ? "border-black/10 bg-black text-white hover:bg-black/90 shadow-sm"
                        : "border-[#74313d]/15 bg-white text-[#74313d] hover:bg-[#74313d] hover:text-white"
                    }`}
                  >
                    {active ? (
                      <ShieldCheck className="size-4" />
                    ) : (
                      <ShieldAlert className="size-4" />
                    )}
                    <span>
                      {savingId === vendor._id ? "Saving..." : active ? "Revoke Approval" : "Approve Account"}
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white p-12 text-center">
            <p className="text-lg font-semibold text-black font-heading">No vendors registered</p>
            <p className="mt-2 text-xs text-black/50">New vendor signup details will appear in this console directory.</p>
          </div>
        )}
      </section>
    </div>
  ) : null;
}