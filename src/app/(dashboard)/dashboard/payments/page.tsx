import {
  ChevronRight,
  CreditCard,
  ExternalLink,
  Home,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BillingDetailsCard,
  BillingSummaryCards,
  BuyCreditsButton,
  CertifiedBadgesGrid,
  PaymentHistoryTable,
} from "@/components/modules/candidate-payments";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payments, Invoices & Certified Badges | DevAssess",
  description:
    "Candidate payment history, tax invoices, and verified skill badges download.",
};

export const instant = false;

export default function CandidatePaymentsPage() {
  // console.log("candidate payments and invoices page rendered");

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
          <CreditCard className="size-3.5 text-primary" />
          <span>payments & certifications</span>
        </span>
      </nav>

      {/* page header with fast upgrade link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            payments & certified credentials
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            manage your candidate assessment membership, download official pdf
            invoices, and export verified skill badges for github and linkedin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <BuyCreditsButton />
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs",
            )}
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>view pricing plans</span>
            <ExternalLink className="size-3 opacity-60" />
          </Link>
        </div>
      </div>

      {/* 1. summary stat cards */}
      <BillingSummaryCards />

      {/* 2. certified badges & download grid */}
      <CertifiedBadgesGrid />

      {/* 3. payment history & pdf invoices table */}
      <PaymentHistoryTable />

      {/* 4. saved payment methods & recipient details */}
      <BillingDetailsCard />
    </div>
  );
}
