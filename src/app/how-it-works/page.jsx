import HowItWorksPage from "@/components/HowItWorksPage";

export const metadata = {
  title: "How It Works",
  description:
    "Learn how EnviteYou works with a simple step-by-step invite flow, mobile preview, and auto-typing phone section for wedding invitations.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksRoute() {
  return <HowItWorksPage />;
}