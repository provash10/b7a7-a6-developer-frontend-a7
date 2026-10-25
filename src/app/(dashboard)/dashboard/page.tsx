import type { Metadata } from "next";
import { RoleAdaptiveDashboard } from "@/components/modules/candidate-dashboard/role-adaptive-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | DevAssess",
  description:
    "Track developer assessments, recruiter evaluations, and performance scores.",
};

export const instant = false;

export default function DashboardPage() {
  return <RoleAdaptiveDashboard />;
}
