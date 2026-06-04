"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/api/axios";
import { LayoutDashboard, PlusCircle, FolderTree, Users, LogOut, Shield } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Add Template", href: "/admin/addTemplate", icon: PlusCircle },
  { label: "All Templates", href: "/admin/allTemplate", icon: FolderTree },
  { label: "Vendors", href: "/admin/manageVendor", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
      router.push("/admin/signin");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (pathname?.startsWith("/signin")) {
    return null;
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-black/5 bg-white/80 backdrop-blur-md px-6 py-8 flex-col lg:flex shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
      {/* Brand Logo Header */}
      <Link href="/admin" className="block group">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#74313d] text-white shadow-md shadow-[#74313d]/15 transition-transform duration-300 group-hover:scale-105">
            <Shield className="size-4.5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]/60">Studio Admin</p>
            <h2 className="text-xl font-semibold tracking-tight text-black font-heading">EnviteYou</h2>
          </div>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="mt-10 flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3.5 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                active
                  ? "bg-[#74313d] text-white shadow-lg shadow-[#74313d]/10 hover:opacity-95"
                  : "text-black/60 hover:bg-[#74313d]/5 hover:text-[#74313d]"
              }`}
            >
              <Icon className={`size-4.5 transition-colors ${active ? "text-white" : "text-black/40 group-hover:text-[#74313d]"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Card & Logout */}
      <div className="mt-auto space-y-5">
        <div className="border border-[#74313d]/10 bg-[#faf6f3] p-4 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#74313d]/60 font-sans">Workspace</p>
          <p className="mt-1.5 text-sm font-semibold text-black">Template Operations</p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">Secure Session</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2.5 border border-red-200/50 bg-red-50/40 text-red-600 px-4 py-3.5 text-sm font-semibold rounded-xl transition duration-200 hover:bg-red-50 hover:border-red-200 cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
