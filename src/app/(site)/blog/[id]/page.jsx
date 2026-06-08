import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { ScrollProgressBar, BlogShareButtons } from "@/components/BlogInteractiveAddons";

export const dynamic = "force-dynamic";

async function fetchBlogById(id) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const res = await fetch(`${apiBaseUrl}/blogs/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch blog status:", res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching blog details:", error.message);
    return null;
  }
}

async function fetchAllBlogs() {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const res = await fetch(`${apiBaseUrl}/blogs`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching all blogs:", error.message);
    return [];
  }
}

const getReadTime = (description = "") => {
  const wordCount = description ? description.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const blog = await fetchBlogById(id);

  if (!blog) {
    return {
      title: "Article Not Found | EnviteYou",
      description: "The requested article was not found.",
    };
  }

  return {
    title: `${blog.meta_title?.trim() || blog.title} | EnviteYou`,
    description: blog.meta_description?.trim() || blog.shortDescription,
    openGraph: {
      title: blog.meta_title?.trim() || blog.title,
      description: blog.meta_description?.trim() || blog.shortDescription,
      images: [{ url: blog.featuredImage }],
      type: "article",
      publishedTime: blog.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.meta_title?.trim() || blog.title,
      description: blog.meta_description?.trim() || blog.shortDescription,
      images: [blog.featuredImage],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const blog = await fetchBlogById(id);

  if (!blog) {
    return (
      <div className="bg-[#fcfaf8] min-h-screen pt-28 pb-16 text-black">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h1 className="text-3xl font-bold font-heading">Article Not Found</h1>
          <p className="mt-4 text-black/60 font-sans">
            The blog post you are trying to view does not exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-xs font-semibold text-black transition hover:bg-black hover:text-white"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Journal</span>
          </Link>
        </div>
      </div>
    );
  }

  const allBlogs = await fetchAllBlogs();
  const relatedBlogs = allBlogs
    .filter((b) => b._id !== id)
    .map((b) => ({
      ...b,
      readTime: getReadTime(b.description),
    }))
    .slice(0, 3);

  const readTime = getReadTime(blog.description);

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-28 pb-20 text-black">
      <ScrollProgressBar />

      <article className="mx-auto max-w-3xl px-5 sm:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-black/40 mb-6">
          <Link href="/" className="hover:text-[#74313d] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#74313d] transition-colors">
            Journal
          </Link>
          <span>/</span>
          <span className="text-[#74313d] truncate max-w-[180px] sm:max-w-[240px]">
            {blog.title}
          </span>
        </div>

        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-black/8 bg-white px-4 py-2.5 text-xs font-semibold text-black/70 hover:text-[#74313d] hover:border-[#74313d]/20 transition shadow-xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Journal</span>
          </Link>
        </div>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black font-heading leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-y border-black/5 py-4">
            <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-black/45">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="w-1 h-1 rounded-full bg-black/20 hidden sm:inline-block" />
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {readTime} Min Read
              </span>
              <span className="w-1 h-1 rounded-full bg-black/20 hidden sm:inline-block" />
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                EnviteYou Editorial
              </span>
            </div>
            {/* Share Buttons */}
            <BlogShareButtons blogTitle={blog.title} />
          </div>
        </div>

        {/* Cover Image Container with Blurred Backdrop to show portrait images fully */}
        <div className="mt-8 relative w-full overflow-hidden rounded-3xl border border-black/5 bg-[#f5efe9] shadow-md flex items-center justify-center min-h-[300px] sm:min-h-[500px] max-h-[650px]">
          {/* Blurred background overlay */}
          <img
            src={blog.featuredImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover blur-3xl opacity-35 scale-110 select-none pointer-events-none"
          />
          {/* Light overlay for depth */}
          <div className="absolute inset-0 bg-white/30" />
          {/* Sharp foreground image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="relative z-10 max-h-[650px] w-auto object-contain shadow-xs rounded-xl"
          />
        </div>

        {/* Short description block quote */}
        <div className="mt-8 text-base sm:text-lg font-sans text-[#74313d] leading-relaxed italic border-l-4 border-[#74313d] pl-5 py-1 bg-[#74313d]/2 rounded-r-2xl pr-2">
          {blog.shortDescription}
        </div>

        {/* Rich content body */}
        <div
          className="mt-8 text-neutral-800 font-sans text-sm sm:text-base leading-relaxed sm:leading-loose space-y-6 whitespace-pre-wrap select-text pr-2"
        >
          {blog.description}
        </div>
      </article>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <div className="mt-20 border-t border-black/5 pt-16 max-w-5xl mx-auto px-5 sm:px-10">
          <div className="space-y-2 mb-8 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]">Continue Reading</span>
            <h2 className="text-2xl font-bold font-heading tracking-tight text-black">More from the Journal</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedBlogs.map((item) => (
              <article
                key={item._id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#74313d]/15"
              >
                <Link href={`/blog/${item._id}`} className="flex flex-col h-full">
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-[#f5efe9] flex items-center justify-center">
                    {/* Blurred background backdrop */}
                    <img
                      src={item.featuredImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-35 scale-110 select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-white/20" />
                    
                    {/* Sharp foreground image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="relative z-10 h-full w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Absolute overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15" />
                  </div>

                  <div className="flex flex-col flex-1 p-6 space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-black/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-black/25" />
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {item.readTime} Min Read
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-base font-bold tracking-tight text-black font-heading group-hover:text-[#74313d] transition-colors duration-250 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-black/50 font-sans line-clamp-3">
                        {item.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#74313d]">
                      <span>Read Article</span>
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


