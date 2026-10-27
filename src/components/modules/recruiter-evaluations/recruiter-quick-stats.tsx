"use client";

import { CheckCircle2, Clock, Eye, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EvaluationTask } from "./types";

interface RecruiterQuickStatsProps {
  tasks: EvaluationTask[];
}

export function RecruiterQuickStats({ tasks }: RecruiterQuickStatsProps) {
  // console.log("recruiter quick stats component rendered");

  const pendingCount = tasks.filter(
    (t) => t.status === "PENDING_REVIEW",
  ).length;
  const inReviewCount = tasks.filter((t) => t.status === "IN_REVIEW").length;
  const acceptedCount = tasks.filter((t) => t.status === "ACCEPTED").length;
  const flaggedCount = tasks.filter(
    (t) => t.antiCheatStatus === "FLAGGED",
  ).length;

  const stats = [
    {
      title: "Pending Evaluation",
      value: pendingCount,
      icon: Clock,
      subtext: "Requires recruiter scoring",
      color: "text-amber-500",
      iconBg: "bg-amber-500/20 border-amber-500/40 text-amber-500 shadow-amber-500/10",
      cardBg: "from-amber-500/20 via-amber-500/5 to-card border-amber-500/40 hover:border-amber-500 hover:shadow-amber-500/20",
      accentBar: "bg-gradient-to-r from-amber-500 to-orange-400",
      badgeColor: "text-amber-700 dark:text-amber-300",
      badge: "Action Needed",
    },
    {
      title: "Under Active Review",
      value: inReviewCount,
      icon: Eye,
      subtext: "Scoring in progress",
      color: "text-blue-500",
      iconBg: "bg-blue-500/20 border-blue-500/40 text-blue-500 shadow-blue-500/10",
      cardBg: "from-blue-500/20 via-blue-500/5 to-card border-blue-500/40 hover:border-blue-500 hover:shadow-blue-500/20",
      accentBar: "bg-gradient-to-r from-blue-500 to-cyan-400",
      badgeColor: "text-blue-700 dark:text-blue-300",
      badge: "In Progress",
    },
    {
      title: "Accepted Candidates",
      value: acceptedCount,
      icon: CheckCircle2,
      subtext: "Passed technical benchmark",
      color: "text-emerald-500",
      iconBg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-500 shadow-emerald-500/10",
      cardBg: "from-emerald-500/20 via-emerald-500/5 to-card border-emerald-500/40 hover:border-emerald-500 hover:shadow-emerald-500/20",
      accentBar: "bg-gradient-to-r from-emerald-500 to-teal-400",
      badgeColor: "text-emerald-700 dark:text-emerald-300",
      badge: "Hired / Passed",
    },
    {
      title: "Anti-Cheat Alerts",
      value: flaggedCount,
      icon: ShieldAlert,
      subtext: "Telemetry anomalies flagged",
      color: "text-rose-500",
      iconBg: "bg-rose-500/20 border-rose-500/40 text-rose-500 shadow-rose-500/10",
      cardBg: "from-rose-500/20 via-rose-500/5 to-card border-rose-500/40 hover:border-rose-500 hover:shadow-rose-500/20",
      accentBar: "bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400",
      badgeColor: "text-rose-700 dark:text-rose-300",
      badge: "Proctoring Alert",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className={`group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-5 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl cursor-default ${item.cardBg}`}
          >
            {/* top accent gradient bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2 ${item.accentBar}`}
            />

            {/* ambient hover glow */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 size-24 rounded-full bg-white/20 dark:bg-white/5 blur-xl group-hover:scale-175 transition-transform duration-500" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-[11px] font-extrabold tracking-wider uppercase text-muted-foreground/90 group-hover:text-foreground transition-colors">
                  {item.title}
                </p>
                <p className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground transition-transform duration-300 group-hover:scale-105 origin-left">
                  {item.value}
                </p>
                <p
                  className={`text-xs font-bold flex items-center gap-1 ${item.badgeColor}`}
                >
                  {item.subtext}
                </p>
              </div>

              <div
                className={`size-14 rounded-2xl flex items-center justify-center border-2 shadow-md transition-all duration-300 group-hover:scale-115 group-hover:rotate-6 ${item.iconBg}`}
              >
                <Icon
                  className={`size-7 ${item.color} transition-transform duration-300`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
