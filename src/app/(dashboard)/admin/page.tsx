import { ChevronRight, FileDown, FilePlus, Home, RefreshCw, Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminStatsOverview,
  AssessmentStatusChart,
  RecentSubmissionsTable,
  SystemHealthCard,
  UserGrowthChart,
  VerdictDistributionChart,
} from "@/components/modules/admin-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Analytics & Platform Overview | DevAssess",
  description:
    "Global admin overview, user registrations, and assessment evaluation analytics with Recharts.",
};

export const instant = false;

export default function AdminOverviewPage() {
  // console.log("admin overview and analytics page rendered");

  return (
    <div className="space-y-8 pb-12">
      {/* breadcrumb navigation */}
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="size-3.5" />
          <span>dashboard</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="flex items-center gap-1 font-medium text-foreground">
          <Shield className="size-3.5 text-primary" />
          <span>admin console</span>
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-muted-foreground">analytics & overview</span>
      </nav>

      {/* header with live status and quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              platform analytics & intelligence
            </h1>
            <Badge variant="default" className="text-[10px] font-mono">
              admin v2.4
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            cross-organization candidate growth, assessment verdicts, anti-cheat
            signals, and execution telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/admin/manage?tab=assessments">
            <Button size="xs" className="gap-1.5 text-xs bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-xs cursor-pointer">
              <FilePlus className="size-3.5" />
              <span>+ Create Assessment</span>
            </Button>
          </Link>
          <Button variant="outline" size="xs" className="gap-1.5 text-xs">
            <FileDown className="size-3.5 text-primary" />
            <span>export report</span>
          </Button>
          <Button variant="secondary" size="xs" className="gap-1.5 text-xs">
            <RefreshCw className="size-3.5 text-emerald-500" />
            <span>sync telemetry</span>
          </Button>
        </div>
      </div>

      {/* kpi stats overview */}
      <AdminStatsOverview />

      {/* visual charts: user growth + verdict donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>
        <div className="lg:col-span-1">
          <VerdictDistributionChart />
        </div>
      </div>

      {/* assessment domain & status volume chart */}
      <AssessmentStatusChart />

      {/* live candidate submissions stream */}
      <RecentSubmissionsTable />

      {/* infrastructure & judge engine telemetry */}
      <SystemHealthCard />
    </div>
  );
}
