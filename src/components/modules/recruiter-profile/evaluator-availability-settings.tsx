"use client";

import { Bell, Calendar, Clock, Globe, Settings2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { EvaluatorProfile } from "./types";

interface EvaluatorAvailabilitySettingsProps {
  profile: EvaluatorProfile;
  onChange: (updated: Partial<EvaluatorProfile>) => void;
}

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const timezones = [
  "Asia/Dhaka (GMT+6)",
  "UTC (GMT+0)",
  "Europe/London (GMT+1)",
  "America/New_York (EST)",
  "America/Los_Angeles (PST)",
  "Asia/Singapore (GMT+8)",
  "Asia/Tokyo (GMT+9)",
];

export function EvaluatorAvailabilitySettings({
  profile,
  onChange,
}: EvaluatorAvailabilitySettingsProps) {
  // console.log("evaluator availability settings component rendered");

  const handleToggleDay = (day: string) => {
    const isPresent = profile.activeDays.includes(day);
    const updated = isPresent
      ? profile.activeDays.filter((d) => d !== day)
      : [...profile.activeDays, day];

    // console.log("updating active working days", updated);
    onChange({ activeDays: updated });
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Settings2 className="size-4 text-emerald-500" />
          <span>review capacity & availability SLA</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          set daily evaluation limits, review turnaround targets, and automated
          test assignment preferences.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* daily quota and turnaround sla */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* max reviews per day */}
          <div className="space-y-1.5 p-3.5 rounded-xl border border-border/60 bg-background/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" />
                <span>daily review quota</span>
              </span>
              <span className="font-mono font-bold text-primary">
                {profile.maxReviewsPerDay} tests / day
              </span>
            </div>
            <Input
              type="range"
              min="1"
              max="15"
              step="1"
              value={profile.maxReviewsPerDay}
              onChange={(e) =>
                onChange({ maxReviewsPerDay: Number(e.target.value) || 1 })
              }
              className="h-2 cursor-pointer p-0 bg-muted mt-2"
            />
            <span className="text-[10px] text-muted-foreground block pt-1">
              stops dispatching new candidate tests once threshold is reached.
            </span>
          </div>

          {/* turnaround sla */}
          <div className="space-y-1.5 p-3.5 rounded-xl border border-border/60 bg-background/50">
            <span className="font-medium text-foreground text-xs flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-500" />
              <span>turnaround SLA target</span>
            </span>
            <select
              value={profile.slaHours}
              onChange={(e) => onChange({ slaHours: Number(e.target.value) })}
              className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
            >
              <option value={2}>Fast Track (Within 2 Hours)</option>
              <option value={4}>Standard (Within 4 Hours)</option>
              <option value={8}>Flexible (Within 8 Hours)</option>
              <option value={24}>Extended (Within 24 Hours)</option>
            </select>
            <span className="text-[10px] text-muted-foreground block pt-1">
              expected completion window after a candidate submits code.
            </span>
          </div>

          {/* timezone */}
          <div className="space-y-1.5 p-3.5 rounded-xl border border-border/60 bg-background/50">
            <span className="font-medium text-foreground text-xs flex items-center gap-1.5">
              <Globe className="size-3.5 text-purple-500" />
              <span>primary working timezone</span>
            </span>
            <select
              value={profile.timezone}
              onChange={(e) => onChange({ timezone: e.target.value })}
              className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-muted-foreground block pt-1">
              used for scheduling automated review task allocations.
            </span>
          </div>
        </div>

        {/* working days active */}
        <div className="space-y-2.5 p-4 rounded-xl border border-border/60 bg-background/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              <span>active weekly availability days</span>
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              {profile.activeDays.length} days enabled
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {allDays.map((day) => {
              const isSelected = profile.activeDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold font-mono transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border/70 bg-card hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <span className="text-[10px] text-muted-foreground block">
            tests submitted on unselected days will be routed to other on-duty
            evaluators.
          </span>
        </div>

        {/* automated review preferences & notifications */}
        <div className="space-y-3.5 p-4 rounded-xl border border-border/60 bg-background/50 text-xs">
          <div className="font-semibold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-2">
            <Bell className="size-3.5 text-primary" />
            <span>automated dispatch & alert settings</span>
          </div>

          {/* auto accept */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground block">
                auto-accept incoming tests matching my expertise domains
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                automatically pulls matching tests into your review queue
                without manual confirmation.
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({ autoAcceptTests: !profile.autoAcceptTests })
              }
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ml-4 ${
                profile.autoAcceptTests ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`size-3.5 bg-background rounded-full absolute top-0.75 transition-transform ${
                  profile.autoAcceptTests ? "left-5.5" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* email notifications */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div>
              <span className="font-medium text-foreground block">
                instant email dispatch for newly assigned candidate submissions
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                dispatches candidate test summary and direct review link to{" "}
                {profile.email}.
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({ emailNotifications: !profile.emailNotifications })
              }
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ml-4 ${
                profile.emailNotifications ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`size-3.5 bg-background rounded-full absolute top-0.75 transition-transform ${
                  profile.emailNotifications ? "left-5.5" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* urgent sms */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div>
              <span className="font-medium text-foreground block">
                sms / push notifications for urgent fast-track assessments
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                alerts your mobile device when an enterprise recruiter requests
                a 2-hour turnaround.
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({
                  urgentSmsNotifications: !profile.urgentSmsNotifications,
                })
              }
              className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ml-4 ${
                profile.urgentSmsNotifications ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`size-3.5 bg-background rounded-full absolute top-0.75 transition-transform ${
                  profile.urgentSmsNotifications ? "left-5.5" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
