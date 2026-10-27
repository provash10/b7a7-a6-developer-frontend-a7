import { ArrowRight, Code2, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 border-t border-border/40 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
          <Sparkles className="size-3.5 text-primary animate-pulse" />
          <span>Ready to Transform Your Technical Hiring?</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto leading-tight">
          Start Evaluating Candidates with Verified Code Precision Today
        </h2>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Join thousands of tech companies and forward-thinking recruiters who save hundreds of hours while finding outstanding engineers.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-11 px-7 rounded-lg font-semibold gap-2 shadow-sm"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Launch Free Assessment Demo
            <ArrowRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-11 px-6 rounded-lg font-medium gap-2"
            render={<Link href="/pricing" />}
            nativeButton={false}
          >
            View Transparent Pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
