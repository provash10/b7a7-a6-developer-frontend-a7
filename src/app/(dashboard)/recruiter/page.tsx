import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileCode,
  Home,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RecruiterEvaluationsView } from "@/components/modules/recruiter-evaluations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Recruiter Portal | DevAssess",
  description:
    "Review candidate code submissions, inspect test execution metrics, and update hiring decision verdicts.",
};

export const instant = false;

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
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="flex items-center gap-1 text-primary font-medium">
          <ClipboardCheck className="size-3.5" />
          <span>Recruiter Portal</span>
        </span>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Evaluation Tasks</span>
      </nav>

      {/* header with quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Candidate Evaluation & Scoring Queue
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-primary/30 text-primary uppercase"
            >
              Recruiter Console
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Inspect developer code solutions, review automated test case
            benchmarks, audit anti-cheat heuristics, and submit final candidate
            verdicts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/payments">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <CreditCard className="size-3.5 text-primary" />
              <span>Payments & Invoices</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium hover:border-border hover:bg-muted/70 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <FileCode className="size-3.5 text-primary" />
              <span>Browse Challenges</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium hover:border-border hover:bg-muted/70 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>My Overview</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* recruiter evaluations coordinator */}
      <RecruiterEvaluationsView />
    </div>
  );
}
