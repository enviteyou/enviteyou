"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import api from '@/api/axios';

export default function AdminClientLayout({ children }) {
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

    (async () => {
      try {
        const res = await api.get('/auth/me-admin');
        if (res.status !== 200) {
          router.push('/admin/signin');
          return;
        }

        const data = res.data;
        if (!data?.user || data.user.role !== 'admin') {
          router.push('/admin/signin');
          return;
        }

        setIsAuthorized(true);
      } catch {
        router.push('/admin/signin');
      } finally {
        setMounted(true);
      }
    })();
  }, [hideSidebar, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] text-black">
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 w-full">{children}</main>
      </div>
    );
  }

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
  );
}
