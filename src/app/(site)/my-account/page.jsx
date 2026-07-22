"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import Profile from "@/components/my-account/Profile";
import Invitation from "@/components/my-account/Invitation";
import Invoice from "@/components/my-account/Invoice";
import { useAuth } from "@/context/AuthContext";
import { User, Heart, Receipt, LogOut } from "lucide-react";

const SECTIONS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "invitation", label: "Invitation", icon: Heart },
  { key: "invoice", label: "Invoice", icon: Receipt },
];

export default function MyAccountPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const router = useRouter();
  const { user, isUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isUser) {
      router.replace("/signin");
    }
  }, [isUser, loading, router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Redirect continues even when server logout fails.
    }
    window.dispatchEvent(new Event("authChange"));
    router.push("/signin");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  if (loading) {
    return (
      <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm font-medium text-black/60">Loading your account...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[75vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="flex h-fit flex-col rounded-3xl border border-black/10 bg-white/80 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.03)] backdrop-blur-md">
          {/* User Profile Card */}
          <div className="flex flex-col items-center border-b border-black/5 pb-6 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#e7c77c] via-[#f7e4be] to-[#b7882f] text-2xl font-extrabold text-black/85 shadow-md">
              {initials}
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <h2 className="mt-4 text-lg font-bold tracking-tight text-black">{user?.name || "User Account"}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#b7882f]">
              {user?.role || "Customer"}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex-1 space-y-1.5">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">Navigation</p>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-black text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] scale-[1.01]"
                      : "border border-transparent text-black/65 hover:bg-black/5 hover:text-black"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? "text-[#f3e5ab]" : "text-black/45"}`} />
                  {section.label}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-6 border-t border-black/5 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 hover:text-red-800"
            >
              <LogOut className="h-4.5 w-4.5 text-red-600" />
              Log out
            </button>
          </div>
        </aside>

        {/* Dynamic Section Viewer */}
        <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.04)] sm:p-8 min-h-[500px] transition-all duration-300">
          {activeSection === "profile" ? <Profile /> : null}
          {activeSection === "invitation" ? <Invitation /> : null}
          {activeSection === "invoice" ? <Invoice /> : null}
        </section>
      </section>
    </main>
  );
}
