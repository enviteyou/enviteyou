import Link from "next/link";
import BlogListClient from "@/components/BlogListClient";

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

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-28 pb-20 text-black">
      <div className="mx-auto max-w-7xl px-5 sm:px-10">
        {/* Minimal Breadcrumb Header */}
        <div className="flex flex-col gap-1 mb-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
            <Link href="/" className="hover:text-[#74313d] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#74313d]">Journal</span>
          </div>
          <h1 className="text-3xl font-bold font-heading tracking-tight text-black sm:text-4xl">
            The EnviteYou Journal
          </h1>
        </div>

        <div className="max-w-5xl mx-auto">
          <BlogListClient blogs={blogs} />
        </div>
      </div>
    </div>
  );
}

