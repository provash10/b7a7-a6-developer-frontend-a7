import {
  ChevronRight,
  ClipboardCheck,
  DollarSign,
  Home,
  ListOrdered,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RecruiterProfileView } from "@/components/modules/recruiter-profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Recruiter Profile & Availability | DevAssess",
  description:
    "Manage evaluator technical credentials, primary skill domains, daily evaluation limits, and turnaround SLA availability.",
};

export default function RecruiterProfilePage() {
  // console.log("recruiter profile page rendered");

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
          href="/recruiter"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ClipboardCheck className="size-3.5 text-primary" />
          <span>recruiter portal</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">
          profile & availability
        </span>
      </nav>

      {/* header with quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              evaluator profile & availability
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-primary/30 text-primary"
            >
              evaluator v2.0
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            manage your technical evaluation credentials, primary assessment
            skill domains, daily review quotas, and turnaround SLA targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/recruiter">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ListOrdered className="size-3.5 text-primary" />
              <span>evaluation queue</span>
            </Button>
          </Link>
          <Link href="/recruiter/earnings">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <DollarSign className="size-3.5 text-emerald-500" />
              <span>earnings</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* evaluator profile coordinator */}
      <RecruiterProfileView />
    </div>
  );
}
