"use client";

import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCode,
  Flame,
  Play,
  Shield,
  ClipboardCheck,
  XCircle,
  Sparkles,
  Building2,
  Zap,
  TrendingUp,
  Layers,
  Code2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { useGetMyProfile } from "@/hooks";
import { RecruiterEvaluationsView } from "@/components/modules/recruiter-evaluations";
import { AdminManageView } from "@/components/modules/admin-manage";
import { getCandidateInvitations } from "@/api/assessment.api";
import { getActiveUserEmail, getEffectiveRole } from "@/lib/session";

const CANDIDATE_STATS = [
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
    color: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
];

const ACTIVE_ASSESSMENT = {
  title: "Full Stack Next.js & TypeScript Challenge",
  company: "TechCorp Labs",
  duration: "90 Minutes",
  difficulty: "Intermediate",
  deadline: "Tomorrow, 11:59 PM",
  description:
    "Build a real-time reactive task board with optimistic updates and type-safe schema validation. Evaluated on code structure, test coverage, and API design.",
  skills: ["Next.js 15", "TypeScript", "Tailwind CSS", "API Route Handlers"],
};

export interface CandidateAssessmentItem {
  id: string;
  title: string;
  company: string;
  date: string;
  score: number;
  status: string;
  verdict: string;
  skills: string[];
  rawStatus?: string;
}

