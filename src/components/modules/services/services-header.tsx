import {
  ArrowRight,
  Code2,
  ShieldAlert,
  Sparkles,
  Terminal,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ServicesHeader() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-1/3 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="container mx-auto px-4 text-center">
        {/* Top Badges */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary shadow-xs">
          <Sparkles className="size-3.5 animate-pulse text-primary" />
          <span>DevAssess Enterprise Solutions & Features</span>
        </div>

        {/* Main Heading */}
        <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground max-w-4xl mx-auto leading-tight">
          Comprehensive Technical Screening &{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Code Assessment
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
          Empower recruiters and engineering leaders to evaluate software
          engineers through timed coding sandboxes, automated testcase grading,
          anti-cheat telemetry, and real-time candidate leaderboards.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-11 px-6 rounded-lg shadow-sm font-semibold gap-2"
            render={<Link href="#code-assessment" />}
            nativeButton={false}
          >
            Explore Code Assessment
            <ArrowRight className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-11 px-6 rounded-lg font-medium gap-2"
            render={<Link href="#interactive-demo" />}
            nativeButton={false}
          >
            <Terminal className="size-4 text-primary" />
            Try Live Sandbox
          </Button>
        </div>

        {/* Service Pill Shortcuts */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#code-assessment"
            className="flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <Code2 className="size-3.5 text-primary" />
            <span>1. Code Assessment Engine (Active)</span>
          </a>
          <a
            href="#live-interview"
            className="flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-blue-500/50 hover:text-foreground"
          >
            <Video className="size-3.5 text-blue-500" />
            <span>2. Live Technical Interview</span>
          </a>
          <a
            href="#ai-scoring"
            className="flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:border-indigo-500/50 hover:text-foreground"
          >
            <ShieldAlert className="size-3.5 text-indigo-500" />
            <span>3. AI Scoring & Anti-Cheat Proctoring</span>
          </a>
        </div>
      </div>
    </section>
  );
}
