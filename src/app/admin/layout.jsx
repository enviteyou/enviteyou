"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar'
import "../(site)/globals.css"

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/admin/signin';

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black">
      <div className="flex">
        {!hideSidebar && <Sidebar />}
        <main className={`min-w-0 flex-1 p-4 sm:p-6 lg:p-8 ${hideSidebar ? 'w-full' : ''}`}>{children}</main>
      </div>
    </div>
  )
}
