import { getTemplates } from "@/lib/templateService";
import Hero from "../../components/Hero";
import FeaturesShowcase from "../../components/FeaturesShowcase";
import TestimonialsSection from "../../components/TestimonialsSection";
import ComparisonTable from "../../components/ComparisonTable";
import FaqAccordion from "../../components/FaqAccordion";

export default async function Home() {
  const templates = await getTemplates();

  return (
    <>
      <Hero templates={templates} />
      <FeaturesShowcase />
      <TestimonialsSection />
      <ComparisonTable />
      <FaqAccordion />
     
    </>
  );
}
