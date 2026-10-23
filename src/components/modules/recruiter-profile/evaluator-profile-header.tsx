"use client";

import {
  Award,
  CheckCircle2,
  Clock,
  PauseCircle,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EvaluatorProfile } from "./types";

interface EvaluatorProfileHeaderProps {
  profile: EvaluatorProfile;
  onToggleAvailability: () => void;
}

export function EvaluatorProfileHeader({
  profile,
  onToggleAvailability,
}: EvaluatorProfileHeaderProps) {
  // console.log("evaluator profile header component rendered");

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary/20 via-emerald-500/10 to-purple-500/10" />

      <CardContent className="pt-8 pb-6 px-6 relative space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* avatar & identity */}
          <div className="flex items-start sm:items-end gap-4">
            <div className="relative">
              <div className="size-20 rounded-2xl bg-gradient-to-br from-primary/30 to-card border-2 border-primary/40 flex items-center justify-center font-bold text-2xl text-primary shadow-lg font-mono">
                {profile.fullName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span
                className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-background flex items-center justify-center ${
                  profile.isAvailableForReviews
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
                title={
                  profile.isAvailableForReviews
                    ? "accepting new reviews"
                    : "currently paused"
                }
              >
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {profile.fullName}
                </h1>
                <Badge
                  variant="outline"
                  className="text-[10px] gap-1 py-0 px-1.5 border-primary/30 text-primary font-mono"
                >
                  <ShieldCheck className="size-3 text-primary" />
                  <span>{profile.tier}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium max-w-xl">
                {profile.headline}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-0.5">
                <span>{profile.company}</span>
                <span>•</span>
                <span className="text-primary font-mono">
                  {profile.timezone}
                </span>
              </div>
            </div>
          </div>

          {/* availability toggle button */}
          <div className="flex items-center gap-2 self-start sm:self-end">
            <Button
              type="button"
              variant={profile.isAvailableForReviews ? "default" : "outline"}
              onClick={onToggleAvailability}
              className={`h-9 px-3.5 text-xs font-semibold gap-1.5 ${
                profile.isAvailableForReviews
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
              }`}
            >
              {profile.isAvailableForReviews ? (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>accepting review tasks</span>
                </>
              ) : (
                <>
                  <PauseCircle className="size-3.5" />
                  <span>review queue paused</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* quick metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/50 text-xs">
          <div className="p-2.5 rounded-lg bg-background/50 border border-border/40 space-y-0.5">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Star className="size-3 text-amber-400 fill-amber-400" />
              <span>reviewer rating</span>
            </div>
            <div className="text-base font-bold font-mono text-foreground">
              {profile.rating.toFixed(2)} / 5.0
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-background/50 border border-border/40 space-y-0.5">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Award className="size-3 text-emerald-500" />
              <span>completed evaluations</span>
            </div>
            <div className="text-base font-bold font-mono text-foreground">
              {profile.totalReviewsCompleted} tests
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-background/50 border border-border/40 space-y-0.5">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="size-3 text-primary" />
              <span>turnaround sla</span>
            </div>
            <div className="text-base font-bold font-mono text-foreground">
              under {profile.slaHours} hours
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-background/50 border border-border/40 space-y-0.5">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <UserCheck className="size-3 text-purple-500" />
              <span>max daily quota</span>
            </div>
            <div className="text-base font-bold font-mono text-foreground">
              {profile.maxReviewsPerDay} reviews / day
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
