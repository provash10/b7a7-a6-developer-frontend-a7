import {
  Cpu,
  Layers,
  Lock,
  Scale,
  ShieldAlert,
  Sparkles,
  Terminal,
  Users2,
} from "lucide-react";

const CORE_VALUES = [
  {
    icon: Scale,
    title: "Radical Fairness & Objectivity",
    description:
      "Every candidate is graded against the exact same deterministic test suite and algorithmic constraints under identical conditions.",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Lock,
    title: "Anti-Cheat & Proctoring Integrity",
    description:
      "Telemetry checks monitor tab switching, external pastes, and unusual pacing to preserve fairness for all honest participants.",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Terminal,
    title: "Real Code Execution Environment",
    description:
      "Interactive multi-language runner supports JavaScript, TypeScript, Python, and SQL with real runtime feedback and error outputs.",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Cpu,
    title: "Speed, Security & Container Isolation",
    description:
      "Sub-second compilation and test runner execution inside isolated, hardened sandboxes preventing malicious injections.",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Users2,
    title: "Dual-Sided Empathy",
    description:
      "Engineered for both the recruiter who needs clear hiring verdicts and the candidate who deserves an enjoyable, responsive exam interface.",
    color: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  },
  {
    icon: Sparkles,
    title: "Continuous Innovation",
    description:
      "Constantly refreshing our verified question bank with modern paradigms like Next.js App Router, concurrency patterns, and microservices.",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
];

export function AboutValues() {
  return (
    <section className="py-16 md:py-24 bg-card/30 border-y border-border/40">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Layers className="size-3.5" />
            <span>What Drives Us</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Our Core Values &amp; Architectural Pillars
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Built from the ground up to solve the most painful inefficiencies in modern tech screening.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div
                  className={`inline-flex items-center justify-center rounded-lg border p-2.5 mb-4 ${val.color}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {val.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
