import { Compass, Eye, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";

export function AboutMissionVision() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Target className="size-3.5" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Our Mission &amp; Vision
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            We are redefining how engineering teams identify true talent by shifting from subjective opinions to verified code competence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-8 md:p-10 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
            <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 p-3 text-primary mb-6">
              <Compass className="size-6" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To eliminate bias and administrative fatigue from technical hiring. We provide engineers with an honest, distraction-free environment to demonstrate problem-solving skills, and we arm engineering managers with accurate, automated analytics that reveal how a candidate actually thinks and writes code.
            </p>

            <div className="mt-8 space-y-3.5 border-t border-border/60 pt-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Zero Resume Gatekeeping</h4>
                  <p className="text-xs text-muted-foreground">Candidate qualifications are proven by actual test outputs and clean architecture, not buzzwords.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">20+ Hours Saved Per Position</h4>
                  <p className="text-xs text-muted-foreground">Automated grading eliminates repetitive phone screens and unstandardized take-home tasks.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="relative rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-background p-8 md:p-10 shadow-sm transition-all hover:border-emerald-500/40 hover:shadow-md">
            <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-emerald-500 mb-6">
              <Eye className="size-6" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To become the global standard for engineering skill verification. We envision a future where any developer in the world—regardless of university pedigree, geography, or background—can earn verified credentials that fast-track them to world-class software engineering roles.
            </p>

            <div className="mt-8 space-y-3.5 border-t border-border/60 pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Universal Code Credentialing</h4>
                  <p className="text-xs text-muted-foreground">Portable verified scorecards and badges that candidates carry into every job application.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="size-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Real-World Problem Stacks</h4>
                  <p className="text-xs text-muted-foreground">Focusing on modern microservices, database schemas, and clean frontend UX rather than obscure trivia.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
