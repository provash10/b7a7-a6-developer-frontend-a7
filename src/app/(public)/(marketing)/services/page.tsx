import type { Metadata } from "next";
import {
  AssessmentWorkflow,
  CodeAssessmentSandbox,
  CodeAssessmentSpotlight,
  ServicesCTA,
  ServicesFAQ,
  ServicesHeader,
  ServicesOverview,
} from "@/components/modules/services";

export const metadata: Metadata = {
  title: "Services & Code Assessment Engine | DevAssess",
  description:
    "Evaluate developer talent with timed multi-language coding assessments, automated test case sandboxes, anti-cheat detection, and live candidate leaderboards.",
  openGraph: {
    title: "Services & Code Assessment Engine | DevAssess",
    description:
      "Enterprise developer assessment platform featuring automated test execution, live pair-programming interviews, and AI-powered proctoring.",
  },
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero & Services Showcase */}
      <ServicesHeader />

      {/* Code Assessment Deep Spotlight (Requested Core Feature) */}
      <CodeAssessmentSpotlight />

      {/* Live Interactive Sandbox / Candidate Test Environment Simulator */}
      <CodeAssessmentSandbox />

      {/* 5-Step Recruiter to Candidate Assessment Lifecycle */}
      <AssessmentWorkflow />

      {/* Overview of 3 Platform Pillars: Code Assessment, Live Interview, AI Scoring */}
      <ServicesOverview />

      {/* Service FAQs */}
      <ServicesFAQ />

      {/* Conversion & Action Banner */}
      <ServicesCTA />
    </div>
  );
}
