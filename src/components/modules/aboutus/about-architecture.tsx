import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCheck2,
  Send,
  Shield,
  Zap,
} from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Curate or Pick Assessment",
    description:
      "Recruiters select from vetted challenges or customize passing marks, allowed languages, and candidate turnaround timers.",
    icon: Send,
    badge: "Recruiter Portal",
  },
  {
    step: "02",
    title: "Sandboxed Timed Attempt",
    description:
      "Candidates code in a full-featured browser IDE with instant test runner feedback, syntax highlighting, and auto-save state.",
    icon: Code2,
    badge: "Candidate Experience",
  },
  {
    step: "03",
    title: "Proctoring & Test Execution",
    description:
      "Our backend tests against public and hidden edge cases while telemetry tracks tab-focus swaps and copy-paste flags.",
    icon: Shield,
    badge: "Anti-Cheat Guard",
  },
  {
    step: "04",
    title: "Instant Hiring Scorecard",
    description:
      "Both parties receive objective breakdown reports, performance percentiles, and verifiable digital completion badges.",
    icon: FileCheck2,
    badge: "Verified Verdict",
  },
];

export function AboutArchitecture() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Zap className="size-3.5" />
            <span>Workflow Engineering</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How DevAssess Delivers Unbiased Results
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            A seamless end-to-end evaluation cycle engineered for speed, accuracy, and fairness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-xl border border-border/70 bg-card p-6 flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-primary/40 font-mono">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5">
                      {item.badge}
                    </span>
                  </div>

                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center text-xs font-medium text-primary">
                  <CheckCircle2 className="size-3.5 mr-1 text-emerald-500" /> Fully Automated Flow
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
