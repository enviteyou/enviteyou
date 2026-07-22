"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios";
import { User as UserIcon, Mail, Phone, Shield } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response?.data?.success && response?.data?.user) {
          setUser(response.data.user);
          setError("");
        } else {
          setError("Unable to load profile details.");
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Unable to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <p className="text-sm font-medium text-black/60">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Decorative Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#faf6ec] to-[#fff] p-6 border border-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(217,180,127,0.15),transparent_60%)] blur-lg" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b7882f]">Welcome back</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-black sm:text-3xl">
          {user?.name || "Valued Customer"}
        </h2>
        <p className="mt-2 text-sm text-black/55">
          Manage your personal details, email preferences, and contact information below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField icon={UserIcon} label="Full Name" value={user?.name} />
        <ProfileField icon={Mail} label="Email Address" value={user?.email} />
        <ProfileField icon={Phone} label="Phone Number" value={user?.number} />
        <ProfileField icon={Shield} label="Account Role" value={user?.role} badgeText={user?.role ? "Verified" : null} />
      </div>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, badgeText }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-black/20 hover:shadow-md flex items-start gap-4">
      {Icon ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faf6ec] text-[#b7882f]">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/40">{label}</p>
          {badgeText ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
              {badgeText}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 break-all text-base font-semibold text-black/85">{value || "—"}</p>
      </div>
    </div>
  );
}
