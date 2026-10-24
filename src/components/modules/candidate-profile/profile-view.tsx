"use client";

import { useEffect, useMemo, useState } from "react";
import type { CandidateProfile } from "@/types";
import { useGetMyProfile } from "@/hooks";
import { CandidateProfileForm } from "./profile-form";
import { ProfileHeader } from "./profile-header";
import { ProfileQuickStats } from "./profile-quick-stats";

interface ProfileViewProps {
  initialProfile: CandidateProfile;
}

export function CandidateProfileView({ initialProfile }: ProfileViewProps) {
  // console.log("candidate profile view loaded");

  const [profile, setProfile] = useState<CandidateProfile>(initialProfile);
  const { data: profileData } = useGetMyProfile();

  useEffect(() => {
    if (profileData?.data) {
      setProfile((prev) => ({
        ...prev,
        name: profileData.data.name || prev.name,
        email: profileData.data.email || prev.email,
        userId: profileData.data.id || prev.userId,
      }));
    }
  }, [profileData]);

  // calculate dynamic profile completeness score
  const completionPercentage = useMemo(() => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.email) score += 10;
    if (profile.headline) score += 10;
    if (profile.bio && profile.bio.length >= 20) score += 15;
    if (profile.location) score += 5;
    if (profile.phone) score += 5;
    if (profile.githubUrl) score += 15;
    if (profile.portfolioUrl || profile.linkedinUrl) score += 10;
    if (profile.resumeUrl) score += 10;
    if (profile.skills && profile.skills.length >= 3) score += 10;

    // console.log("calculated profile completion percentage", score);
    return Math.min(100, score);
  }, [profile]);

  const handleSaveSuccess = (updated: CandidateProfile) => {
    // console.log("updating candidate profile state after save", updated);
    setProfile(updated);
  };

  return (
    <div className="space-y-8">
      {/* profile banner & summary header */}
      <ProfileHeader
        profile={profile}
        completionPercentage={completionPercentage}
      />

      {/* grid layout: main settings form + sidebar quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* main profile and skills form */}
        <div className="lg:col-span-2">
          <CandidateProfileForm
            initialData={profile}
            onSaveSuccess={handleSaveSuccess}
          />
        </div>

        {/* sidebar evaluation stats & tips */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileQuickStats />
        </div>
      </div>
    </div>
  );
}
