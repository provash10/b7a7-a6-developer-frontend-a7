"use client";

import { Eye, History, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

interface RecentSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  assessmentTitle: string;
  recruiterCompany: string;
  submittedAt: string;
  score: number;
  verdict: "passed" | "failed" | "flagged";
  antiCheatFlags: number;
  flagReason?: string;
}

const RECENT_SUBMISSIONS: RecentSubmission[] = [
  {
    id: "sub-101",
    candidateName: "Provash Kumar",
    candidateEmail: "provash10@gmail.com",
    assessmentTitle: "Full Stack Next.js 15 & TypeScript Challenge",
    recruiterCompany: "TechCorp Labs",
    submittedAt: "6 mins ago",
    score: 95,
    verdict: "passed",
    antiCheatFlags: 0,
  },
  {
    id: "sub-102",
    candidateName: "Tariqul Islam",
    candidateEmail: "tariqul.dev@gmail.com",
    assessmentTitle: "Algorithms & Tree Traversal Benchmark",
    recruiterCompany: "Algorithmix Systems",
    submittedAt: "24 mins ago",
    score: 88,
    verdict: "passed",
    antiCheatFlags: 0,
  },
  {
    id: "sub-103",
    candidateName: "Farhana Akter",
    candidateEmail: "farhana.ui@yahoo.com",
    assessmentTitle: "React Component Architecture & Accessibility",
    recruiterCompany: "PixelCraft Studio",
    submittedAt: "52 mins ago",
    score: 64,
    verdict: "flagged",
    antiCheatFlags: 3,
    flagReason: "multi-window copy-paste switch detected",
  },
  {
    id: "sub-104",
    candidateName: "Shahriar Ahmed",
    candidateEmail: "shahriar.eng@outlook.com",
    assessmentTitle: "PostgreSQL Query Optimization & Indexing",
    recruiterCompany: "FinScale Technologies",
    submittedAt: "1 hour ago",
    score: 46,
    verdict: "failed",
    antiCheatFlags: 0,
  },
];

export function RecentSubmissionsTable() {
  const [submissions, setSubmissions] = useState<RecentSubmission[]>(RECENT_SUBMISSIONS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("devassess_candidate_submissions");
      if (stored) {
        const live = JSON.parse(stored);
        if (Array.isArray(live) && live.length > 0) {
          const mapped: RecentSubmission[] = live.map((item: any) => ({
            id: item.id || `sub-${Date.now()}`,
            candidateName: item.candidateName || "Candidate",
            candidateEmail: item.candidateEmail || "candidate@100.com",
            assessmentTitle: item.challengeTitle || "Developer Assessment",
            recruiterCompany: "TechCorp Labs",
            submittedAt: "Just now",
            score: item.score || 85,
            verdict: item.score >= 60 ? "passed" : "failed",
            antiCheatFlags: item.antiCheatStatus === "FLAGGED" ? 1 : 0,
          }));
          setSubmissions([...mapped, ...RECENT_SUBMISSIONS]);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleInspect = (sub: RecentSubmission) => {
    toast.add({
      title: "Opening Submission Playground",
      description: `Viewing code solution & AST analysis for ${sub.candidateName}.`,
      type: "info",
    });
  };

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-0.5">
              <History className="size-3.5" />
              <span>live evaluation stream</span>
            </div>
            <CardTitle className="text-base font-semibold text-foreground">
              recent candidate submissions
            </CardTitle>
            <CardDescription className="text-xs">
              real-time incoming code runs, evaluation verdicts, and anti-cheat
              telemetry.
            </CardDescription>
          </div>
          <Badge variant="success" className="w-fit text-[11px] gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>live monitoring</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground">
              <tr>
                <th className="py-3 px-4 font-medium">candidate</th>
                <th className="py-3 px-4 font-medium">assessment challenge</th>
                <th className="py-3 px-4 font-medium">submitted</th>
                <th className="py-3 px-4 font-medium">score & verdict</th>
                <th className="py-3 px-4 font-medium">anti-cheat status</th>
                <th className="py-3 px-4 font-medium text-right">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* candidate */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                        {sub.candidateName.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground leading-tight">
                          {sub.candidateName}
                        </p>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {sub.candidateEmail}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* challenge */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-medium text-foreground truncate">
                      {sub.assessmentTitle}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      by {sub.recruiterCompany}
                    </span>
                  </td>

                  {/* submitted */}
                  <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                    {sub.submittedAt}
                  </td>

                  {/* score */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground font-mono">
                        {sub.score}%
                      </span>
                      {sub.verdict === "passed" && (
                        <Badge variant="success" className="text-[10px]">
                          passed
                        </Badge>
                      )}
                      {sub.verdict === "failed" && (
                        <Badge variant="destructive" className="text-[10px]">
                          failed
                        </Badge>
                      )}
                      {sub.verdict === "flagged" && (
                        <Badge variant="amber" className="text-[10px]">
                          flagged
                        </Badge>
                      )}
                    </div>
                  </td>

                  {/* anti cheat */}
                  <td className="py-3.5 px-4">
                    {sub.antiCheatFlags === 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="size-3.5" />
                        clean (0 flags)
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium"
                        title={sub.flagReason}
                      >
                        <ShieldAlert className="size-3.5" />
                        {sub.antiCheatFlags} flags detected
                      </span>
                    )}
                  </td>

                  {/* action */}
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleInspect(sub)}
                      className="gap-1 text-xs"
                    >
                      <Eye className="size-3 text-primary" />
                      <span>inspect</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
