"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";

function formatVendorLabel(vendor) {
  return vendor.name || vendor.email || "Vendor";
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
        const res = await api.get("/auth/me");
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
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Vendor approvals</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Vendors</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
          Approve vendor accounts before they can log in.
        </p>
      </div>

      <section className="border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
        <div className="border-b border-black/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Vendor list</p>
          <p className="mt-1 text-sm font-medium text-black">{loading ? "Loading..." : `${vendors.length} vendors`}</p>
        </div>

        {loading ? (
          <div className="p-6 text-sm font-medium text-black/60">Loading vendors...</div>
        ) : vendors.length ? (
          <div className="divide-y divide-black/10">
            {vendors.map((vendor) => {
              const active = Boolean(vendor.isVendorAuthenticate);
              return (
                <article key={vendor._id} className="flex flex-col gap-4 p-5 transition hover:bg-black/3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold tracking-tight text-black">{formatVendorLabel(vendor)}</h2>
                      <span className={`border px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                        {active ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-black/60">{vendor.email}</p>
                    <p className="mt-1 text-sm leading-6 text-black/60">Phone: {vendor.number || "Not set"}</p>
                    <p className="mt-1 text-sm leading-6 text-black/60">
                      <a href={vendor.googleMyBusinessLink || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        GMB: {vendor.googleMyBusinessLink ? "Google My Business" : "No Google My Business link"}
                      </a>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleVendor(vendor)}
                    disabled={savingId === vendor._id}
                    className={`inline-flex items-center gap-2 border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-black bg-black text-white" : "border-black/20 bg-white text-black hover:bg-black hover:text-white"}`}
                  >
                    <span className={`h-3 w-3 rounded-full ${active ? "bg-white" : "bg-black"}`} />
                    {savingId === vendor._id ? "Saving..." : active ? "Approved" : "Approve"}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-lg font-semibold text-black">No vendors found</p>
            <p className="mt-2 text-sm text-black/50">New vendor signups will appear here.</p>
          </div>
        )}
      </section>
    </div>
  ) : null;
}