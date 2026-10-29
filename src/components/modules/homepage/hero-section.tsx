"use client";

import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Cpu,
  FileCode2,
  Play,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* ambient radiant glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-gradient-to-tr from-primary/20 via-pink-500/15 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-1/3 -right-24 size-[400px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* left column: headline, subhead, ctas */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* badge pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="size-2 rounded-full bg-primary animate-ping" />
              <span>Next-Gen Technical Hiring & Code Evaluation</span>
            </div>

            {/* main headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Evaluate Developer Talent with{" "}
              <span className="bg-gradient-to-r from-primary via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Real-World Code Challenges
              </span>
            </h1>

            {/* subhead */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Empower engineering teams to hire with confidence. Fast, browser-based IDEs, multi-language Docker execution, tokenized email invitations, and real-time anti-cheat proctoring.
            </p>

            {/* action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/services#code-assessment" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2.5 h-12 px-6 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Play className="size-4 fill-current" />
                  <span>Try Interactive Code Sandbox</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2 h-12 px-6 rounded-xl font-semibold text-sm hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                >
                  <Zap className="size-4 text-primary" />
                  <span>One-Click Demo Login</span>
                </Button>
              </Link>
            </div>

            {/* feature checkmarks */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 pt-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Docker Sandbox Execution</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Tokenized Email Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>bKash & Stripe Integration</span>
              </div>
            </div>
          </div>

          {/* right column: interactive d code editor showcase card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-primary/10">
              {/* editor header toolbar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-rose-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                    <Terminal className="size-3 text-primary" />
                    challenge_runner.ts
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                >
                  Live Sandbox
                </Badge>
              </div>

              {/* code preview */}
              <div className="pt-3 font-mono text-xs leading-relaxed text-foreground/90 space-y-1 overflow-x-auto">
                <p>
                  <span className="text-purple-500">export async function</span>{" "}
                  <span className="text-blue-500">evaluateCandidate</span>(
                  <span className="text-orange-500">code</span>:{" "}
                  <span className="text-amber-500">string</span>
                  ) &#123;
                </p>
                <p className="pl-4 text-muted-foreground">
                  // Run in isolated micro-container
                </p>
                <p className="pl-4">
                  <span className="text-purple-500">const</span> sandbox ={" "}
                  <span className="text-purple-500">await</span>{" "}
                  DockerRunner.<span className="text-blue-500">spawn</span>(&#123;
                </p>
                <p className="pl-8">
                  runtime: <span className="text-emerald-500">&quot;nodejs-20&quot;</span>,
                </p>
                <p className="pl-8">timeoutMs: <span className="text-amber-500">5000</span>,</p>
                <p className="pl-8">memoryLimit: <span className="text-amber-500">256MB</span>,</p>
                <p className="pl-4">&#125;);</p>
                <p className="pl-4">
                  <span className="text-purple-500">const</span> result ={" "}
                  <span className="text-purple-500">await</span> sandbox.
                  <span className="text-blue-500">executeTests</span>(code);
                </p>
                <p className="pl-4">
                  <span className="text-purple-500">return</span> result;
                </p>
                <p>&#125;</p>
              </div>

              {/* simulated test output bar */}
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    16/16 Test Cases Passed
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  142ms runtime
                </span>
              </div>

              {/* proctoring badge banner */}
              <div className="mt-2.5 rounded-xl border border-border/60 bg-muted/30 p-2.5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Shield className="size-3.5 text-primary" />
                  <span>Proctoring Telemetry:</span>
                  <span className="font-semibold text-foreground">Clean</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-primary">
                  Verified Candidate
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
