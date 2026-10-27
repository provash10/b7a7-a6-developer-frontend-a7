import { ArrowRight, Code2, Globe2, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutHeader() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-24">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-96 w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-12 top-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="container mx-auto px-4 max-w-6xl text-center">
        {/* badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
          <Sparkles className="size-3.5 text-primary animate-pulse" />
          <span>The Next-Generation Developer Assessment Platform</span>
        </div>

        {/* heading */}
        <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          Pioneering Fair, Transparent &amp;{" "}
          <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-400 bg-clip-text text-transparent">
            Code-Proven
          </span>{" "}
          Technical Hiring
        </h1>

        {/* description */}
        <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
          DevAssess was born out of a simple observation: traditional resume screening and whiteboarding fail to measure real engineering capability. We built a sandboxed, automated code evaluation platform that lets developers demonstrate their real-world skills while empowering companies to hire with objective confidence.
        </p>

        {/* actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-11 px-6 rounded-lg shadow-sm font-semibold gap-2"
            render={<Link href="/services" />}
            nativeButton={false}
          >
            Explore Platform Features
            <ArrowRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-11 px-6 rounded-lg font-medium gap-2"
            render={<Link href="/contact" />}
            nativeButton={false}
          >
            <Globe2 className="size-4 text-primary" />
            Talk With Our Engineering Team
          </Button>
        </div>

        {/* feature tags */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
            <Code2 className="size-3.5 text-primary" /> Real Sandbox Execution
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
            <Target className="size-3.5 text-emerald-500" /> Objective Algorithmic Benchmarks
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 backdrop-blur-xs">
            <Sparkles className="size-3.5 text-amber-500" /> Proactive Anti-Cheat Telemetry
          </span>
        </div>
      </div>
    </section>
  );
}