const RECENT_ASSESSMENTS: CandidateAssessmentItem[] = [
  {
    id: "asst-8911",
    title: "React Concurrent Features & Architecture",
    company: "Veloce Systems",
    date: "Oct 14, 2026",
    score: 94,
    status: "Passed",
    verdict: "Top Tier Performance",
    skills: ["React 19", "Suspense", "Server Actions"],
  },
  {
    id: "asst-7734",
    title: "TypeScript Deep-Dive & Advanced Generics",
    company: "MetaScale Labs",
    date: "Oct 02, 2026",
    score: 89,
    status: "Passed",
    verdict: "Strong Type Safety",
    skills: ["Generics", "Conditional Types", "Zod"],
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

export function RoleAdaptiveDashboard() {
  const { data: profileData } = useGetMyProfile();
  const user = profileData?.data;

  const [role, setRole] = useState<string>(() =>
    getEffectiveRole(user?.email, user?.role),
  );

  useEffect(() => {
    const updateRole = () => {
      setRole(getEffectiveRole(user?.email, user?.role));
    };
    updateRole();
    window.addEventListener("devassess_role_change", updateRole);
    window.addEventListener("storage", updateRole);
    return () => {
      window.removeEventListener("devassess_role_change", updateRole);
      window.removeEventListener("storage", updateRole);
    };
  }, [user]);

  const [myAssessments, setMyAssessments] = useState<CandidateAssessmentItem[]>(RECENT_ASSESSMENTS);
  const [activeInvitation, setActiveInvitation] = useState(ACTIVE_ASSESSMENT);
  const [activeInviteToken, setActiveInviteToken] = useState<string | null>(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>("asst-01");
  const [hasCompletedActiveExam, setHasCompletedActiveExam] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [latestVerdictStatus, setLatestVerdictStatus] =
    useState<string>("PENDING_REVIEW");
  const [completedCount, setCompletedCount] = useState(3);
  const [activeChallengesCount, setActiveChallengesCount] = useState(1);
  const [avgScore, setAvgScore] = useState("91.3");

  const loadCandidateData = async () => {
    try {
      const activeEmail =
        user?.email ||
        getActiveUserEmail() ||
        (typeof window !== "undefined"
          ? localStorage.getItem("devassess_active_email")
          : null) ||
        "provash10dev@gmail.com";
      const currentEmail = activeEmail.toLowerCase().trim();

      let liveSubmissions: any[] = [];
      const stored = localStorage.getItem("devassess_candidate_submissions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          liveSubmissions = parsed.filter((item: any) => {
            if (!item.candidateEmail) return true;
            const itemEmail = item.candidateEmail.toLowerCase().trim();
            return (
              itemEmail === currentEmail ||
              (currentEmail.includes("provash") &&
                (itemEmail.includes("provash") || itemEmail.includes("10dev")))
            );
          });
        }
      }

      // Filter only real completed exam submissions (ignore unsubmitted invitation placeholders)
      const realCompletedSubmissions = liveSubmissions.filter((item: any) => {
        if (!item.submittedAt) return false;
        if (
          item.submittedAt.includes("Invitation") ||
          item.submittedAt.includes("Awaiting") ||
          item.submittedAt === "Invitation Dispatched (Awaiting Exam)"
        ) {
          return false;
        }
        return true;
      });

      const latestSub = liveSubmissions[0];
      if (latestSub?.status) {
        setLatestVerdictStatus(latestSub.status);
      }

      const hasCompleted = realCompletedSubmissions.length > 0;
      const anyAccepted = realCompletedSubmissions.some(
        (item: any) =>
          item.status === "ACCEPTED" || item.status === "Accepted ✓",
      );

      // Map completed submissions
      const mapped = realCompletedSubmissions.map((item: any) => {
        const itemAccepted =
          item.status === "ACCEPTED" || item.status === "Accepted ✓";
        const itemRejected = item.status === "REJECTED";
        const itemPassed =
          !itemRejected && (itemAccepted || Number(item.score) >= 60);

        return {
          id: item.id || `asst-${Date.now()}`,
          title: item.challengeTitle || "Developer Assessment Challenge",
          company: "DevAssess Live Sandbox",
          date: item.submittedAt || "Just now",
          score: item.score ?? 90,
          status: itemAccepted
            ? "Accepted ✓"
            : itemRejected
              ? "Rejected"
              : itemPassed
                ? "Passed"
                : "Under Review",
          verdict: itemAccepted
            ? "Accepted by Recruiter 🎉"
            : itemRejected
              ? "Declined"
              : itemPassed
                ? "Top Performance & Certified ✓"
                : "Needs Review",
          rawStatus: item.status || "PENDING_REVIEW",
          skills: ["JavaScript", "TypeScript", "Problem Solving"],
        };
      });

      const all = [...mapped, ...RECENT_ASSESSMENTS];
      setMyAssessments(all);

      // Dynamic stats calculation
      const totalCompleted = 3 + mapped.length;
      setCompletedCount(totalCompleted);

      const totalScore = all.reduce(
        (sum, item) => sum + (Number(item.score) || 0),
        0,
      );
      const calculatedAvg =
        all.length > 0 ? (totalScore / all.length).toFixed(1) : "91.3";
      setAvgScore(calculatedAvg);

      // Check active recruiter invitation for this candidate
      let foundPendingInvitation = false;

      // 1. Try checking live invitations from backend API (/invitations/my)
      try {
        const res = await getCandidateInvitations();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const pendingLive =
            res.data.find((inv: any) => inv.status === "PENDING") ||
            res.data[0];
          if (pendingLive) {
            const isPending = pendingLive.status === "PENDING";
            setActiveInvitation({
              title:
                pendingLive.assessment?.title || "Live Developer Assessment",
              company:
                pendingLive.assessment?.recruiter?.companyName ||
                "Recruiter Assessment Console (Live DB)",
              duration: `${pendingLive.assessment?.durationMinutes || 90} Minutes`,
              difficulty:
                pendingLive.assessment?.difficulty || "Intermediate",
              deadline: `Expires: ${new Date(pendingLive.expiresAt).toLocaleDateString()}`,
              description:
                pendingLive.assessment?.description ||
                "Official proctored developer assessment invitation received from your recruiter.",
              skills: ["TypeScript", "React", "Live PostgreSQL"],
            });
            setActiveInviteToken(
              pendingLive.inviteToken || pendingLive.token || null,
            );
            setActiveAssessmentId(pendingLive.assessmentId);

            if (isPending) {
              foundPendingInvitation = true;
              setActiveChallengesCount(1);
              setHasCompletedActiveExam(false);
              setIsAccepted(false);
              return;
            }
          }
        }
      } catch {
        // Fallback to local storage
      }

      // 2. Check local storage invitations
      try {
        const storedInvites = localStorage.getItem("devassess_invitations");
        if (storedInvites) {
          const list = JSON.parse(storedInvites);
          const pending = list
            .filter((inv: any) => inv.status === "PENDING")
            .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .find((inv: any) => {
              if (!inv.candidateEmail) return true;
              const invEmail = inv.candidateEmail.toLowerCase().trim();
              return (
                invEmail === currentEmail ||
                (currentEmail.includes("provash") &&
                  (invEmail.includes("provash") || invEmail.includes("10dev"))) ||
                (currentEmail.includes("scstanley") || currentEmail.includes("amy"))
              );
            });
          if (pending) {
            foundPendingInvitation = true;
            const challengeDuration =
              pending.duration ||
              (pending.durationMinutes ? `${pending.durationMinutes} Minutes` : "75 Minutes");
            const challengeSkills =
              Array.isArray(pending.skills) && pending.skills.length > 0
                ? pending.skills
                : [pending.language || "SQL / PostgreSQL", "Database", "Performance"];

            setActiveInvitation({
              title:
                pending.assessmentTitle ||
                "PostgreSQL Indexing & Optimization",
              company: "Recruiter Assessment Console",
              duration: challengeDuration,
              difficulty: pending.difficulty || "Intermediate",
              deadline: `Expires in 3 days (${new Date(pending.expiresAt || Date.now() + 259200000).toLocaleDateString()})`,
              description:
                pending.description ||
                "You have received a new proctored developer assessment invitation from your recruiter. Complete the algorithmic and coding questions within the time limit.",
              skills: challengeSkills,
            });
            setActiveInviteToken(pending.inviteToken || pending.token || null);
            setActiveAssessmentId(pending.assessmentId || "asst-04");
            setActiveChallengesCount(1);
            setHasCompletedActiveExam(false);
            setIsAccepted(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      // If no pending invitation found, reflect completed state
      if (!foundPendingInvitation) {
        setHasCompletedActiveExam(hasCompleted);
        setIsAccepted(anyAccepted);
        setActiveChallengesCount(hasCompleted ? 0 : 1);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadCandidateData();
    window.addEventListener("storage", loadCandidateData);
    window.addEventListener("devassess_submission_update", loadCandidateData);
    window.addEventListener("devassess_invitations_update", loadCandidateData);
    return () => {
      window.removeEventListener("storage", loadCandidateData);
      window.removeEventListener("devassess_submission_update", loadCandidateData);
      window.removeEventListener("devassess_invitations_update", loadCandidateData);
    };
  }, [user]);

  // IF ROLE IS RECRUITER -> RENDER RECRUITER DASHBOARD!
  if (role === "RECRUITER") {
    return (
      <div className="space-y-8 pb-12">
        {/* Recruiter Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                candidate evaluation & scoring queue
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              >
                recruiter console
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl">
              inspect developer code solutions, review automated test case benchmarks, audit anti-cheat heuristics, and submit final candidate verdicts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/recruiter/earnings">
              <Button variant="outline" size="xs" className="gap-1.5 text-xs">
                <span>View Earnings & Payouts</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Recruiter Evaluation Queue View */}
        <RecruiterEvaluationsView />
      </div>
    );
  }

  // IF ROLE IS ADMIN -> RENDER ADMIN DASHBOARD!
  if (role === "ADMIN") {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                platform administration & user control
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] font-mono border-amber-500/30 text-amber-600 dark:text-amber-400"
              >
                admin console
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl">
              manage platform users, assign role permissions, and supervise assessments.
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="xs" className="gap-1.5 text-xs">
              <span>Open Admin Intelligence</span>
              <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>
        <AdminManageView />
      </div>
    );
  }

  // Build dynamic stat cards
  const statCards = [
    {
      title: "Active Assessment",
      value: String(activeChallengesCount),
      subtitle:
        activeChallengesCount === 0
          ? "All challenges submitted ✓"
          : "Due in 48 hours",
      icon: Clock,
      color:
        activeChallengesCount === 0 ? "text-emerald-500" : "text-amber-500",
      iconBg:
        activeChallengesCount === 0
          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-500 shadow-emerald-500/10"
          : "bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-amber-500/10",
      cardBg:
        activeChallengesCount === 0
          ? "from-emerald-500/20 via-emerald-500/5 to-card border-emerald-500/40 hover:border-emerald-500 hover:shadow-emerald-500/20"
          : "from-amber-500/20 via-amber-500/5 to-card border-amber-500/40 hover:border-amber-500 hover:shadow-amber-500/20",
      accentBar:
        activeChallengesCount === 0
          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
          : "bg-gradient-to-r from-amber-500 to-orange-400",
      badgeColor:
        activeChallengesCount === 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Completed Tests",
      value: String(completedCount),
      subtitle: isAccepted ? "Accepted & Verified 🎉" : "All evaluated ✓",
      icon: CheckCircle2,
      color: "text-teal-500",
      iconBg:
        "bg-teal-500/20 border-teal-500/40 text-teal-500 shadow-teal-500/10",
      cardBg:
        "from-teal-500/20 via-teal-500/5 to-card border-teal-500/40 hover:border-teal-500 hover:shadow-teal-500/20",
      accentBar: "bg-gradient-to-r from-teal-500 to-emerald-400",
      badgeColor: "text-teal-600 dark:text-teal-400",
    },
    {
      title: "Average Score",
      value: `${avgScore}%`,
      subtitle: `Top percentile across ${completedCount} tests`,
      icon: Award,
      color: "text-primary",
      iconBg:
        "bg-primary/20 border-primary/40 text-primary shadow-primary/10",
      cardBg:
        "from-primary/20 via-primary/5 to-card border-primary/40 hover:border-primary hover:shadow-primary/20",
      accentBar: "bg-gradient-to-r from-primary via-orange-500 to-amber-500",
      badgeColor: "text-primary",
    },
    {
      title: "Coding Streak",
      value: "5 Days",
      subtitle: "18.5 total test hours 🔥",
      icon: Flame,
      color: "text-rose-500",
      iconBg:
        "bg-rose-500/20 border-rose-500/40 text-rose-500 shadow-rose-500/10",
      cardBg:
        "from-rose-500/20 via-rose-500/5 to-card border-rose-500/40 hover:border-rose-500 hover:shadow-rose-500/20",
      accentBar: "bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400",
      badgeColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  // DEFAULT -> CANDIDATE DASHBOARD!
  return (
    <div className="space-y-8 pb-10">
      {/* welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-card p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold shadow-2xs">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            Developer Assessment Hub
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {activeChallengesCount > 0 ? (
              <>
                You have{" "}
                <span className="font-bold text-foreground">
                  {activeChallengesCount} active challenge
                </span>{" "}
                waiting for submission and{" "}
                <span className="font-bold text-foreground">
                  {completedCount} verified certifications
                </span>{" "}
                completed. Track your technical evaluations and test performance
                below.
              </>
            ) : (
              <>
                Great job! You have completed all active challenges. You have{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  0 pending challenges
                </span>{" "}
                and{" "}
                <span className="font-bold text-foreground">
                  {completedCount} verified certifications & tests
                </span>{" "}
                completed. Track your technical evaluations and test performance below.
              </>
            )}
          </p>
        </div>
      </div>

      {/* quick stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-5 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${stat.cardBg}`}
            >
              {/* top accent gradient line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2 ${stat.accentBar}`}
              />

              {/* ambient background blur glow on hover */}
              <div className="absolute top-0 right-0 -mt-6 -mr-6 size-24 rounded-full bg-white/20 dark:bg-white/5 blur-xl group-hover:scale-175 transition-transform duration-500" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-extrabold tracking-wider uppercase text-muted-foreground/90 group-hover:text-foreground transition-colors">
                    {stat.title}
                  </p>
                  <p className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground transition-transform duration-300 group-hover:scale-105 origin-left">
                    {stat.value}
                  </p>
                  <p
                    className={`text-xs font-bold flex items-center gap-1 ${stat.badgeColor}`}
                  >
                    {stat.subtitle}
                  </p>
                </div>

                <div
                  className={`size-14 rounded-2xl flex items-center justify-center border-2 shadow-md transition-all duration-300 group-hover:scale-115 group-hover:rotate-6 ${stat.iconBg}`}
                >
                  <Icon
                    className={`size-7 ${stat.color} transition-transform duration-300`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* active assessment feature card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="size-2.5 rounded-full bg-primary animate-pulse" />
            <h2 className="font-heading text-lg font-bold text-foreground tracking-tight">
              Active Assessment Invitation
            </h2>
          </div>
          {hasCompletedActiveExam ? (
            latestVerdictStatus === "ACCEPTED" || isAccepted ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold gap-1.5 py-1 px-3 shadow-xs">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Accepted by Recruiter 🎉
              </Badge>
            ) : latestVerdictStatus === "IN_REVIEW" ? (
              <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-semibold gap-1.5 py-1 px-3 shadow-xs">
                <Clock className="size-3.5 text-blue-500" />
                Under Recruiter Review ⏳
              </Badge>
            ) : latestVerdictStatus === "REJECTED" ? (
              <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold gap-1.5 py-1 px-3 shadow-xs">
                <XCircle className="size-3.5 text-rose-500" />
                Evaluation Declined
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold gap-1.5 py-1 px-3 shadow-xs">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Exam Completed &amp; Submitted ✓
              </Badge>
            )
          ) : (
            <Badge variant="amber" className="text-xs font-medium py-1 px-3">
              Action Required: Pending Take
            </Badge>
          )}
        </div>

        {/* HERO CARD CONTAINER */}
        <div
          className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 shadow-md ${
            hasCompletedActiveExam
              ? latestVerdictStatus === "ACCEPTED" || isAccepted
                ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.08] via-card to-card shadow-emerald-500/5"
                : latestVerdictStatus === "IN_REVIEW"
                  ? "border-blue-500/40 bg-gradient-to-br from-blue-500/[0.08] via-card to-card shadow-blue-500/5"
                  : latestVerdictStatus === "REJECTED"
                    ? "border-rose-500/40 bg-gradient-to-br from-rose-500/[0.08] via-card to-card shadow-rose-500/5"
                    : "border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.05] via-card to-card"
              : "border-amber-500/40 bg-gradient-to-br from-amber-500/[0.08] via-card to-card shadow-amber-500/5"
          }`}
        >
          {/* top glowing accent line */}
          <div
            className={`h-1.5 w-full ${
              hasCompletedActiveExam
                ? latestVerdictStatus === "ACCEPTED" || isAccepted
                  ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"
                  : latestVerdictStatus === "IN_REVIEW"
                    ? "bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                    : latestVerdictStatus === "REJECTED"
                      ? "bg-gradient-to-r from-rose-500 via-red-400 to-rose-500"
                      : "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"
                : "bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500"
            }`}
          />

          <div className="p-6 sm:p-7 space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      hasCompletedActiveExam
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    <Building2 className="size-3" />
                    <span>
                      {hasCompletedActiveExam
                        ? `Completed: ${activeInvitation.company}`
                        : `Invited by: ${activeInvitation.company}`}
                    </span>
                  </div>

                  {activeInviteToken && (
                    <Badge
                      variant="outline"
                      className="font-mono text-[11px] bg-primary/10 text-primary border-primary/30 px-2.5 py-0.5 gap-1"
                    >
                      <Sparkles className="size-3" /> Tokenized Invitation
                    </Badge>
                  )}
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
                  {activeInvitation.title}
                </h3>
              </div>

              {/* meta tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-border/80 text-xs font-semibold text-foreground shadow-2xs">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span>{activeInvitation.duration}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shadow-2xs">
                  <Zap className="size-3.5" />
                  <span>{activeInvitation.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
              {activeInvitation.description}
            </p>

            {/* Skills Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-muted-foreground mr-1">
                Tech Stack:
              </span>
              {activeInvitation.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-muted/80 text-foreground border border-border/80 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Live Verdict & Status Highlight Box */}
            <div
              className={`rounded-xl p-4 sm:p-5 border transition-all ${
                hasCompletedActiveExam
                  ? latestVerdictStatus === "ACCEPTED" || isAccepted
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                    : latestVerdictStatus === "IN_REVIEW"
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-100"
                      : latestVerdictStatus === "REJECTED"
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                      hasCompletedActiveExam
                        ? latestVerdictStatus === "ACCEPTED" || isAccepted
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                          : latestVerdictStatus === "IN_REVIEW"
                            ? "bg-blue-500/20 border-blue-500/40 text-blue-600 dark:text-blue-400"
                            : latestVerdictStatus === "REJECTED"
                              ? "bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-400"
                              : "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {hasCompletedActiveExam ? (
                      latestVerdictStatus === "ACCEPTED" || isAccepted ? (
                        <CheckCircle2 className="size-5" />
                      ) : latestVerdictStatus === "IN_REVIEW" ? (
                        <Clock className="size-5 animate-pulse" />
                      ) : latestVerdictStatus === "REJECTED" ? (
                        <XCircle className="size-5" />
                      ) : (
                        <CheckCircle2 className="size-5" />
                      )
                    ) : (
                      <Clock className="size-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="font-heading text-sm font-bold tracking-tight">
                      {hasCompletedActiveExam ? (
                        latestVerdictStatus === "ACCEPTED" || isAccepted
                          ? "Verdict: Accepted by Recruiter 🎉"
                          : latestVerdictStatus === "IN_REVIEW"
                            ? "Verdict: Under Technical Review by Recruiter ⏳"
                            : latestVerdictStatus === "REJECTED"
                              ? "Verdict: Evaluation Declined"
                              : "Status: Submission Successfully Received ✓"
                      ) : (
                        "Status: Pending Candidate Action"
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {hasCompletedActiveExam ? (
                        latestVerdictStatus === "ACCEPTED" || isAccepted
                          ? "Congratulations! Your technical evaluation has been accepted by the hiring manager."
                          : latestVerdictStatus === "IN_REVIEW"
                            ? "The evaluator is currently reviewing your unit tests, code readability, and architecture."
                            : latestVerdictStatus === "REJECTED"
                              ? "This challenge has been declined. You may review other available assessments below."
                              : "Your code and telemetry were submitted and are queued for recruiter review."
                      ) : (
                        `Assessment window is active. Must be submitted before: ${activeInvitation.deadline}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground self-end sm:self-center font-medium">
                  <Calendar className="size-3.5" />
                  <span>
                    {hasCompletedActiveExam ? "Submitted Live" : activeInvitation.deadline}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="bg-muted/40 border-t border-border/80 px-6 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Shield className="size-3.5 text-emerald-500" />
              <span className="font-medium">
                Proctored Environment • Anti-Cheat Telemetry Verified
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {hasCompletedActiveExam ? (
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto font-bold gap-2 text-xs h-10 px-5 rounded-xl shadow-xs transition-all ${
                    latestVerdictStatus === "ACCEPTED" || isAccepted
                      ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 shadow-emerald-500/10"
                      : latestVerdictStatus === "IN_REVIEW"
                        ? "border-blue-500/50 bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25 shadow-blue-500/10"
                        : latestVerdictStatus === "REJECTED"
                          ? "border-rose-500/50 bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 shadow-rose-500/10"
                          : "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25"
                  }`}
                >
                  {latestVerdictStatus === "ACCEPTED" || isAccepted ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span>Candidate Accepted ✓</span>
                    </>
                  ) : latestVerdictStatus === "IN_REVIEW" ? (
                    <>
                      <Clock className="size-4 text-blue-500" />
                      <span>Under Review ⏳</span>
                    </>
                  ) : latestVerdictStatus === "REJECTED" ? (
                    <>
                      <XCircle className="size-4 text-rose-500" />
                      <span>Decision: Declined</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span>Submission Received ✓</span>
                    </>
                  )}
                </Button>
              ) : (
                <Link
                  href={
                    activeInviteToken
                      ? `/assessment/attempt?id=${encodeURIComponent(activeAssessmentId)}&token=${encodeURIComponent(activeInviteToken)}&title=${encodeURIComponent(activeInvitation.title)}&duration=${encodeURIComponent(activeInvitation.duration)}`
                      : `/assessment/attempt?id=${encodeURIComponent(activeAssessmentId)}&title=${encodeURIComponent(activeInvitation.title)}&duration=${encodeURIComponent(activeInvitation.duration)}`
                  }
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="default"
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold gap-2 text-xs h-10 px-5 rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Play className="size-3.5 fill-current" />
                    Launch Assessment Exam Room
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* completed assessments history */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground tracking-tight">
              Assessment History &amp; Scores
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-semibold bg-muted/60 px-2.5 py-1 rounded-full border border-border/60">
            {myAssessments.length} Completed &amp; Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {myAssessments.map((test) => {
            const isTestAccepted =
              test.status === "Accepted ✓" ||
              test.rawStatus === "ACCEPTED" ||
              test.verdict?.includes("Accepted");
            const isTestPending =
              test.status === "Under Review" || test.verdict === "Needs Review";

            const scoreNumber = Number(test.score) || 0;

            return (
              <div
                key={test.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-md ${
                  isTestAccepted
                    ? "border-emerald-500/40 bg-gradient-to-b from-emerald-500/[0.08] via-card to-card hover:border-emerald-500/70 hover:shadow-emerald-500/10"
                    : isTestPending
                      ? "border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] via-card to-card hover:border-amber-500/70 hover:shadow-amber-500/10"
                      : "border-border/80 bg-gradient-to-b from-card to-card/70 hover:border-primary/50 hover:shadow-primary/5"
                }`}
              >
                {/* Top color bar */}
                <div
                  className={`h-1 w-full ${
                    isTestAccepted
                      ? "bg-emerald-500"
                      : isTestPending
                        ? "bg-amber-500"
                        : "bg-primary/50"
                  }`}
                />

                <div className="p-5 pb-3 space-y-3">
                  {/* Company & Status Pill Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                      <Building2 className="size-3 text-primary/80" />
                      <span className="truncate max-w-[130px]">
                        {test.company}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isTestAccepted ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold py-0.5 px-2 shadow-2xs gap-1">
                          <CheckCircle2 className="size-3" />
                          Accepted ✓
                        </Badge>
                      ) : isTestPending ? (
                        <Badge
                          variant="outline"
                          className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/15 text-[10px] py-0.5 px-2 font-bold gap-1 shadow-2xs"
                        >
                          <Clock className="size-3" />
                          Needs Review
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 text-[10px] py-0.5 px-2 font-bold gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="size-3" />
                          Passed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Challenge Title */}
                  <h4 className="font-heading text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {test.title}
                  </h4>

                  {/* Score Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        Score Obtained
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          scoreNumber >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : scoreNumber >= 50
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {test.score}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          scoreNumber >= 80
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : scoreNumber >= 50
                              ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                              : "bg-gradient-to-r from-rose-500 to-orange-400"
                        }`}
                        style={{ width: `${Math.max(scoreNumber, 5)}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {test.skills.map((s: string) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/50"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                    <Calendar className="size-3 text-muted-foreground/70" />
                    <span>Completed on {test.date}</span>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-4 pt-3 border-t border-border/60 bg-muted/20">
                  <button
                    type="button"
                    className="w-full text-xs font-bold text-primary group-hover:text-primary/80 flex items-center justify-between py-1 transition-colors cursor-pointer"
                  >
                    <span>View Detailed Evaluation</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* quick navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Link
          href="/dashboard/profile"
          className="group block p-5 rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/60 hover:bg-muted/40 hover:border-primary/50 transition-all duration-300 shadow-xs hover:shadow-md"
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
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/dashboard/payments"
          className="group block p-5 rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/60 hover:bg-muted/40 hover:border-primary/50 transition-all duration-300 shadow-xs hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                Payment &amp; Certification History
              </h3>
              <p className="text-xs text-muted-foreground">
                View billing transactions, pro tier access, and downloaded
                certificates.
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
