import type { Metadata } from "next";
import {
  PricingComparisonTable,
  PricingCTA,
  PricingFAQ,
  PricingHeader,
  PricingPlans,
} from "@/components/modules/pricing";

export const metadata: Metadata = {
  title: "Subscription & Pricing Plans | DevAssess",
  description:
    "Explore transparent pricing plans for DevAssess. Choose between Starter, Professional, and Enterprise plans with bKash and card checkout.",
  openGraph: {
    title: "Subscription & Pricing Plans | DevAssess",
    description:
      "Affordable technical assessment plans featuring automated test cases, anti-cheat proctoring, and recruiter leaderboards.",
  },
};

export default function PricingPage() {
  // console.log("pricing page rendered");
  return (
    <div className="flex flex-col min-h-screen">
      {/* pricing hero header */}
      <PricingHeader />

      {/* interactive pricing cards with monthly / annual and bdt / usd toggles */}
      <PricingPlans />

      {/* comprehensive plan comparison matrix */}
      <PricingComparisonTable />

      {/* billing and credit faqs */}
      <PricingFAQ />

      {/* bottom conversion call to action */}
      <PricingCTA />
    </div>
  );
}
