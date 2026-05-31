"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/api/axios";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Add Template", href: "/admin/addTemplate" },
  { label: "All Templates", href: "/admin/allTemplate" },
  { label: "Vendors", href: "/admin/manageVendor" },
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
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-black/10 bg-white px-5 py-6 flex-col lg:flex">
      <Link href="/admin" className="block">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">EnviteYou</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">Admin</h2>
      </Link>

      <nav className="mt-8 grid gap-2 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`border px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "border-black bg-black text-white"
                  : "border-transparent text-black/60 hover:border-black/10 hover:bg-black/4 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="border border-black/10 p-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Workspace</p>
          <p className="mt-2 text-sm font-medium text-black">Template management</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-semibold transition hover:bg-red-100 hover:border-red-300"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
