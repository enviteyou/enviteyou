"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import Profile from "@/components/my-account/Profile";
import Invitation from "@/components/my-account/Invitation";
import Invoice from "@/components/my-account/Invoice";

const SECTIONS = [
  { key: "profile", label: "Profile" },
  { key: "invitation", label: "Invitation" },
  { key: "invoice", label: "Invoice" },
];

export default function MyAccountPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await api.get("/auth/me");
        if (!(response?.data?.success && response?.data?.user)) {
          router.push("/signin");
          return;
        }
      } catch {
        router.push("/signin");
        return;
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Redirect continues even when server logout fails.
    }
    window.dispatchEvent(new Event("authChange"));
    router.push("/signin");
  };

  if (checkingAuth) {
    return (
      <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm font-medium text-black/60">Loading your account...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">My Account</p>
            <h1 className="text-xl font-semibold tracking-tight text-black">Dashboard</h1>
          </div>

          <div className="mt-5 space-y-2">
            {SECTIONS.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeSection === section.key
                    ? "bg-black text-white"
                    : "border border-black/10 bg-white text-black hover:bg-black/5"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-100 mt-2"
          >
            Log out
          </button>
        </aside>

        <section className="rounded-2xl border border-black/10 bg-[#fbfbfa] p-5 sm:p-6">
          {activeSection === "profile" ? <Profile /> : null}
          {activeSection === "invitation" ? <Invitation /> : null}
          {activeSection === "invoice" ? <Invoice /> : null}
        </section>
      </section>
    </main>
  );
}
