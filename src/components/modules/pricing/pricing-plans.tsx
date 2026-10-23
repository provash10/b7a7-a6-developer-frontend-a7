"use client";

import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingPlans() {
  // console.log("pricing plans component loaded");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");

  const plans = [
    {
      id: "free",
      name: "Starter",
      badge: "Free Forever",
      badgeVariant: "secondary" as const,
      description:
        "Ideal for individual developers, student assessments, and trying out our automated sandbox.",
      price: {
        BDT: { monthly: 0, yearly: 0 },
        USD: { monthly: 0, yearly: 0 },
      },
      periodLabel: "forever",
      ctaText: "Get Started Free",
      ctaLink: "/register",
      ctaVariant: "outline" as const,
      popular: false,
      features: [
        "3 active assessments",
        "Up to 10 candidate invitations / month",
        "Standard question bank (coding & mcq)",
        "Automated public test case grading",
        "Basic window blur anti-cheat notice",
        "Standard web execution sandbox",
        "Community support & docs",
      ],
    },
    {
      id: "pro",
      name: "Professional",
      badge: "Most Popular",
      badgeVariant: "default" as const,
      description:
        "Engineered for fast-growing software companies and tech recruiters who need bulletproof assessments.",
      price: {
        BDT: { monthly: 4999, yearly: 3999 },
        USD: { monthly: 49, yearly: 39 },
      },
      periodLabel:
        billingCycle === "yearly" ? "month (billed annually)" : "month",
      ctaText: "Upgrade to Pro",
      ctaLink: "/register",
      ctaVariant: "default" as const,
      popular: true,
      features: [
        "Unlimited active assessments",
        "200 candidate invitations / month included",
        "Complete tri-type question bank (coding, mcq, descriptive)",
        "Hidden stress test cases & execution timing",
        "Full anti-cheat telemetry (tab switch flag counters)",
        "Real-time candidate leaderboard & ranking",
        "Custom pass marks & automated certificate verdicts",
        "Instant bkash & card tokenized checkout",
        "Priority 15-minute exam desk support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      badge: "Full Scale",
      badgeVariant: "outline" as const,
      description:
        "Dedicated infrastructure for large enterprises and campus recruiting drives requiring custom proctoring.",
      price: {
        BDT: { monthly: 14999, yearly: 11999 },
        USD: { monthly: 149, yearly: 119 },
      },
      periodLabel:
        billingCycle === "yearly" ? "month (billed annually)" : "month",
      ctaText: "Contact Sales",
      ctaLink: "/contact",
      ctaVariant: "outline" as const,
      popular: false,
      features: [
        "Everything in professional plan",
        "Unlimited candidate invitations & bulk csv upload",
        "Live technical pair-programming interview suite",
        "Dedicated isolated docker sandbox with custom cpu limits",
        "Custom problem bank curated by senior engineers",
        "Advanced plagiarism detection & code similarity audit",
        "Role-based access control (admin, recruiter, evaluator)",
        "Custom sso, webhooks & ats api integration",
        "Dedicated account manager & 99.9% uptime sla",
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* controls bar: billing cycle & currency toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-14">
          {/* monthly vs yearly switch */}
          <div className="inline-flex items-center rounded-xl border border-border/80 bg-muted/40 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                // console.log("switched billing cycle to monthly");
                setBillingCycle("monthly");
              }}
              className={`rounded-lg px-4 py-2 transition-all ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => {
                // console.log("switched billing cycle to yearly");
                setBillingCycle("yearly");
              }}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 transition-all ${
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Save 20%
              </span>
            </button>
          </div>

          {/* currency switch: bdt / usd */}
          <div className="inline-flex items-center rounded-xl border border-border/80 bg-muted/40 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                // console.log("switched currency to bdt");
                setCurrency("BDT");
              }}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                currency === "BDT"
                  ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              BDT (৳ bKash)
            </button>
            <button
              type="button"
              onClick={() => {
                // console.log("switched currency to usd");
                setCurrency("USD");
              }}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                currency === "USD"
                  ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              USD ($ Stripe)
            </button>
          </div>
        </div>

        {/* pricing cards 3-column grid */}
        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan) => {
            const currentPrice = plan.price[currency][billingCycle];
            const currencySymbol = currency === "BDT" ? "৳" : "$";

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-primary bg-card shadow-lg ring-1 ring-primary/40 lg:-translate-y-2"
                    : "border-border/80 bg-card hover:border-primary/40"
                }`}
              >
                {/* popular plan top pill banner */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-blue-600 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                      <Sparkles className="size-3" />
                      Most Popular Plan
                    </span>
                  </div>
                )}

                <div>
                  <CardHeader className="p-7 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold text-foreground">
                        {plan.name}
                      </CardTitle>
                      <Badge variant={plan.badgeVariant}>{plan.badge}</Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-2 min-h-[40px] leading-relaxed">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-7 pt-2">
                    {/* price tag */}
                    <div className="flex items-baseline gap-1 py-4 border-y border-border/50">
                      <span className="text-4xl font-extrabold tracking-tight text-foreground">
                        {currentPrice === 0
                          ? "Free"
                          : `${currencySymbol}${currentPrice.toLocaleString()}`}
                      </span>
                      {currentPrice > 0 && (
                        <span className="text-xs text-muted-foreground font-medium">
                          / {plan.periodLabel}
                        </span>
                      )}
                    </div>

                    {/* features checklist */}
                    <div className="mt-6 space-y-3">
                      <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
                        Included in this plan:
                      </span>
                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5"
                          >
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                            <span className="leading-normal">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>

                {/* card footer button */}
                <CardFooter className="p-7 pt-0 border-t border-border/50 mt-6">
                  <Button
                    variant={plan.ctaVariant}
                    className={`w-full h-11 rounded-xl font-semibold gap-2 shadow-xs group ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : ""
                    }`}
                    render={<Link href={plan.ctaLink} />}
                    nativeButton={false}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* payment methods notice bar */}
        <div className="mt-14 rounded-2xl border border-border/80 bg-muted/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Zap className="size-4" />
            </div>
            <div>
              <span className="font-semibold text-foreground block">
                Instant Credit Activation via bKash & Cards
              </span>
              <span>
                Assessment quotas deposit immediately to your recruiter account
                upon checkout.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-semibold text-foreground">
            <span className="rounded-md border border-border/80 bg-background px-2.5 py-1 text-[11px]">
              bKash Tokenized
            </span>
            <span className="rounded-md border border-border/80 bg-background px-2.5 py-1 text-[11px]">
              Visa / MasterCard
            </span>
            <span className="rounded-md border border-border/80 bg-background px-2.5 py-1 text-[11px]">
              SSLCommerz / Stripe
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
