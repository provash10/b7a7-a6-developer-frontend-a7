import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCode,
  Home,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RecruiterEvaluationsView } from "@/components/modules/recruiter-evaluations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Candidate Evaluations & Review Queue | DevAssess Recruiter",
  description:
    "Review candidate code submissions, inspect test execution metrics, and update hiring decision verdicts.",
};

export default function RecruiterEvaluationsPage() {
  // console.log("recruiter page rendered");

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
        <span className="flex items-center gap-1 text-primary font-medium">
          <ClipboardCheck className="size-3.5" />
          <span>recruiter portal</span>
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">evaluation tasks</span>
      </nav>

      {/* header with quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              candidate evaluation & scoring queue
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-primary/30 text-primary"
            >
              recruiter console
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            inspect developer code solutions, review automated test case
            benchmarks, audit anti-cheat heuristics, and submit final candidate
            verdicts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/services">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <FileCode className="size-3.5 text-primary" />
              <span>browse challenges</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>my overview</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* recruiter evaluations coordinator */}
      <RecruiterEvaluationsView />
    </div>
  );
}
