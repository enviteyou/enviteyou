"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { toast } from "sonner";
import { Plus, ArrowLeft, Edit, Trash2, Calendar, FileText, Globe } from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
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
    async function fetchBlogs() {
      try {
        const response = await api.get("/blogs");
        setBlogs(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    }
    if (authenticated) {
      fetchBlogs();
    }
  }, [authenticated]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      toast.success("Blog post deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete blog.");
    }
  };

  if (!authenticated) return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Blog Workspace</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-black font-heading">Manage Blogs</h1>
          <p className="mt-2.5 max-w-xl text-sm leading-6 text-black/55">
            Create, update, and manage editorial articles, SEO titles, and post image assets.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3.5 text-xs font-semibold text-black transition hover:bg-black hover:text-white"
          >
            <ArrowLeft className="size-4" />
            <span>Dashboard</span>
          </a>
          <a
            href="/admin/blogs/add"
            className="inline-flex items-center gap-2 rounded-xl bg-[#74313d] px-5 py-3.5 text-xs font-semibold text-white transition hover:bg-[#5e232c] shadow-md shadow-[#74313d]/15"
          >
            <Plus className="size-4" />
            <span>Add New Blog</span>
          </a>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-black/5 bg-white p-8 text-center text-sm font-semibold text-black/45 shadow-sm">
          Loading editorial catalogue...
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-2xl border border-black/5 bg-white p-12 text-center text-sm font-semibold text-black/45 shadow-sm space-y-4">
          <p>No blog posts found in database.</p>
          <a
            href="/admin/blogs/add"
            className="inline-flex items-center gap-2 rounded-xl border border-[#74313d]/20 bg-[#74313d]/5 px-5 py-3 text-xs font-bold text-[#74313d] hover:bg-[#74313d] hover:text-white transition"
          >
            Create Your First Blog
          </a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex flex-col justify-between border border-black/5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#74313d]/10"
            >
              <div>
                {/* Blog preview thumbnail */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5 space-y-4">
                  {/* Date badge */}
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-black/40">
                    <Calendar className="size-3.5" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold tracking-tight text-black font-heading leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-black/50 line-clamp-3">
                      {blog.shortDescription}
                    </p>
                  </div>

                  {/* SEO indicator badges */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
                    {blog.meta_title ? (
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-100">
                        <Globe className="size-2.5" />
                        <span>SEO Title</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700 border border-amber-100">
                        <Globe className="size-2.5" />
                        <span>No SEO Title</span>
                      </div>
                    )}
                    {blog.meta_description ? (
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-100">
                        <FileText className="size-2.5" />
                        <span>SEO Desc</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700 border border-amber-100">
                        <FileText className="size-2.5" />
                        <span>No SEO Desc</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons footer */}
              <div className="border-t border-black/5 p-4 bg-[#fbf9f7] flex items-center justify-end gap-2">
                <a
                  href={`/admin/blogs/edit/${blog._id}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/70 hover:border-[#74313d]/20 hover:text-[#74313d] hover:bg-[#74313d]/2 transition"
                  title="Edit post details"
                >
                  <Edit className="size-4" />
                </a>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 transition cursor-pointer"
                  title="Delete post"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
