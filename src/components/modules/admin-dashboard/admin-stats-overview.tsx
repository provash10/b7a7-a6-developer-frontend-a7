"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  FileCode2,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

const STATS_DATA: StatItem[] = [
  {
    title: "total registered users",
    value: "14,820",
    change: "+14.2%",
    isPositive: true,
    description: "11,400 candidates • 3,420 recruiters",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    title: "assessments evaluated",
    value: "4,690",
    change: "+22.5%",
    isPositive: true,
    description: "74.8% average pass rate this month",
    icon: FileCode2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "platform gross volume",
    value: "৳ 1,840,500",
    change: "+18.4%",
    isPositive: true,
    description: "bKash & Stripe recurring revenue",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    title: "anti-cheat integrity rate",
    value: "99.4%",
    change: "-0.2%",
    isPositive: true,
    description: "28 flagged attempts under review",
    icon: ShieldCheck,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

export function AdminStatsOverview() {
  // console.log("admin stats overview component rendered");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS_DATA.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="border-border/80 bg-card shadow-xs relative overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg border ${item.bg}`}>
                <Icon className={`size-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {item.value}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    item.isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {item.isPositive ? (
                    <ArrowUpRight className="size-3.5 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5 mr-0.5" />
                  )}
                  {item.change}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
