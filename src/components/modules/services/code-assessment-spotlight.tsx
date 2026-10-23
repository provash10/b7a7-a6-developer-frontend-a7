import {
  BarChart3,
  Clock,
  Code2,
  Cpu,
  Layers,
  Mail,
  ShieldAlert,
  TerminalSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const assessmentFeatures = [
  {
    icon: TerminalSquare,
    title: "Multi-Language Isolated Sandbox",
    description:
      "Execute candidate code in secure Dockerized sandboxes supporting JavaScript, TypeScript, Python, C++, and Go with strict memory and execution time limits.",
    tag: "Execution Engine",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Layers,
    title: "Tri-Type Question Bank",
    description:
      "Support for complex CODING challenges with test cases, randomized technical MCQs, and architectural DESCRIPTIVE questions categorized by Easy, Medium, and Hard tiers.",
    tag: "Problem Bank",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: ShieldAlert,
    title: "Anti-Cheat Tab Blur Telemetry",
    description:
      "Real-time event logging captures browser window blurs, tab switching, and fullscreen departures, recording actionable antiCheatFlags for recruiters.",
    tag: "Proctoring Integrity",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Clock,
    title: "Enforced Timed Assessments",
    description:
      "Custom duration limits with server-synchronized countdown timers. Automatic submission triggers instantly when duration expires to guarantee fairness.",
    tag: "Timed Attempts",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Mail,
    title: "Tokenized Email Invitations",
    description:
      "Recruiters send secure single-use invitation tokens via Nodemailer. Links feature strict expiry dates and one-click candidate onboarding.",
    tag: "Candidate Lifecycle",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    icon: BarChart3,
    title: "Dynamic Leaderboard & Analytics",
    description:
      "Real-time candidate scoreboards ranking applicants by total score, pass/fail status, execution benchmark speeds, and anti-cheat event counts.",
    tag: "Recruiter Suite",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
];

const backendCapabilities = [
  { label: "Question Formats", value: "CODING, MCQ, DESCRIPTIVE" },
  { label: "Difficulty Levels", value: "EASY, MEDIUM, HARD" },
  { label: "Verification Model", value: "Public & Hidden Test Cases" },
  { label: "Anti-Cheat Flags", value: "Window Blur & Tab Switch" },
  { label: "Grading Engine", value: "Pass Marks & Auto-Verdict" },
  { label: "Invitation Tokens", value: "Redis/DB Expiring Hashes" },
];

export default function CodeAssessmentSpotlight() {
  return (
    <section id="code-assessment" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-primary border-primary/30 bg-primary/5"
          >
            <Code2 className="size-3.5" />
            Core Feature Spotlight
          </Badge>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Industrial-Grade Code Assessment Platform
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Built directly on top of our high-concurrency Node.js & Prisma
            backend to deliver bulletproof evaluations for developers and
            recruitment teams.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {assessmentFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-lg ${feature.bgColor}`}>
                      <Icon className={`size-5 ${feature.color}`} />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                      {feature.tag}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Backend Architectural Spec Bar */}
        <div className="mt-16 rounded-2xl border border-border/80 bg-muted/30 p-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <Cpu className="size-4" />
                Backend Integration Specs
              </div>
              <h3 className="mt-1 text-xl font-bold text-foreground">
                Engineered for High Precision & Reliability
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Matches the exact data schemas from our PostgreSQL, Prisma ORM,
                and Redis cache layer.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:w-auto">
              {backendCapabilities.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border/60 bg-background/80 p-3 shadow-2xs"
                >
                  <span className="block text-[11px] text-muted-foreground font-medium">
                    {item.label}
                  </span>
                  <span className="block text-xs font-semibold text-foreground mt-0.5">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
