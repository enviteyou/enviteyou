"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, CalendarPlus, CreditCard, LifeBuoy, LayoutGrid, Menu, Monitor, Plus, Users, Home, X, LogOut, Camera } from "lucide-react";
import { getVendorSession } from "@/lib/vendorAuth";
import api from "@/api/axios";
import { useLenis } from "lenis/react";
import Image from "next/image";
const NAV_ITEMS = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: Home },
  { label: "Create New Invitation", href: "/vendor/dashboard/create-new-template", icon: CalendarPlus },
  { label: "Template Library", href: "/vendor/dashboard/template-library", icon: LayoutGrid },
  { label: "My Invitations", href: "/vendor/dashboard/my-templates", icon: Monitor },
  { label: "Photo Selections", href: "/vendor/dashboard/photo-selections", icon: Camera },
  { label: "Payments", href: "/vendor/dashboard/payments", icon: CreditCard },
  { label: "Clients", href: "/vendor/dashboard/clients", icon: Users },
];

export default function VendorDashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const [workspace, setWorkspace] = useState("Business name");
  const [vendorName, setVendorName] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const workspaceOptions = useMemo(() => {
    const labels = [workspace].filter(Boolean);
    if (vendorName && !labels.includes(vendorName)) {
      labels.unshift(vendorName);
    }
    return labels;
  }, [vendorName, workspace]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
      router.push("/vendor/signin");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

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

      const businessLabel = session.user.businessName || session.user.name || "Business name";
      setVendorName(businessLabel);
      setWorkspace(businessLabel);
      setIsAuthorized(true);
      setCheckingAuth(false);
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, lenis]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] text-black">
        <div className="rounded-[1.5rem] border border-black/10 bg-white px-6 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <p className="text-sm text-black/65">Loading....</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-black">
      <div className="flex min-h-screen">
        <aside data-lenis-prevent className="sticky top-0 hidden h-screen overflow-y-auto hide-scrollbar flex flex-col w-72 shrink-0 border-r border-black/8 bg-[#0b0b0b] px-5 py-6 text-white lg:block">
          <Link href="/vendor/dashboard" className="flex items-center gap-3 border-b border-white/8 pb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b89143]/35 bg-[#151515] text-[#c8a24c]">
              <Image src="/icon.png" alt="Logo" width={50} height={50} />
            </div>
            <div>
              <div className="relative h-8 mb-2 w-25">
                <Image src="/logo_white_.png" alt="Logo" height={150} width={150} />
              </div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#c8a24c]">Partner Studio</p>
            </div>
          </Link>

          <nav className="mt-6 space-y-3">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== "/vendor/dashboard" && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded border px-4 py-3 text-sm font-medium transition ${active
                    ? "border-[#c8a24c]/55 bg-white/8 text-white shadow-[0_0_0_1px_rgba(200,162,76,0.22)]"
                    : "border-transparent text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4">
            <div className="rounded-[1.5rem] border border-[#c8a24c]/40 bg-[linear-gradient(180deg,rgba(20,20,20,0.98),rgba(10,10,10,1))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a24c]/30 bg-[#0f0f0f] text-[#c8a24c]">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f4e8c2]">Need Help?</p>
                  <p className="mt-1 text-sm leading-6 text-white/72">Our support team is just a message away.</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 h-11 w-full justify-start border-[#c8a24c]/45 bg-transparent text-white hover:bg-white/10"
                onClick={() => window.open("https://wa.me/918828287278", "_blank")}
              >
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current">◎</span>
                Chat on WhatsApp
              </Button>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded border border-red-500/30 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <div className={`fixed inset-0 z-40 bg-black/45 transition-opacity lg:hidden ${isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />

        <aside
          data-lenis-prevent
          className={`fixed inset-y-0 left-0 z-50 w-[84vw] max-w-[320px] transform border-r border-black/8 bg-[#0b0b0b] px-5 py-6 text-white transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col overflow-y-auto`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="flex items-center justify-between border-b border-white/8 pb-5">
            <Link href="/vendor/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b89143]/35 bg-[#151515] text-[#c8a24c]">
                <span className="text-lg font-semibold">E</span>
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">EnviteYou</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8a24c]">Partner Studio</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="mt-6 space-y-2 pr-1"
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== "/vendor/dashboard" && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded border px-4 py-3 text-sm font-medium transition ${active
                    ? "border-[#c8a24c]/55 bg-white/8 text-white shadow-[0_0_0_1px_rgba(200,162,76,0.22)]"
                    : "border-transparent text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-6">
            <div className="rounded-[1.5rem] border border-[#c8a24c]/40 bg-[linear-gradient(180deg,rgba(20,20,20,0.98),rgba(10,10,10,1))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a24c]/30 bg-[#0f0f0f] text-[#c8a24c]">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f4e8c2]">Need Help?</p>
                  <p className="mt-1 text-sm leading-6 text-white/72">Our support team is just a message away.</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4 h-11 w-full justify-start border-[#c8a24c]/45 bg-transparent text-white hover:bg-white/10"
                onClick={() => window.open("https://wa.me/919999999999", "_blank")}
              >
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current">◎</span>
                Chat on WhatsApp
              </Button>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded border border-red-500/30 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-black/8 bg-[rgba(246,243,238,0.88)] px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded border border-black/10 bg-white text-black shadow-[0_10px_24px_rgba(0,0,0,0.04)] lg:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <Select value={workspace} onValueChange={(value) => {
                  setWorkspace(value);
                  toast.success(`Workspace switched to ${value}`);
                }}>
                  <SelectTrigger className="h-11 flex-1 min-w-0 rounded border border-black/10 bg-white px-4 text-left text-sm font-medium text-black shadow-[0_10px_24px_rgba(0,0,0,0.04)] sm:h-12 sm:flex-none sm:w-auto sm:min-w-60">
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent align="start" className="rounded border border-black/10 bg-white shadow-xl">
                    {workspaceOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-sm font-medium text-black">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* <div className="hidden text-xs text-black/45 sm:block">Lucknow, India</div> */}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="hidden h-11 rounded border-black/10 bg-white px-4 text-sm font-medium text-black shadow-[0_10px_24px_rgba(0,0,0,0.04)] hover:bg-black hover:text-white sm:inline-flex"
                  onClick={() => toast.success("Draft saved")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>

                {/* <button type="button" className="relative flex h-11 w-11 items-center justify-center rounded border border-black/10 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                  <Bell className="h-5 w-5 text-black/70" />
                  <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-[#c8a24c] px-1 text-[10px] font-semibold text-white">3</span>
                </button> */}

                <button type="button" className="flex h-11 w-11 items-center justify-center rounded bg-black text-sm font-semibold text-[#c8a24c] shadow-[0_10px_24px_rgba(0,0,0,0.1)]">
                  {(vendorName || workspace)
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase() || "VB"}
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}