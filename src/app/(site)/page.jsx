import { getTemplates } from "@/lib/templateService";
import Hero from "../../components/Hero3d";
import HeroTemplate from "../../components/HeroTemplate";
import FeaturesShowcase from "../../components/FeaturesShowcase";
import TestimonialsSection from "../../components/TestimonialsSection";
import ComparisonTable from "../../components/ComparisonTable";
import FaqAccordion from "../../components/FaqAccordion";

export const dynamic = "force-dynamic";

export default async function Home() {
  const templates = await getTemplates();

  return (
    <>
      {/* <Hero templates={templates} /> */}
      <Hero />
      <HeroTemplate templates={templates} />
      <FeaturesShowcase />
      <TestimonialsSection />
      <ComparisonTable />
      <FaqAccordion />

    </>
  );
}
