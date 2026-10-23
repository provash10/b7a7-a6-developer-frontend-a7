"use client";

import { Code2, Plus, User, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EvaluatorProfile } from "./types";

interface EvaluatorProfileFormProps {
  profile: EvaluatorProfile;
  onChange: (updated: Partial<EvaluatorProfile>) => void;
}

export function EvaluatorProfileForm({
  profile,
  onChange,
}: EvaluatorProfileFormProps) {
  // console.log("evaluator profile form component rendered");

  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (
      trimmed &&
      !profile.expertiseDomains.some(
        (s) => s.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      // console.log("adding new expertise domain skill", trimmed);
      onChange({
        expertiseDomains: [...profile.expertiseDomains, trimmed],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    // console.log("removing expertise skill");
    onChange({
      expertiseDomains: profile.expertiseDomains.filter(
        (s) => s !== skillToRemove,
      ),
    });
  };

  const suggestedSkills = [
    "Docker",
    "Kafka",
    "gRPC",
    "Redis",
    "Terraform",
    "GraphQL",
    "AWS Lambda",
  ];

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span>personal & professional identity</span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          information presented to candidates upon code review completion and
          recruiter verification reports.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* full name */}
          <div className="space-y-1.5">
            <label
              htmlFor="eval-name"
              className="text-xs font-medium text-foreground block"
            >
              full name
            </label>
            <Input
              id="eval-name"
              type="text"
              value={profile.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              className="text-xs h-9 bg-background/80"
              required
            />
          </div>

          {/* email */}
          <div className="space-y-1.5">
            <label
              htmlFor="eval-email"
              className="text-xs font-medium text-foreground block"
            >
              primary email address
            </label>
            <Input
              id="eval-email"
              type="email"
              value={profile.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="text-xs h-9 bg-background/80"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* professional headline */}
          <div className="md:col-span-2 space-y-1.5">
            <label
              htmlFor="eval-headline"
              className="text-xs font-medium text-foreground block"
            >
              professional headline
            </label>
            <Input
              id="eval-headline"
              type="text"
              value={profile.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              className="text-xs h-9 bg-background/80"
            />
          </div>

          {/* experience in years */}
          <div className="space-y-1.5">
            <label
              htmlFor="eval-exp"
              className="text-xs font-medium text-foreground block"
            >
              software engineering experience
            </label>
            <Input
              id="eval-exp"
              type="number"
              min="1"
              max="40"
              value={profile.experienceYears}
              onChange={(e) =>
                onChange({ experienceYears: Number(e.target.value) || 0 })
              }
              className="text-xs h-9 bg-background/80"
            />
          </div>
        </div>

        {/* company or network affiliation */}
        <div className="space-y-1.5">
          <label
            htmlFor="eval-company"
            className="text-xs font-medium text-foreground block"
          >
            organization / reviewer network
          </label>
          <Input
            id="eval-company"
            type="text"
            value={profile.company}
            onChange={(e) => onChange({ company: e.target.value })}
            className="text-xs h-9 bg-background/80"
          />
        </div>

        {/* bio & evaluation philosophy */}
        <div className="space-y-1.5">
          <label
            htmlFor="eval-bio"
            className="text-xs font-medium text-foreground block"
          >
            bio & technical evaluation approach
          </label>
          <Textarea
            id="eval-bio"
            value={profile.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder="briefly summarize your software engineering background and what you value in code reviews..."
            className="text-xs min-h-[90px] bg-background/80 leading-relaxed"
          />
        </div>

        {/* technical expertise & domains */}
        <div className="space-y-2.5 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Code2 className="size-3.5 text-primary" />
              <span>primary assessment domains & technical skills</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {profile.expertiseDomains.length} domains active
            </span>
          </div>

          {/* active skill pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {profile.expertiseDomains.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs py-1 px-2.5 bg-background/70 border-border/80 text-foreground gap-1.5 font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500 rounded-xs transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* add new skill tag input */}
          <div className="flex items-center gap-2 max-w-sm pt-1">
            <Input
              type="text"
              placeholder="e.g. Apache Kafka, gRPC..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="text-xs h-8 bg-background/80"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddSkill}
              className="h-8 text-xs gap-1"
            >
              <Plus className="size-3" />
              <span>add</span>
            </Button>
          </div>

          {/* suggested skills */}
          <div className="flex flex-wrap items-center gap-1 pt-1 text-[11px] text-muted-foreground">
            <span>suggested:</span>
            {suggestedSkills
              .filter(
                (s) =>
                  !profile.expertiseDomains.some(
                    (d) => d.toLowerCase() === s.toLowerCase(),
                  ),
              )
              .slice(0, 5)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    onChange({
                      expertiseDomains: [...profile.expertiseDomains, s],
                    })
                  }
                  className="px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-[10px] text-foreground font-mono transition-colors"
                >
                  +{s}
                </button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
