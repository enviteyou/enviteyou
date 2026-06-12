"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, ArrowRight, Clock, BookOpen, X } from "lucide-react";
import Image from "next/image";

// Word count calculation helper for read times
const getReadTime = (description = "") => {
  const wordCount = description ? description.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export default function BlogListClient({ blogs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamically map properties for all blogs
  const blogsWithReadTime = useMemo(() => {
    return blogs.map((blog) => ({
      ...blog,
      readTime: getReadTime(blog.description),
    }));
  }, [blogs]);

  // Filter blogs based on search query
  const filteredBlogs = useMemo(() => {
    return blogsWithReadTime.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [blogsWithReadTime, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Search Bar Wrapper */}
      <div className="bg-white border border-black/5 p-4 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative flex items-center">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#74313d]/60 group-focus-within:text-[#74313d] transition-colors" />
          <input
            type="text"
            placeholder="Search inspiration, design ideas, planning checklists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-[#fcfaf8] border border-black/5 rounded-2xl text-sm outline-none transition-all placeholder:text-black/35 focus:border-[#74313d]/30 focus:bg-white focus:ring-4 focus:ring-[#74313d]/5 text-black"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 transition"
            >
              <X className="size-3.5 text-black/40 hover:text-black" />
            </button>
          )}
        </div>
      </div>

      {/* Grid List */}
      {filteredBlogs.length === 0 ? (
        <div className="rounded-3xl border border-black/5 bg-white p-12 text-center text-sm font-semibold text-black/45 shadow-[0_8px_30px_rgba(0,0,0,0.01)] max-w-2xl mx-auto space-y-3">
          <BookOpen className="size-8 mx-auto text-[#74313d]/40" />
          <p>No articles found matching "{searchQuery}".</p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-bold text-[#74313d] hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <article
              key={blog._id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#74313d]/15"
            >
              <Link href={`/blog/${blog._id}`} className="flex flex-col h-full">
                {/* Featured Image Container with Blurred Backdrop to show portrait images fully */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[#f5efe9] flex items-center justify-center">
                  {/* Blurred background backdrop */}
                  <Image
                    src={blog.featuredImage}
                    alt=""
                    width={400}
                    height={400}
                    className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-35 scale-110 select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-white/20" />

                  {/* Sharp foreground image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    width={400}
                    height={400}
                    className="relative z-10 h-full w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Absolute overlays */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15" />
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-6 space-y-4">
                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-black/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-black/25" />
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {blog.readTime} Min Read
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2.5 flex-1">
                    <h3 className="text-lg font-bold tracking-tight text-black font-heading group-hover:text-[#74313d] transition-colors duration-250 line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-black/50 font-sans line-clamp-3">
                      {blog.shortDescription}
                    </p>
                  </div>

                  {/* Action Link Footer */}
                  <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#74313d]">
                    <span>Read Article</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
