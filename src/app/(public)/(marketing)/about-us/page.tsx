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
      {/* hero header */}
      <AboutHeader />

      {/* verified metrics / key platform stats */}
      <AboutStats />

      {/* mission & vision sections */}
      <AboutMissionVision />

      {/* core engineering values & architectural pillars */}
      <AboutValues />

      {/* how the evaluation flow works */}
      <AboutArchitecture />

      {/* engineering & leadership team */}
      <AboutTeam />

      {/* bottom conversion cta */}
      <AboutCTA />
    </div>
  );
}
