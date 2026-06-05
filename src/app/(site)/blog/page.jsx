import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The EnviteYou Journal | Wedding Inspiration & Invitations",
  description: "Read the latest tips, guides, and trends on wedding invitations, wedding planning, custom themes, and digital RSVP delivery from the EnviteYou editorial team.",
};

async function fetchBlogs() {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const res = await fetch(`${apiBaseUrl}/blogs`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch blogs status:", res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    return [];
  }
}

export default async function BlogListPage() {
  const blogs = await fetchBlogs();

  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-28 pb-20 text-black">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        {/* Editorial Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">The Journal</p>
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl font-heading">
            Wedding Inspiration & Design
          </h1>
          <p className="text-sm sm:text-base text-black/55 font-sans leading-relaxed">
            Curated ideas, style guides, and practical planning insights to help you craft your dream digital wedding invitation and celebrate your big day.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="rounded-3xl border border-black/5 bg-white p-12 text-center text-sm font-semibold text-black/45 shadow-[0_8px_30px_rgba(0,0,0,0.01)] max-w-2xl mx-auto">
            Our journal is currently being prepared. Check back shortly for design insights, guides, and trends!
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Post Card */}
            {featuredBlog && (
              <div className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-md hover:border-[#74313d]/10">
                <Link href={`/blog/${featuredBlog._id}`} className="grid gap-6 md:grid-cols-2">
                  <div className="relative aspect-16/10 md:aspect-auto w-full min-h-64 md:min-h-96 overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredBlog.featuredImage}
                      alt={featuredBlog.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14 space-y-6">
                    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-black/40">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {new Date(featuredBlog.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="size-3.5" />
                        EnviteYou Editorial
                      </span>
                    </div>

                    <div className="space-y-3">
                      <span className="rounded-full bg-[#74313d]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#74313d] border border-[#74313d]/10">
                        Featured Article
                      </span>
                      <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl lg:text-4xl font-heading group-hover:text-[#74313d] transition-colors leading-tight">
                        {featuredBlog.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-black/60 font-sans">
                        {featuredBlog.shortDescription}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#74313d] group-hover:gap-2.5 transition-all">
                      <span>Read Feature</span>
                      <ArrowRight className="size-3.5" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Remaining Grid Cards */}
            {remainingBlogs.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {remainingBlogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#74313d]/10"
                  >
                    <Link href={`/blog/${blog._id}`} className="flex flex-col h-full">
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-black/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>

                      <div className="flex flex-col flex-1 p-6 space-y-4">
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-black/40">
                          <Calendar className="size-3" />
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="space-y-2 flex-1">
                          <h3 className="text-lg font-bold tracking-tight text-black font-heading group-hover:text-[#74313d] transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-xs leading-relaxed text-black/50 font-sans line-clamp-3">
                            {blog.shortDescription}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-black/5 flex items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-widest text-[#74313d] group-hover:text-[#5c242e] transition-all">
                          <span>Read Article</span>
                          <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
