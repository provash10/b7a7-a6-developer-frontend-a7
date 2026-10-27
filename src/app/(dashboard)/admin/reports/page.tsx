import { Suspense } from "react";
import {
  ChevronRight,
  FileSpreadsheet,
  Home,
  Loader2,
  Shield,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminReportsView } from "@/components/modules/admin-reports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Audit Logs, Reports & System Settings | DevAssess Admin",
  description:
    "Immutable security audit logs, compliance report downloads, and system configuration safeguards for DevAssess platform administrators.",
};

export const instant = false;

export default function AdminReportsPage() {
  // console.log("admin reports page rendered");

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
        <Link
          href="/admin"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Shield className="size-3.5 text-primary" />
          <span>admin console</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">
          audit logs & reports
        </span>
      </nav>

      {/* header with quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              audit logs & system controls
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-emerald-500/30 text-emerald-500"
            >
              compliance v1.4
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            review immutable security audit events, download automated candidate
            scorecards and plagiarism reports, and fine-tune execution sandbox
            settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/manage">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Users className="size-3.5 text-primary" />
              <span>manage users</span>
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <FileSpreadsheet className="size-3.5 text-emerald-500" />
              <span>analytics</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* admin reports view coordinator wrapped in Suspense */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-xs font-medium">Loading reports & audit logs...</span>
          </div>
        }
      >
        <AdminReportsView />
      </Suspense>
    </div>
  );
}
