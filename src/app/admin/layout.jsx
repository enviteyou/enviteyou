"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar'
import api from '@/api/axios';
import "../(site)/globals.css"



export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hideSidebar = pathname === '/admin/signin';

  useEffect(() => {
    if (hideSidebar) {
      setMounted(true);
      return;
    }

    // Check authorization for protected routes
    (async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.status !== 200) return router.push('/admin/signin');
        const data = res.data;
        if (!data?.user || data.user.role !== 'admin') {
          return router.push('/admin/signin');
        }
        setIsAuthorized(true);
      } catch (err) {
        router.push('/admin/signin');
      } finally {
        setMounted(true);
      }
    })();
  }, [pathname, hideSidebar, router]);

  // Don't render anything until we've checked authorization
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] text-black">
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 w-full">{children}</main>
      </div>
    );
  }

  // If not signin page and not authorized, don't show sidebar
  if (!hideSidebar && !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] text-black">
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black">
      <div className="flex">
        {!hideSidebar && isAuthorized && <Sidebar />}
        <main className={`min-w-0 flex-1 p-4 sm:p-6 lg:p-8 ${hideSidebar ? 'w-full' : ''}`}>{children}</main>
      </div>
    </div>
  )
}
