"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Monitor,
  Camera,
  BookOpen,
  Crown,
  CreditCard,
  Gift,
  User,
  HelpCircle,
  MessageSquare,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { getVendorSession } from "@/lib/vendorAuth";
import api from "@/api/axios";
import { useLenis } from "lenis/react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Wedding Invitations", href: "/vendor/dashboard/wedding-invitations", icon: Monitor, key: "wedding-invitations" },
  { label: "Photo Selection", href: "/vendor/dashboard/photo-selections", icon: Camera, key: "photo-selections" },
  { label: "Digital Albums", href: "/vendor/dashboard/digital-albums", icon: BookOpen, key: "digital-albums" },
  { label: "Plans", href: "/vendor/dashboard/plans", icon: Crown, key: "plans" },
  { label: "My Plan & Billing", href: "/vendor/dashboard/billing", icon: CreditCard, key: "billing" },
  { label: "Referrals & Wallet", href: "/vendor/dashboard/wallet", icon: Gift, key: "wallet" },
  { label: "My Profile", href: "/vendor/dashboard/profile", icon: User, key: "profile" },
  { label: "Help Center", href: "/vendor/dashboard/help", icon: HelpCircle, key: "help" },
  { label: "Support Tickets", href: "/vendor/dashboard/support", icon: MessageSquare, key: "support" },
];

export default function VendorDashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const [workspace, setWorkspace] = useState("Shubh Moments Studio");
  const [vendorName, setVendorName] = useState("Abhigyan");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const workspaceOptions = useMemo(() => {
    const defaultLabels = ["Shubh Moments Studio", "Royal Heritage Studio", "Vows & Memories"];
    const labels = [workspace, vendorName ? `${vendorName}'s Studio` : null, ...defaultLabels].filter(Boolean);
    return Array.from(new Set(labels));
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
      try {
        const session = await getVendorSession();

        if (!mounted) return;

        if (!session?.user || session.user.role !== "vendor") {
          router.replace("/vendor/signin");
          return;
        }

        const businessLabel = session.user.businessName || session.user.name || "Shubh Moments Studio";
        setVendorName(session.user.name || "Abhigyan");
        setWorkspace(businessLabel);
        setIsAuthorized(true);
      } catch {
        if (mounted) {
          router.replace("/vendor/signin");
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
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
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f6] text-black font-sans">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200/80 bg-white px-8 py-6 shadow-xs">
          <Image
            src="/logo.png"
            alt="Envite You Logo"
            width={120}
            height={36}
            priority
            className="h-7 w-auto object-contain animate-pulse"
          />
          <p className="text-xs font-medium text-stone-500">Loading your studio dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const isNavActive = (item) => {
    if (item.href === "/vendor/dashboard") {
      return pathname === "/vendor/dashboard" || pathname === "/vendor";
    }
    if (item.key === "wedding-invitations") {
      return pathname === "/vendor/dashboard/wedding-invitations" || pathname === "/vendor/dashboard/wedding-websites";
    }
    return pathname === item.href || pathname?.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-stone-900 font-sans antialiased">
      <div className="flex min-h-screen">
        {/* Desktop Left Sidebar */}
        <aside
          data-lenis-prevent
          className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-stone-200/80 bg-white px-4 py-5 lg:flex overflow-y-auto"
        >
          {/* Brand Header */}
          <Link href="/vendor/dashboard" className="flex items-center gap-3 px-2 pb-5 border-b border-stone-100">
            <Image
              src="/logo.png"
              alt="Envite You Logo"
              width={145}
              height={42}
              priority
              className="h-8.5 w-auto max-w-36.25 object-contain"
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="mt-3 flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#6d162f] text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-100/70 hover:text-stone-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 stroke-[1.5] transition-colors ${
                      active ? "text-white" : "text-stone-400 group-hover:text-stone-700"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto pt-4 border-t border-stone-100">
            <p className="text-[11px] font-medium text-stone-400">
              Beautiful Stories Together
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-stone-400 transition hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs transition-opacity lg:hidden ${
            isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Sidebar */}
        <aside
          data-lenis-prevent
          className={`fixed inset-y-0 left-0 z-50 flex h-full w-70 flex-col border-r border-stone-200 bg-white px-4 py-5 shadow-2xl transition-transform duration-300 lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="Envite You Logo"
                width={130}
                height={38}
                priority
                className="h-7.5 w-auto max-w-32.5 object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              aria-label="Close menu"
            >
              <X className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>

          <nav className="mt-4 flex-1 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "bg-[#6d162f] text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 stroke-[1.5]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-stone-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 stroke-[1.5]" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Header Navbar */}
          <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Left on Mobile: Hamburger Button & Logo */}
              <div className="flex items-center gap-2.5 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="rounded-lg border border-stone-200 p-1.5 text-stone-700 hover:bg-stone-50"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4 stroke-[1.5]" />
                </button>
                <Link href="/vendor/dashboard" className="flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Envite You Logo"
                    width={110}
                    height={32}
                    priority
                    className="h-6.5 w-auto object-contain"
                  />
                </Link>
              </div>

              {/* Desktop Empty Spacer / Search Placeholder */}
              <div className="hidden lg:block min-w-0" />

              {/* Top Right Controls */}
              <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                {/* Studio Selector Dropdown */}
                <Select value={workspace} onValueChange={(val) => {
                  setWorkspace(val);
                  toast.success(`Active Studio: ${val}`);
                }}>
                  <SelectTrigger className="h-9 min-w-42.5 sm:min-w-47.5 rounded-lg border-0 bg-transparent px-2.5 text-xs sm:text-sm font-semibold text-stone-800 hover:bg-stone-100/80 focus:ring-0 shadow-none">
                    <SelectValue placeholder="Select studio" />
                  </SelectTrigger>
                  <SelectContent align="end" className="rounded-xl border border-stone-200 bg-white shadow-lg">
                    {workspaceOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-xs sm:text-sm font-medium text-stone-800">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Help Button */}
                <button
                  type="button"
                  onClick={() => toast.info("Vendor Support & Documentation: support@enviteyou.com")}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition"
                  title="Help Center"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>

                {/* Notifications Bell */}
                <button
                  type="button"
                  onClick={() => toast.info("You have 4 attention alerts pending.")}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* User Avatar Circle */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fce7ea] text-xs font-semibold text-[#8e1d3d] ring-1 ring-[#f5c2cb] hover:ring-2 hover:ring-[#8e1d3d] transition"
                    title={vendorName}
                  >
                    {vendorName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")
                      .toUpperCase() || "AA"}
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-stone-200 bg-white p-2 shadow-xl z-50">
                      <div className="border-b border-stone-100 px-3 py-2">
                        <p className="text-xs font-semibold text-stone-900">{vendorName}</p>
                        <p className="text-[10px] text-stone-500 truncate">{workspace}</p>
                      </div>
                      <Link
                        href="/vendor/dashboard/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="block rounded-lg px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
                      >
                        Profile Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Dashboard Body View */}
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}