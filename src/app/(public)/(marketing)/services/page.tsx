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
  // console.log("services page rendered");
  return (
    <div className="flex flex-col min-h-screen">
      {/* hero & services showcase */}
      <ServicesHeader />

      {/* code assessment deep spotlight (requested core feature) */}
      <CodeAssessmentSpotlight />

      {/* live interactive sandbox / candidate test environment simulator */}
      <CodeAssessmentSandbox />

      {/* -step recruiter to candidate assessment lifecycle */}
      <AssessmentWorkflow />

      {/* overview of platform pillars: code assessment, live interview, ai scoring */}
      <ServicesOverview />

      {/* service faqs */}
      <ServicesFAQ />

      {/* conversion & action banner */}
      <ServicesCTA />
    </div>
  );
}
