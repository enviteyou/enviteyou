"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import api from "@/api/axios";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, templates: 0 });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // check auth first, redirect if not admin (do not render dashboard)
    (async () => {
      try {
        const res = await api.get('/auth/me-admin');
        console.log('Admin auth check response:', res.data);
        if (res.status !== 200) return router.push('/admin/signin');
        const data = res.data;
        if (!data?.user || data.user.role !== 'admin') {
          alert('Unauthorized access');
          return router.push('/admin/signin');
        }
        setAuthenticated(true);
      } catch (err) {
        router.push('/admin/signin');
      }
    })();
  }, [router]);

  useEffect(() => {
    async function load() {
      try {
        const [u, t] = await Promise.all([api.get("/users/count"), api.get("/templates")]);
        setCounts({ users: u.data.count || 0, templates: t.data.length || 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return authenticated ? (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Overview</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
          Monitor catalog size and jump into the template workflows from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard label="Users" value={loading ? "..." : counts.users} />
        <MetricCard label="Templates" value={loading ? "..." : counts.templates} />
      </div>

      <section className="mt-6 border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Quick actions</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Template operations</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="/admin/addTemplate" className="bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5">
              Add Template
            </a>
            <a href="/admin/allTemplate" className="border border-black bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white">
              View Catalog
            </a>
            <a href="/admin/manageVendor" className="border border-black bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-black hover:text-white">
              Manage Vendors
            </a>
          </div>
        </div>
      </section>
    </div>
  ) : null;
}

function MetricCard({ label, value }) {
  return (
    <div className="border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">{label}</p>
      <p className="mt-4 text-5xl font-semibold tracking-tight text-black">{value}</p>
    </div>
  );
}
