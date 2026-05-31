"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getVendorSession } from "@/lib/vendorAuth";

export default function VendorIndexPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = await getVendorSession();
      if (!mounted) return;
      if (session?.user) {
        toast.success(session.message || "Authenticated");
        router.replace("/vendor/dashboard");
      } else {
        // show backend message (eg. Not authenticated)
        if (session?.message)
        router.replace("/vendor/signin");
      }
    })();
    return () => (mounted = false);
  }, [router]);

  return null;
}
