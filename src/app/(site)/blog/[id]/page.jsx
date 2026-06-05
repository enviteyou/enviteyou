import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

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

export async function generateMetadata({ params }) {
  // Await the params since Next.js App Router expects it in newer versions
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

  // Calculate read time assuming 200 words per minute
  const wordCount = blog.description ? blog.description.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-28 pb-20 text-black">
      <article className="mx-auto max-w-4xl px-5 sm:px-10">
        {/* Back navigation & Metadata */}
        <div className="space-y-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-black/8 bg-white px-4 py-2.5 text-xs font-semibold text-black/70 hover:text-black transition hover:border-black/15 shadow-xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>All Articles</span>
          </Link>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black font-heading leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-black/45 pt-2 border-b border-black/5 pb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                EnviteYou Editorial
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {readTime} Min Read
              </span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="mt-8 relative aspect-16/10 w-full overflow-hidden rounded-3xl border border-black/5 bg-black/5 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Short description block quote */}
        <div className="mt-8 text-lg font-sans text-[#74313d]/90 leading-relaxed italic border-l-4 border-[#74313d] pl-5 py-1">
          {blog.shortDescription}
        </div>

        {/* Rich content body */}
        <div
          className="mt-8 text-black/80 font-sans text-sm sm:text-base leading-7 sm:leading-8 space-y-6 whitespace-pre-wrap select-text pr-2"
        >
          {blog.description}
        </div>
      </article>
    </div>
  );
}
