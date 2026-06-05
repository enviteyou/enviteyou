"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { toast } from "sonner";
import { Trash2, ArrowLeft, Calendar, User, Phone, Mail, MessageSquare } from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/auth/me-admin");
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
    async function fetchEnquiries() {
      try {
        const response = await api.get("/enquiries");
        setEnquiries(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load enquiries.");
      } finally {
        setLoading(false);
      }
    }
    if (authenticated) {
      fetchEnquiries();
    }
  }, [authenticated]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry entry?")) return;

    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries((prev) => prev.filter((item) => item._id !== id));
      toast.success("Enquiry dismissed successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete enquiry.");
    }
  };

  if (!authenticated) return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Inquiries Workspace</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black font-heading">User Enquiries</h1>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-black/55">
            Review customer contact form registrations, reply directly to client emails, and audit enquiries.
          </p>
        </div>
        <a
          href="/admin"
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3.5 text-xs font-semibold text-black transition hover:bg-black hover:text-white shrink-0 self-start"
        >
          <ArrowLeft className="size-4" />
          <span>Dashboard</span>
        </a>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm font-semibold text-black/45 shadow-sm">
          Loading contact submissions...
        </div>
      ) : enquiries.length === 0 ? (
        <div className="rounded-2xl border border-black/5 bg-white p-12 text-center text-sm font-semibold text-black/45 shadow-sm">
          No enquiries logged in database.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {enquiries.map((item) => (
            <div
              key={item._id}
              className="flex flex-col justify-between border border-black/5 bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-5 transition-all duration-300 hover:shadow-md hover:border-[#74313d]/10"
            >
              {/* Card Body */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#74313d]/5 text-[#74313d]">
                      <User className="size-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-black font-heading leading-tight">{item.name}</h3>
                      <div className="flex items-center gap-1.5 text-[9px] font-semibold text-black/40 mt-0.5">
                        <Calendar className="size-3" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })} at {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition cursor-pointer"
                    title="Dismiss Enquiry"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {/* Contact items */}
                <div className="grid gap-2.5 sm:grid-cols-2 text-xs font-medium">
                  <a
                    href={`mailto:${item.email}`}
                    className="flex items-center gap-2 text-black/60 hover:text-[#74313d] transition hover:underline"
                  >
                    <Mail className="size-3.5 text-black/30 shrink-0" />
                    <span className="truncate">{item.email}</span>
                  </a>
                  <a
                    href={`tel:${item.number}`}
                    className="flex items-center gap-2 text-black/60 hover:text-[#74313d] transition hover:underline"
                  >
                    <Phone className="size-3.5 text-black/30 shrink-0" />
                    <span>{item.number}</span>
                  </a>
                </div>

                {/* Message block */}
                <div className="bg-[#fbf9f7] p-4 rounded-xl border border-black/5 space-y-1.5 flex-1">
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#74313d]/60 flex items-center gap-1.5 font-sans">
                    <MessageSquare className="size-3" />
                    <span>Enquiry Message</span>
                  </span>
                  <p className="text-xs leading-relaxed text-black/80 font-sans whitespace-pre-wrap select-text">
                    {item.enquiry}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
