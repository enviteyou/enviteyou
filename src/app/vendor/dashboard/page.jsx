"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getVendorSession } from "@/lib/vendorAuth";

export default function VendorDashboardPage() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = await getVendorSession();
      if (!mounted) return;
      if (!session?.user) {
        toast.error(session?.message || "Not authenticated");
        router.replace("/vendor/signin");
        return;
      }
      setVendor(session.user);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, [router]);

  if (loading) {
    return (
      <div className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-6 shadow sm:p-8">
        <p className="text-sm text-black/65">Checking vendor authentication...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-6 shadow sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">EnviteYou Vendor</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">Vendor dashboard</h1>
      <p className="mt-1 text-sm text-black/65">Welcome back{vendor?.name ? `, ${vendor.name}` : ""}.</p>
    </div>
  );
}