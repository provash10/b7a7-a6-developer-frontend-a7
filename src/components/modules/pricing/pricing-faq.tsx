import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const pricingFaqs = [
  {
    q: "How does bKash payment processing work on DevAssess?",
    a: "We integrate directly with the official bKash Tokenized Checkout gateway. You can initiate a purchase directly in your recruiter dashboard, authorize securely with your bKash wallet, and assessment credits are immediately credited to your balance upon verification.",
  },
  {
    q: "Can I buy additional assessment credits on-demand without changing plans?",
    a: "Yes! If you are on the Professional plan and need more than 200 candidate invitations for an ongoing hiring sprint, you can purchase add-on credit bundles via bKash or card at any time.",
  },
  {
    q: "What happens if a candidate doesn't take the test before the invitation expires?",
    a: "Unused invitation tokens that expire without an attempt being initiated are credited back to your recruiter pool so you never lose quotas on no-show candidates.",
  },
  {
    q: "Can I cancel or switch my subscription at any time?",
    a: "Yes. You can switch between Monthly and Annual billing or cancel auto-renewal at any time from your billing settings. You will retain full access until the end of your paid billing cycle.",
  },
  {
    q: "Are there discounts for educational institutions or tech bootcamps?",
    a: "Yes! We offer up to 40% educational discounts for accredited universities, coding bootcamps, and non-profit student developer communities. Contact our sales team for verification.",
  },
];

export default function PricingFAQ() {
  // console.log("pricing faq section rendered");
  return (
    <section className="py-16 bg-background border-t border-border/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-primary border-primary/30 bg-primary/5"
          >
            <HelpCircle className="size-3.5" />
            Billing & Payment FAQ
          </Badge>
          <h2 className="mt-4 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Pricing Questions
          </h2>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            Common questions regarding assessment quotas, bKash checkout, and
            credit renewals.
          </p>
        </div>

        {/* faqs grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {pricingFaqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs space-y-2 hover:border-primary/40 transition-colors"
            >
              <h3 className="font-heading text-sm font-bold text-foreground">
                {faq.q}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
