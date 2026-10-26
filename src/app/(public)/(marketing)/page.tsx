import {
  CTASection,
  FeaturedChallenges,
  FeaturesGrid,
  HeroSection,
  StatsBar,
  WorkflowPreview,
} from "@/components/modules/homepage";

export const metadata = {
  title: "DevAssess - Modern Technical Hiring & Code Evaluation Platform",
  description:
    "Evaluate and certify top technical talent with real-world assessments, interactive Docker sandboxes, and anti-cheat telemetry.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsBar />
      <FeaturesGrid />
      <WorkflowPreview />
      <FeaturedChallenges />
      <CTASection />
    </div>
  );
}
