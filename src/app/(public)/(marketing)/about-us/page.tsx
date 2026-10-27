import type { Metadata } from "next";
import {
  AboutArchitecture,
  AboutCTA,
  AboutHeader,
  AboutMissionVision,
  AboutStats,
  AboutTeam,
  AboutValues,
} from "@/components/modules/aboutus";

export const metadata: Metadata = {
  title: "About Us & Mission | DevAssess Developer Evaluation Platform",
  description:
    "Learn how DevAssess is revolutionizing technical recruitment with fair, transparent, and code-proven developer assessments and automated sandbox grading.",
  openGraph: {
    title: "About Us & Mission | DevAssess",
    description:
      "Transforming software engineering hiring through objective code benchmarks, Docker sandbox execution, and anti-cheat telemetry.",
  },
};

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <AboutHeader />

      {/* Verified Metrics / Key Platform Stats */}
      <AboutStats />

      {/* Mission & Vision Sections */}
      <AboutMissionVision />

      {/* Core Engineering Values & Architectural Pillars */}
      <AboutValues />

      {/* How the Evaluation Flow Works */}
      <AboutArchitecture />

      {/* Engineering & Leadership Team */}
      <AboutTeam />

      {/* Bottom Conversion CTA */}
      <AboutCTA />
    </div>
  );
}
