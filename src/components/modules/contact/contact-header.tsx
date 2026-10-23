import { Sparkles } from "lucide-react";

export default function ContactHeader() {
  // console.log("contact header rendered");
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-20">
      {/* background glow accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[650px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="container mx-auto px-4 text-center">
        {/* badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
          <Sparkles className="size-3.5 animate-pulse text-primary" />
          <span>24/7 Technical Assessment Support</span>
        </div>

        {/* heading */}
        <h1 className="mt-5 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground max-w-3xl mx-auto leading-tight">
          Let&apos;s Build Better Technical{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Hiring Workflows
          </span>
        </h1>

        {/* description */}
        <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
          Need assistance with candidate attempts, anti-cheat proctoring, custom
          question banks, or bKash credit packages? Our engineering and support
          team is ready to assist you.
        </p>
      </div>
    </section>
  );
}
