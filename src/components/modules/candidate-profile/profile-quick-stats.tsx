"use client";

import {
  Award,
  CheckCircle2,
  FileCode,
  Flame,
  Info,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProfileQuickStats() {
  // console.log("rendering candidate profile quick stats");

  return (
    <div className="space-y-6">
      {/* assessment achievements card */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Award className="size-4 text-amber-500" />
              <span>assessment scores</span>
            </CardTitle>
            <Badge variant="success" className="text-[10px]">
              top 8%
            </Badge>
          </div>
          <CardDescription className="text-xs">
            benchmarked across 1,200+ full-stack engineers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span className="text-muted-foreground">tests completed</span>
            </div>
            <span className="font-semibold text-foreground">3 passed</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <span className="text-muted-foreground">average score</span>
            </div>
            <span className="font-semibold text-primary">91.3%</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span className="text-muted-foreground">
                anti-cheat integrity
              </span>
            </div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              100% clean
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50">
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-orange-500" />
              <span className="text-muted-foreground">coding streak</span>
            </div>
            <span className="font-semibold text-orange-500">5 days</span>
          </div>
        </CardContent>
      </Card>

      {/* recruiter visibility tips card */}
      <Card className="border-border/80 bg-linear-to-b from-card to-primary/5 shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Info className="size-4 text-primary" />
            <span>profile optimization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <FileCode className="size-3.5 text-primary mt-0.5 shrink-0" />
            <p>
              add your top 5 technical skills to unlock algorithmic test
              recommendations.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
            <p>
              candidates with verified github portfolios receive interview
              invitations 3x faster.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
