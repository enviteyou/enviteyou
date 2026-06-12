import { getTemplates } from "@/lib/templateService";
import Hero from "../../components/Hero";
import HeroTemplate from "../../components/HeroTemplate";
import FeaturesShowcase from "../../components/FeaturesShowcase";
import TestimonialsSection from "../../components/TestimonialsSection";
import ComparisonTable from "../../components/ComparisonTable";
import FaqAccordion from "../../components/FaqAccordion";

// Revalidate the homepage cache every hour
export const revalidate = 3600;

export default async function Home() {
  const templates = await getTemplates();

  return (
    <>
      <Hero templates={templates} />
      <HeroTemplate templates={templates} />
      <FeaturesShowcase />
      <TestimonialsSection />
      <ComparisonTable />
      <FaqAccordion />

    </>
  );
}
