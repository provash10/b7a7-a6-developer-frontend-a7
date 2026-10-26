"use client";

import { CheckCircle2, ShieldCheck, Terminal, Users } from "lucide-react";

export function StatsBar() {
  const stats = [
    {
      icon: Terminal,
      value: "50,000+",
      label: "Code Evaluations Run",
      detail: "Deterministic sandboxed test suites",
    },
    {
      icon: Users,
      value: "1,200+",
      label: "Engineering Teams",
      detail: "From startups to tech enterprises",
    },
    {
      icon: ShieldCheck,
      value: "99.8%",
      label: "Proctoring Integrity",
      detail: "Anti-cheat telemetry & focus tracking",
    },
    {
      icon: CheckCircle2,
      value: "< 1.8s",
      label: "Average Test Execution",
      detail: "Sub-second micro-container boot",
    },
  ];

  return (
    <section className="border-y border-border/60 bg-muted/30 py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl hover:bg-card/60 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary mb-3">
                  <Icon className="size-5" />
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground/90 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {stat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
