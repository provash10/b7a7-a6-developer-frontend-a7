import { LogIn, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingCTA() {
  // console.log("pricing cta rendered");
  return (
    <section className="relative overflow-hidden py-16 md:py-20 border-t border-border/80 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-4xl rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-blue-500/10 p-8 sm:p-12 text-center shadow-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Ready to Screen Top Engineers?</span>
          </div>

          <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Start Your First Code Assessment for Free
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            No credit card or payment upfront required. Sign up in seconds or
            use our One-Click Demo Login to test the recruiter and candidate
            experience immediately.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-11 px-6 rounded-lg font-semibold gap-2 shadow-sm"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              <LogIn className="size-4" />
              Try One-Click Demo Login
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-11 px-6 rounded-lg font-medium gap-2"
              render={<Link href="/register" />}
              nativeButton={false}
            >
              <UserPlus className="size-4" />
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
