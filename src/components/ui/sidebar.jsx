"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Add Template", href: "/admin/addTemplate" },
  { label: "All Templates", href: "/admin/allTemplate" },
];

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/signin")) {
    return null;
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-black/10 bg-white px-5 py-6 lg:block">
      <Link href="/admin" className="block">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">EnviteYou</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">Admin</h2>
      </Link>

      <nav className="mt-8 grid gap-2">
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

      <div className="absolute inset-x-5 bottom-6 border border-black/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Workspace</p>
        <p className="mt-2 text-sm font-medium text-black">Template management</p>
      </div>
    </aside>
  );
}
