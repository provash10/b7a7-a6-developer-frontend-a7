import Link from "next/link";
import {
  Code2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  Play,
  FileCode,
  Flame,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Candidate Dashboard | DevAssess",
  description:
    "Track your developer assessments, coding challenges, and evaluation scores.",
};

const STATS = [
  {
    title: "Active Assessment",
    value: "1",
    subtitle: "Due in 48 hours",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Completed Tests",
    value: "3",
    subtitle: "All evaluated",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Average Score",
    value: "91.3%",
    subtitle: "Top 8% percentile",
    icon: Award,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    title: "Coding Streak",
    value: "5 Days",
    subtitle: "18.5 total test hours",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
];

const ACTIVE_ASSESSMENT = {
  id: "asst-9402",
  title: "Full Stack Next.js & TypeScript Challenge",
  company: "TechCorp Labs",
  duration: "90 Minutes",
  deadline: "Oct 25, 2026 • 11:59 PM",
  skills: ["Next.js 15", "TypeScript", "Tailwind CSS", "API Route Handlers"],
  difficulty: "Intermediate",
  status: "Ready to Start",
  description:
    "Build a real-time reactive task board with optimistic updates and type-safe schema validation. Evaluated on code structure, test coverage, and API design.",
};

const RECENT_ASSESSMENTS = [
  {
    id: "asst-8210",
    title: "Data Structures & Algorithmic Problem Solving",
    company: "Algorithmix Systems",
    date: "Oct 19, 2026",
    score: 95,
    status: "Passed",
    verdict: "Excellent Performance",
    skills: ["Python", "Dynamic Programming", "Trees & Graphs"],
  },
  {
    id: "asst-7840",
    title: "Frontend Engineering & Component Architecture",
    company: "PixelCraft Studio",
    date: "Oct 12, 2026",
    score: 88,
    status: "Passed",
    verdict: "Strong UI/UX Architecture",
    skills: ["React 19", "State Management", "Accessibility"],
  },
  {
    id: "asst-6520",
    title: "Backend REST API & Database Optimization",
    company: "CloudScale Infotech",
    date: "Sep 28, 2026",
    score: 91,
    status: "Passed",
    verdict: "Robust Data Modelling",
    skills: ["PostgreSQL", "Node.js", "Redis Caching"],
  },
];

export default function CandidateDashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            Developer Assessment Hub
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You have{" "}
            <span className="font-semibold text-foreground">
              1 active challenge
            </span>{" "}
            waiting for submission and{" "}
            <span className="font-semibold text-foreground">
              3 verified certifications
            </span>{" "}
            completed. Track your technical evaluations and test performance
            below.
          </p>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-border/80 bg-card/60 backdrop-blur-xs"
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {stat.subtitle}
                  </p>
                </div>
                <div
                  className={`size-12 rounded-xl flex items-center justify-center border ${stat.bg}`}
                >
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Assessment Feature Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-amber-500" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              Active Assessment Invitation
            </h2>
          </div>
          <Badge variant="amber" className="text-xs font-medium">
            Pending Action
          </Badge>
        </div>

        <Card className="border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-card/50 overflow-hidden shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Invited by {ACTIVE_ASSESSMENT.company}
                </p>
                <CardTitle className="text-xl mt-1">
                  {ACTIVE_ASSESSMENT.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ⏱️ {ACTIVE_ASSESSMENT.duration}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {ACTIVE_ASSESSMENT.difficulty}
                </Badge>
              </div>
            </div>
            <CardDescription className="text-sm mt-2 leading-relaxed">
              {ACTIVE_ASSESSMENT.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {ACTIVE_ASSESSMENT.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-muted text-muted-foreground border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              <span>
                Deadline:{" "}
                <strong className="text-foreground">
                  {ACTIVE_ASSESSMENT.deadline}
                </strong>
              </span>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 border-t border-border/60 py-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Once started, the assessment timer will run continuously.
            </p>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                variant="default"
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium gap-2 text-xs h-9 px-4"
              >
                <Play className="size-3.5 fill-current" />
                Launch Assessment Playground
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Completed Assessments History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              Assessment History & Scores
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            3 Completed & Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECENT_ASSESSMENTS.map((test) => (
            <Card
              key={test.id}
              className="border-border/80 bg-card hover:border-primary/40 transition-colors flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] text-muted-foreground">
                    {test.company}
                  </span>
                  <Badge
                    variant="success"
                    className="text-[10px] py-0 px-2 font-mono"
                  >
                    Score {test.score}%
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold leading-snug line-clamp-2">
                  {test.title}
                </CardTitle>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  ✓ {test.verdict}
                </p>
              </CardHeader>

              <CardContent className="px-5 py-2 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {test.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3" /> Completed on {test.date}
                </p>
              </CardContent>

              <CardFooter className="p-5 pt-3 border-t border-border/50">
                <button
                  type="button"
                  className="w-full text-xs font-semibold text-primary hover:text-primary/80 flex items-center justify-between py-1 transition-colors"
                >
                  <span>View Detailed Evaluation</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Link
          href="/dashboard/profile"
          className="group block p-5 rounded-xl border border-border bg-card/50 hover:bg-muted/40 hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                Update Developer Profile
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage your bio, GitHub portfolio, and preferred tech stack.
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          href="/dashboard/payments"
          className="group block p-5 rounded-xl border border-border bg-card/50 hover:bg-muted/40 hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                Payment & Certification History
              </h3>
              <p className="text-xs text-muted-foreground">
                View billing transactions, pro tier access, and downloaded
                certificates.
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );
}
