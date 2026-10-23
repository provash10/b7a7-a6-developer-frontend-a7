"use client";

import {
  Award,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CandidateProfile } from "@/types";

// github brand icon vector
function GithubIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// linkedin brand icon vector
function LinkedinIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface ProfileHeaderProps {
  profile: CandidateProfile;
  completionPercentage?: number;
}

export function ProfileHeader({
  profile,
  completionPercentage = 92,
}: ProfileHeaderProps) {
  // console.log("rendering candidate profile header");

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/80 bg-linear-to-br from-card via-card/90 to-muted/30 p-6 shadow-sm">
      {/* decorative ambient glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* candidate identity & avatar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <div className="flex size-20 sm:size-24 items-center justify-center rounded-2xl bg-linear-to-tr from-primary to-primary/60 text-2xl font-bold text-primary-foreground shadow-md ring-4 ring-background">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            {profile.isAvailableForHire && (
              <span
                className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background"
                title="available for hire"
              >
                <CheckCircle2 className="size-3.5 text-white" />
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {profile.name}
              </h1>
              <Badge variant="success" className="gap-1 text-[11px]">
                <Sparkles className="size-3" />
                <span>verified candidate</span>
              </Badge>
              {profile.isAvailableForHire && (
                <Badge variant="amber" className="text-[11px]">
                  open to work
                </Badge>
              )}
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              {profile.headline || "Full-Stack Software Engineer"}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  {profile.location}
                </span>
              )}
              {profile.experienceYears !== undefined && (
                <span className="flex items-center gap-1">
                  <Award className="size-3.5 text-amber-500" />
                  {profile.experienceYears} years experience
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500" />
                active candidate
              </span>
            </div>
          </div>
        </div>

        {/* profile completion meter and fast links */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          {/* completion bar */}
          <div className="w-full sm:w-64 rounded-lg border border-border/60 bg-background/60 p-3 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-muted-foreground">
                profile completeness
              </span>
              <span className="font-semibold text-primary">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-emerald-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* fast link buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {profile.githubUrl && (
              <a
                href={
                  profile.githubUrl.startsWith("http")
                    ? profile.githubUrl
                    : `https://${profile.githubUrl}`
                }
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "gap-1.5",
                )}
              >
                <GithubIcon className="size-3.5" />
                <span>github</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>
            )}

            {profile.portfolioUrl && (
              <a
                href={
                  profile.portfolioUrl.startsWith("http")
                    ? profile.portfolioUrl
                    : `https://${profile.portfolioUrl}`
                }
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "gap-1.5",
                )}
              >
                <Globe className="size-3.5" />
                <span>portfolio</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>
            )}

            {profile.linkedinUrl && (
              <a
                href={
                  profile.linkedinUrl.startsWith("http")
                    ? profile.linkedinUrl
                    : `https://${profile.linkedinUrl}`
                }
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "gap-1.5",
                )}
              >
                <LinkedinIcon className="size-3.5 text-blue-600" />
                <span>linkedin</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>
            )}

            {profile.resumeUrl && (
              <a
                href={
                  profile.resumeUrl.startsWith("http")
                    ? profile.resumeUrl
                    : `https://${profile.resumeUrl}`
                }
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "gap-1.5",
                )}
              >
                <FileText className="size-3.5" />
                <span>resume</span>
                <ExternalLink className="size-3 opacity-60" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
