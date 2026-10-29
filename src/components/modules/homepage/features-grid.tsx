"use client";

import {
  Code2,
  Cpu,
  CreditCard,
  Eye,
  FileCheck2,
  Lock,
  MailCheck,
  RotateCw,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FeaturesGrid() {
  const features = [
    {
      icon: Cpu,
      title: "Isolated Sandbox Runtimes",
      badge: "Docker Powered",
      description:
        "Execute candidate code in isolated, resource-constrained micro-containers. Supports JavaScript, TypeScript, Python, Go, and SQL with deterministic evaluation.",
      color: "from-blue-500/15 to-indigo-500/15 text-blue-500",
    },
    {
      icon: Eye,
      title: "Real-Time Anti-Cheat Proctoring",
      badge: "Telemetry Guard",
      description:
        "Track window blur events, paste detection, external key events, and code editing velocity. Maintain assessment integrity with detailed telemetry logs.",
      color: "from-amber-500/15 to-orange-500/15 text-amber-500",
    },
    {
      icon: MailCheck,
      title: "Tokenized Magic Invitations",
      badge: "Zero Friction",
      description:
        "Send candidates one-click secure invitation links via email. No lengthy signup required—candidates jump right into their timed test environment.",
      color: "from-emerald-500/15 to-teal-500/15 text-emerald-500",
    },
    {
      icon: FileCheck2,
      title: "Automated Grading & Test Suites",
      badge: "Instant Results",
      description:
        "Validate solutions against public and secret test cases instantly. Receive execution time, memory usage, code diffs, and calculated percentage scores.",
      color: "from-purple-500/15 to-pink-500/15 text-purple-500",
    },
    {
      icon: CreditCard,
      title: "Flexible Pay-As-You-Go Credits",
      badge: "bKash & Stripe",
      description:
        "Seamlessly purchase assessment credits via bKash or international cards. Transparent per-invitation pricing without expensive enterprise lock-ins.",
      color: "from-rose-500/15 to-red-500/15 text-rose-500",
    },
    {
      icon: Sparkles,
      title: "Role-Adaptive Dashboards",
      badge: "Multi-Persona",
      description:
        "Dedicated optimized workflows for Admins, Recruiters, and Candidates. Manage user permissions, challenge catalogs, and candidate evaluation queues.",
      color: "from-cyan-500/15 to-blue-500/15 text-cyan-500",
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* section heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Zap className="size-3.5" />
            <span>Built for Modern Tech Recruitment</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Everything You Need to Hire Top Engineers
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Eliminate resume guesswork. Measure genuine software engineering skills with our all-in-one assessment platform.
          </p>
        </div>

        {/* feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-border/80 bg-card p-7 shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} border border-border/40 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Learn more</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
