"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVendorSession } from "@/lib/vendorAuth";

export default function VendorIndexPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await getVendorSession();
        if (!mounted) return;
        if (session?.user && session.user.role === "vendor") {
          router.replace("/vendor/dashboard");
        } else {
          router.replace("/vendor/signin");
        }
      } catch {
        if (mounted) {
          router.replace("/vendor/signin");
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] text-black">
      <div className="rounded-[1.5rem] border border-black/10 bg-white px-6 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
        <p className="text-sm text-black/65">Loading...</p>
      </div>
    </div>
  );
}
