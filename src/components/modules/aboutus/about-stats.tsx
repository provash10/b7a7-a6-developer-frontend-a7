import { Award, CheckCircle2, Clock, Users, Zap } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: "45,000+",
    label: "Candidates Evaluated",
    description: "Developers screened worldwide across 28+ tech stacks",
    accent: "from-blue-500/20 to-primary/5 text-primary border-primary/20",
  },
  {
    icon: CheckCircle2,
    value: "99.8%",
    label: "Sandbox Grading Accuracy",
    description: "Automated testcase validation with zero false positives",
    accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-500 border-emerald-500/20",
  },
  {
    icon: Clock,
    value: "70%",
    label: "Reduction in Time-to-Hire",
    description: "From 3 weeks down to 4 days for initial screening",
    accent: "from-amber-500/20 to-amber-500/5 text-amber-500 border-amber-500/20",
  },
  {
    icon: Award,
    value: "1,200+",
    label: "Certified Challenges",
    description: "Curated algorithmic, frontend, and backend benchmarks",
    accent: "from-purple-500/20 to-purple-500/5 text-purple-500 border-purple-500/20",
  },
];

export function AboutStats() {
  return (
    <section className="py-14 bg-card/40 border-b border-border/40">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Proven Scale &amp; Performance
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
            Trusted by Engineering Leaders &amp; Technical Recruiters
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-xl border border-border/70 bg-background/70 p-6 backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div
                  className={`inline-flex items-center justify-center rounded-lg border p-2.5 mb-4 bg-gradient-to-br ${stat.accent}`}
                >
                  <Icon className="size-5" />
                </div>
                <div className="text-3xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground">
                  {stat.label}
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
