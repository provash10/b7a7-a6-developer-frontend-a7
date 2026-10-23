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
      title: "pending evaluation",
      value: pendingCount,
      icon: Clock,
      subtext: "requires recruiter scoring",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10 border-amber-500/20",
      badge: "action needed",
      badgeVariant: "outline" as const,
    },
    {
      title: "under active review",
      value: inReviewCount,
      icon: Eye,
      subtext: "scoring in progress",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      badge: "in progress",
      badgeVariant: "outline" as const,
    },
    {
      title: "accepted candidates",
      value: acceptedCount,
      icon: CheckCircle2,
      subtext: "passed technical benchmark",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
      badge: "hired/passed",
      badgeVariant: "outline" as const,
    },
    {
      title: "anti-cheat alerts",
      value: flaggedCount,
      icon: ShieldAlert,
      subtext: "telemetry anomalies flagged",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10 border-rose-500/20",
      badge: "proctoring",
      badgeVariant: "destructive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="border-border/60 bg-card/60 backdrop-blur-xs relative overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </CardTitle>
              <div
                className={`size-8 rounded-lg border flex items-center justify-center ${item.bgColor} ${item.color}`}
              >
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {item.value}
                </div>
                <Badge
                  variant={item.badgeVariant}
                  className="text-[10px] py-0 px-1.5"
                >
                  {item.badge}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {item.subtext}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
