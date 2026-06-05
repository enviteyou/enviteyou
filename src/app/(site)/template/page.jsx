import { getTemplates } from "@/lib/templateService";
import HeroTemplate from "@/components/HeroTemplate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wedding Invitation Templates Catalog | EnviteYou",
  description: "Browse our premium collection of digital wedding invitations, Save the Date templates, and themes. Filter by categories and customize your dynamic invite online.",
};

export default async function TemplateCatalogPage() {
  const templates = await getTemplates();

  return (
    <div className="bg-white min-h-screen pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-10">
        <div className="mb-4 flex justify-center">
          <div className="rounded-sm border border-black/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-black/70">
            Catalog Overview
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl font-heading">
          Wedding Invitation Catalogue
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-black/60 font-sans leading-relaxed">
          Discover our curated collection of elegant, mobile-first invitation layouts. Filter by religious traditions or themes, and start customizing your invite in minutes.
        </p>
      </div>
      <div className="mt-6">
        <HeroTemplate templates={templates} />
      </div>
    </div>
  );
}
