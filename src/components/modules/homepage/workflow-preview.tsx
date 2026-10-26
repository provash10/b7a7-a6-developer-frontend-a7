"use client";

import {
  ArrowRight,
  CheckCircle,
  Clock,
  Code2,
  FileText,
  Mail,
  Send,
  Sparkles,
  Trophy,
} from "lucide-react";

export function WorkflowPreview() {
  const steps = [
    {
      step: "01",
      icon: FileText,
      title: "Pick or Author Challenges",
      description:
        "Select from our curated library of real-world frontend, backend, and algorithm challenges, or write your own custom test cases.",
      tag: "Recruiter / Lead",
    },
    {
      step: "02",
      icon: Send,
      title: "Send Instant Magic Links",
      description:
        "Invite candidates with a single click. Candidates receive a secured token link with automatic countdown timers and proctoring guidelines.",
      tag: "Direct Delivery",
    },
    {
      step: "03",
      icon: Code2,
      title: "Candidate Codes in Real Time",
      description:
        "Candidates solve tests inside an in-browser IDE with instant test feedback, syntax highlighting, and background proctoring telemetry.",
      tag: "Sandbox IDE",
    },
    {
      step: "04",
      icon: Trophy,
      title: "Automated Review & Hiring",
      description:
        "Recruiters receive a full breakdown of passing test cases, execution memory/speed, diff playback, and make decisions with confidence.",
      tag: "Deterministic Score",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-muted/40 border-y border-border/70 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Seamless Recruitment Workflow</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            From Invitation to Hire in 4 Simple Steps
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Replace tedious take-home assignments and manual reviews with an automated, objective evaluation pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading text-2xl font-black text-primary/40">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {item.tag}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/10 text-primary inline-flex mb-4">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="font-heading text-base font-bold text-foreground mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background border border-border text-muted-foreground">
                    <ArrowRight className="size-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
