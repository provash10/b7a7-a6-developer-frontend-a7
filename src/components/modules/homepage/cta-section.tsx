"use client";

import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-8 sm:p-14 lg:p-16 shadow-2xl">
          {/* ambient background glows */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-pink-500/15 blur-3xl" />

          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>Transform Your Technical Hiring Process Today</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Ready to Discover and Verify Exceptional Developers?
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join forward-thinking engineering managers and recruiters who rely on DevAssess for unbiased, sandboxed, and tamper-proof candidate screening.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/services#code-assessment" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Terminal className="size-4 mr-2" />
                  <span>Start Free Sandbox Test</span>
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-sm hover:bg-accent cursor-pointer"
                >
                  View Credit Pricing
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-6 pt-6 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>No Credit Card Required for Demo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                <span>Deterministic Docker Sandbox</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Instant bKash & Card Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
