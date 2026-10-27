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
import { getEffectiveRole } from "@/lib/session";

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

const RECENT_ASSESSMENTS = [
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

  const [myAssessments, setMyAssessments] = useState(RECENT_ASSESSMENTS);
  const [activeInvitation, setActiveInvitation] = useState(ACTIVE_ASSESSMENT);
  const [activeInviteToken, setActiveInviteToken] = useState<string | null>(null);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>("asst-01");
  const [hasCompletedActiveExam, setHasCompletedActiveExam] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [completedCount, setCompletedCount] = useState(3);
  const [activeChallengesCount, setActiveChallengesCount] = useState(1);
  const [avgScore, setAvgScore] = useState("91.3");

  const loadCandidateData = () => {
    try {
      const currentEmail = (user?.email || "provash10dev@gmail.com").toLowerCase().trim();
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

      // Check if candidate completed any active exam or has submissions
      const hasCompleted = liveSubmissions.length > 0;
      const anyAccepted = liveSubmissions.some(
        (item: any) => item.status === "ACCEPTED" || item.status === "Accepted ✓",
      );

      setHasCompletedActiveExam(hasCompleted);
      setIsAccepted(anyAccepted);

      // Map submissions
      const mapped = liveSubmissions.map((item: any) => {
        const itemAccepted = item.status === "ACCEPTED" || item.status === "Accepted ✓";
        const itemRejected = item.status === "REJECTED";
        const itemPassed = !itemRejected && (itemAccepted || (Number(item.score) >= 60));

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
      setActiveChallengesCount(hasCompleted ? 0 : 1);

      const totalScore = all.reduce((sum, item) => sum + (Number(item.score) || 0), 0);
      const calculatedAvg = all.length > 0 ? (totalScore / all.length).toFixed(1) : "91.3";
      setAvgScore(calculatedAvg);
    } catch {
      // ignore
    }

    // Load active recruiter invitation for this candidate
    try {
      const storedInvites = localStorage.getItem("devassess_invitations");
      if (storedInvites) {
        const list = JSON.parse(storedInvites);
        const currentEmail = (user?.email || "provash10dev@gmail.com").toLowerCase().trim();
        const pending = list.find((inv: any) => {
          if (inv.status !== "PENDING") return false;
          if (!inv.candidateEmail) return true;
          const invEmail = inv.candidateEmail.toLowerCase().trim();
          return (
            invEmail === currentEmail ||
            (currentEmail.includes("provash") &&
              (invEmail.includes("provash") || invEmail.includes("10dev")))
          );
        });
        if (pending) {
          setActiveInvitation({
            title: pending.assessmentTitle || "Full Stack Next.js & TypeScript Challenge",
            company: "Recruiter Assessment Console",
            duration: "90 Minutes",
            difficulty: "Intermediate",
            deadline: `Expires in 3 days (${new Date(pending.expiresAt || Date.now() + 259200000).toLocaleDateString()})`,
            description:
              "You have received a new proctored developer assessment invitation from your recruiter. Complete the algorithmic and coding questions within the time limit.",
            skills: ["TypeScript", "Next.js", "Algorithms", "Anti-Cheat"],
          });
          setActiveInviteToken(pending.inviteToken);
          setActiveAssessmentId(pending.assessmentId || "asst-01");
        }
      }
    } catch {
      // ignore
    }

    // Also check live invitations from backend API (/invitations/my)
    getCandidateInvitations()
      .then((res: any) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const latest = res.data[0];
          setActiveInvitation({
            title: latest.assessment?.title || "Live Developer Assessment",
            company: latest.assessment?.recruiter?.companyName || "Recruiter Console (Live DB)",
            duration: `${latest.assessment?.durationMinutes || 90} Minutes`,
            difficulty: latest.assessment?.difficulty || "Intermediate",
            deadline: `Expires: ${new Date(latest.expiresAt).toLocaleDateString()}`,
            description:
              latest.assessment?.description ||
              "Official proctored developer assessment invitation received from your recruiter.",
            skills: ["TypeScript", "React", "Live PostgreSQL"],
          });
          setActiveInviteToken(latest.token);
          setActiveAssessmentId(latest.assessmentId);
        }
      })
      .catch(() => {});
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
      subtitle: activeChallengesCount === 0 ? "All challenges submitted" : "Due in 48 hours",
      icon: Clock,
      color: activeChallengesCount === 0 ? "text-emerald-500" : "text-amber-500",
      bg: activeChallengesCount === 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Completed Tests",
      value: String(completedCount),
      subtitle: isAccepted ? "Accepted & Verified ✓" : "All evaluated",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Average Score",
      value: `${avgScore}%`,
      subtitle: `Top percentile across ${completedCount} tests`,
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

  // DEFAULT -> CANDIDATE DASHBOARD!
  return (
    <div className="space-y-8 pb-10">
      {/* welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            Developer Assessment Hub
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {activeChallengesCount > 0 ? (
              <>
                You have{" "}
                <span className="font-semibold text-foreground">
                  {activeChallengesCount} active challenge
                </span>{" "}
                waiting for submission and{" "}
                <span className="font-semibold text-foreground">
                  {completedCount} verified certifications
                </span>{" "}
                completed. Track your technical evaluations and test performance
                below.
              </>
            ) : (
              <>
                Great job! You have completed all active challenges. You have{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  0 pending challenges
                </span>{" "}
                and{" "}
                <span className="font-semibold text-foreground">
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

      {/* active assessment feature card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasCompletedActiveExam ? (
              <CheckCircle2 className="size-5 text-emerald-500" />
            ) : (
              <Clock className="size-5 text-amber-500" />
            )}
            <h2 className="font-heading text-lg font-bold text-foreground">
              Active Assessment Invitation
            </h2>
          </div>
          {hasCompletedActiveExam ? (
            isAccepted ? (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold gap-1.5 py-0.5 px-2.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Accepted by Recruiter 🎉
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold gap-1.5 py-0.5 px-2.5">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                Exam Completed & Submitted ✓
              </Badge>
            )
          ) : (
            <Badge variant="amber" className="text-xs font-medium">
              Pending Action
            </Badge>
          )}
        </div>

        <Card
          className={`overflow-hidden shadow-sm transition-all ${
            hasCompletedActiveExam
              ? "border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-card/50"
              : "border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-card/50"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                    hasCompletedActiveExam
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <span>
                    {hasCompletedActiveExam
                      ? `Completed: ${activeInvitation.company}`
                      : `Invited by ${activeInvitation.company}`}
                  </span>
                  {activeInviteToken && (
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] text-primary border-primary/30"
                    >
                      Tokenized Invitation
                    </Badge>
                  )}
                </p>
                <CardTitle className="text-xl mt-1">
                  {activeInvitation.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  ⏱️ {activeInvitation.duration}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {activeInvitation.difficulty}
                </Badge>
              </div>
            </div>
            <CardDescription className="text-sm mt-2 leading-relaxed">
              {activeInvitation.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {activeInvitation.skills.map((skill) => (
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
                {hasCompletedActiveExam ? (
                  <>
                    Status:{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {isAccepted
                        ? "Accepted by Recruiter 🎉"
                        : "Submission Successfully Received ✓"}
                    </strong>
                  </>
                ) : (
                  <>
                    Deadline:{" "}
                    <strong className="text-foreground">
                      {activeInvitation.deadline}
                    </strong>
                  </>
                )}
              </span>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 border-t border-border/60 py-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {hasCompletedActiveExam ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  {isAccepted
                    ? "Congratulations! Your evaluation was reviewed and accepted by the recruiter."
                    : "Assessment successfully submitted and verified with proctored anti-cheat telemetry."}
                </span>
              ) : (
                "Once started, the assessment timer will run continuously with proctored anti-cheat telemetry."
              )}
            </p>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {hasCompletedActiveExam ? (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold gap-2 text-xs h-9 px-4 hover:bg-emerald-500/20"
                >
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  {isAccepted ? "Candidate Accepted ✓" : "Submission Received ✓"}
                </Button>
              ) : (
                <Link
                  href={
                    activeInviteToken
                      ? `/assessment/attempt?id=${activeAssessmentId}&token=${activeInviteToken}`
                      : `/assessment/attempt?id=${activeAssessmentId}`
                  }
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="default"
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium gap-2 text-xs h-9 px-4 cursor-pointer shadow-xs"
                  >
                    <Play className="size-3.5 fill-current" />
                    Launch Assessment Exam Room
                  </Button>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* completed assessments history */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              Assessment History & Scores
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {myAssessments.length} Completed & Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myAssessments.map((test) => {
            const isTestAccepted =
              test.status === "Accepted ✓" ||
              (test as any).rawStatus === "ACCEPTED" ||
              test.verdict?.includes("Accepted");
            const isTestPending =
              test.status === "Under Review" || test.verdict === "Needs Review";

            return (
              <Card
                key={test.id}
                className={`transition-all flex flex-col justify-between ${
                  isTestAccepted
                    ? "border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-card shadow-sm hover:border-emerald-500/80"
                    : "border-border/80 bg-card hover:border-primary/40"
                }`}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {test.company}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {isTestAccepted ? (
                        <Badge
                          className="bg-emerald-600 hover:bg-emerald-600 text-white font-semibold text-[10px] py-0.5 px-2 shadow-xs gap-1"
                        >
                          <CheckCircle2 className="size-3" />
                          Accepted ✓
                        </Badge>
                      ) : isTestPending ? (
                        <Badge
                          variant="outline"
                          className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-[10px] py-0.5 px-2 font-medium gap-1"
                        >
                          <Clock className="size-3" />
                          Needs Review
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[10px] py-0.5 px-2 font-medium gap-1"
                        >
                          <CheckCircle2 className="size-3" />
                          Passed
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0.5 px-2 font-mono border-border bg-muted/40 font-semibold"
                      >
                        Score {test.score}%
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-base font-semibold leading-snug line-clamp-2">
                    {test.title}
                  </CardTitle>
                  <div className="mt-2">
                    {isTestAccepted ? (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <span>🎉 Accepted by Recruiter</span>
                      </p>
                    ) : isTestPending ? (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                        <span>⏳ Needs Review</span>
                      </p>
                    ) : (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                        <span>✓ {test.verdict}</span>
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-5 py-2 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {test.skills.map((s: string) => (
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
            );
          })}
        </div>
      </div>

      {/* quick navigation cards */}
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
