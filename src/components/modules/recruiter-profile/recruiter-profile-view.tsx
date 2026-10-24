"use client";

import { RotateCcw, Save, Settings2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMyProfile } from "@/hooks";
import { EvaluatorAvailabilitySettings } from "./evaluator-availability-settings";
import { EvaluatorProfileForm } from "./evaluator-profile-form";
import { EvaluatorProfileHeader } from "./evaluator-profile-header";
import { initialEvaluatorProfile } from "./mock-data";
import type { EvaluatorProfile } from "./types";

export function RecruiterProfileView() {
  // console.log("recruiter profile view component rendered");

  const [profile, setProfile] = useState<EvaluatorProfile>(
    initialEvaluatorProfile,
  );
  const { data: profileData } = useGetMyProfile();

  useEffect(() => {
    if (profileData?.data) {
      setProfile((prev) => ({
        ...prev,
        fullName: profileData.data.name || prev.fullName,
        email: profileData.data.email || prev.email,
      }));
    }
  }, [profileData]);
  const [activeTab, setActiveTab] = useState<"profile" | "availability">(
    "profile",
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (updated: Partial<EvaluatorProfile>) => {
    // console.log("updating evaluator profile partial state", updated);
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleAvailability = () => {
    const nextStatus = !profile.isAvailableForReviews;
    // console.log("toggling review availability status", nextstatus);
    setProfile((prev) => ({ ...prev, isAvailableForReviews: nextStatus }));

    toast.add({
      title: nextStatus ? "Review Queue Active" : "Review Queue Paused",
      description: nextStatus
        ? "You are now accepting new candidate assessment tasks."
        : "Candidate task assignments temporarily paused.",
      type: nextStatus ? "success" : "info",
    });
  };

  const handleSaveAll = () => {
    // console.log("saving all evaluator profile settings");
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      toast.add({
        title: "Profile & Availability Saved",
        description:
          "Evaluator credentials and capacity limits updated successfully.",
        type: "success",
      });
    }, 800);
  };

  const handleResetDefaults = () => {
    // console.log("resetting evaluator profile to defaults");
    setProfile(initialEvaluatorProfile);
    toast.add({
      title: "Profile Reset",
      description: "Restored initial evaluator defaults.",
      type: "info",
    });
  };

  return (
    <div className="space-y-6">
      {/* profile summary header card */}
      <EvaluatorProfileHeader
        profile={profile}
        onToggleAvailability={handleToggleAvailability}
      />

      {/* tab navigation switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/60 border border-border/60 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <User className="size-4 text-primary" />
            <span>evaluator credentials & skills</span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1">
              profile
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("availability")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "availability"
                ? "bg-card text-foreground shadow-xs border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Settings2 className="size-4 text-emerald-500" />
            <span>availability & capacity SLA</span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1">
              settings
            </Badge>
          </button>
        </div>

        {/* quick save action */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" />
            <span>reset</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            {isSaving ? (
              <span>saving...</span>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>save profile & settings</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* active tab content */}
      {activeTab === "profile" ? (
        <EvaluatorProfileForm profile={profile} onChange={handleUpdate} />
      ) : (
        <EvaluatorAvailabilitySettings
          profile={profile}
          onChange={handleUpdate}
        />
      )}
    </div>
  );
}
