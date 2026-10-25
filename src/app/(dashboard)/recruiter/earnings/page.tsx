import { ChevronRight, ClipboardCheck, Home, ListOrdered } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RecruiterEarningsView } from "@/components/modules/recruiter-earnings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Recruiter Earnings & Payouts | DevAssess",
  description:
    "Track your developer assessment review earnings, itemized payout ledger, and monthly revenue analytics.",
};

export default function RecruiterEarningsPage() {
  // console.log("recruiter earnings page rendered");

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
          earnings & analytics
        </span>
      </nav>

      {/* header with quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              evaluator compensation & revenue analytics
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-emerald-500/30 text-emerald-500"
            >
              payouts v2.1
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            track your code evaluation compensation, review monthly earnings
            velocity, and withdraw cleared funds directly to your stripe express
            or bank account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/recruiter">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ListOrdered className="size-3.5 text-primary" />
              <span>evaluation queue</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* recruiter earnings coordinator view */}
      <RecruiterEarningsView />
    </div>
  );
}
