"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios";

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
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">My Profile</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">Account details</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField label="Full Name" value={user?.name} />
        <ProfileField label="Email" value={user?.email} />
        <ProfileField label="Phone Number" value={user?.number} />
        <ProfileField label="Role" value={user?.role} />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">{label}</p>
      <p className="mt-2 text-base font-medium text-black">{value || "-"}</p>
    </div>
  );
}
