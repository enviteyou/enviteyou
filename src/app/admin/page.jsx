"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { Users, Layout, Plus, Eye, UserCheck, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, templates: 0 });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me-admin");
        console.log("Admin auth check response:", res.data);
        if (res.status !== 200) return router.push("/admin/signin");
        const data = res.data;
        if (!data?.user || data.user.role !== "admin") {
          alert("Unauthorized access");
          return router.push("/admin/signin");
        }
        setAuthenticated(true);
      } catch (err) {
        router.push("/admin/signin");
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
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Header Overview */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Overview</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black font-heading">Studio Dashboard</h1>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-black/55">
            Monitor catalog size, user registry metrics, and orchestrate invitation template catalog operations.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <MetricCard
          label="Registered Users"
          value={loading ? "..." : counts.users}
          icon={Users}
          description="Total active user registrations"
          trend="Platform active"
        />
        <MetricCard
          label="Invitation Themes"
          value={loading ? "..." : counts.templates}
          icon={Layout}
          description="Active templates in frontend catalog"
          trend="Catalog live"
        />
      </div>

      {/* Quick Action Operations */}
      <section className="space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Operations</p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-black font-heading">Quick Actions</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <ActionCard
            title="Add Template"
            description="Create and configure a new template layout, allowed customizer tabs, and upload mockups."
            href="/admin/addTemplate"
            icon={Plus}
            cta="Launch Creator"
          />
          <ActionCard
            title="View Catalog"
            description="Manage existing templates, modify selling price rules, and configure visual layout listings."
            href="/admin/allTemplate"
            icon={Eye}
            cta="Open Catalog"
          />
          <ActionCard
            title="Manage Vendors"
            description="Review pending vendor signups, approve registration requests, and audit Google My Business links."
            href="/admin/manageVendor"
            icon={UserCheck}
            cta="Open Console"
          />
        </div>
      </section>
    </div>
  ) : null;
}

function MetricCard({ label, value, icon: Icon, description, trend }) {
  return (
    <div className="relative overflow-hidden border border-black/5 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/40">{label}</p>
          <p className="mt-4 text-5xl font-semibold tracking-tight text-black font-sans">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#74313d]/5 text-[#74313d]">
          <Icon className="size-5.5" />
        </div>
      </div>
      <div className="mt-6 border-t border-black/5 pt-4 flex items-center justify-between text-xs">
        <span className="text-black/45">{description}</span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold uppercase text-emerald-700 text-[9px] tracking-wider border border-emerald-100">
          {trend}
        </span>
      </div>
    </div>
  );
}

function ActionCard({ title, description, href, icon: Icon, cta }) {
  return (
    <a
      href={href}
      className="group flex flex-col justify-between border border-black/5 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#74313d]/15"
    >
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/3 text-black group-hover:bg-[#74313d] group-hover:text-white transition-all duration-300 shadow-sm">
          <Icon className="size-5" />
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-black font-heading group-hover:text-[#74313d] transition-colors">
          {title}
        </h3>
        <p className="mt-2.5 text-xs leading-5 text-black/50">{description}</p>
      </div>

      <div className="mt-8 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#74313d] group-hover:gap-2.5 transition-all">
        <span>{cta}</span>
        <ArrowRight className="size-3.5" />
      </div>
    </a>
  );
}
