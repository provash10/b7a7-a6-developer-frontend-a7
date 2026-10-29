"use client";

import { useForm } from "@tanstack/react-form";
import {
  Check,
  CheckCircle2,
  Code2,
  FileText,
  Globe,
  Lock,
  Plus,
  RotateCcw,
  Save,
  User,
  X,
} from "lucide-react";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { CandidateProfile } from "@/types";
import {
  type CandidateProfileFormData,
  candidateProfileSchema,
} from "@/validation";

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

// predefined popular technical skills for fast selection
const SUGGESTED_SKILLS = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "Python",
  "Go",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Tailwind CSS",
  "GraphQL",
  "AWS",
  "Jest",
  "Prisma",
  "Git",
];

interface ProfileFormProps {
  initialData: CandidateProfile;
  onSaveSuccess?: (updated: CandidateProfile) => void;
}

export function CandidateProfileForm({
  initialData,
  onSaveSuccess,
}: ProfileFormProps) {
  // console.log("candidate profile form mounted");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [skillInputError, setSkillInputError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      headline:
        initialData.headline ||
        "Full-Stack Software Engineer (Next.js & Node.js)",
      location: initialData.location || "Dhaka, Bangladesh",
      experienceYears: initialData.experienceYears ?? 4,
      githubUrl: initialData.githubUrl || "https://github.com/provash10",
      portfolioUrl: initialData.portfolioUrl || "https://provash.dev",
      linkedinUrl:
        initialData.linkedinUrl || "https://linkedin.com/in/provash10",
      resumeUrl:
        initialData.resumeUrl ||
        "https://cloud.devassess.io/resumes/provash-cv.pdf",
      skills: initialData.skills?.length
        ? initialData.skills
        : [
            "TypeScript",
            "Next.js",
            "React",
            "Node.js",
            "PostgreSQL",
            "Tailwind CSS",
          ],
      preferredRole: initialData.preferredRole || "Full Stack Developer",
      bio:
        initialData.bio ||
        "Full-Stack developer with 4+ years building high-performance web applications, scalable rest apis, and reactive user interfaces. Passionate about clean code, test-driven development, and algorithmic problem solving.",
      isAvailableForHire: initialData.isAvailableForHire ?? true,
    } as CandidateProfileFormData,
    validators: {
      onSubmit: candidateProfileSchema as any,
    },
    onSubmit: async ({ value }) => {
      // console.log("submitting candidate profile update", value);
      setIsSubmitting(true);

      // simulate server persistence latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSubmitting(false);

      toast.add({
        title: "Profile Updated Successfully",
        description:
          "Your candidate settings, developer links, and technical skills have been refreshed.",
        type: "success",
      });

      if (onSaveSuccess) {
        onSaveSuccess({
          ...initialData,
          ...value,
        });
      }
    },
  });

  // handle adding a skill tag
  const handleAddSkill = (skillToAdd: string, currentSkills: string[]) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;

    // console.log("adding tech skill", trimmed);

    // check if skill already exists case-insensitively
    const exists = currentSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase(),
    );

    if (exists) {
      setSkillInputError(`"${trimmed}" is already added.`);
      return;
    }

    setSkillInputError(null);
    form.setFieldValue("skills", [...currentSkills, trimmed]);
    setCustomSkillInput("");
  };

  // handle removing a skill tag
  const handleRemoveSkill = (
    skillToRemove: string,
    currentSkills: string[],
  ) => {
    // console.log("removing tech skill");
    form.setFieldValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove),
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {/* personal & professional details */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <User className="size-4" />
            <span>candidate identity</span>
          </div>
          <CardTitle className="text-lg">personal details & bio</CardTitle>
          <CardDescription className="text-xs">
            recruiters see these details on your assessment reports and
            technical profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* full name */}
            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>full name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Provash Kumar"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* email (read only identifier) */}
            <form.Field name="email">
              {(field) => {
                return (
                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>
                        registered email
                      </FieldLabel>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <Lock className="size-3" />
                        verified
                      </span>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      readOnly
                      disabled
                      className="bg-muted/60 text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      managed by authentication provider.
                    </p>
                  </Field>
                );
              }}
            </form.Field>

            {/* headline */}
            <form.Field name="headline">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid} className="md:col-span-2">
                    <FieldLabel htmlFor={field.name}>
                      professional headline
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Senior Full-Stack Developer (Next.js & TypeScript)"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* phone */}
            <form.Field name="phone">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      phone / whatsapp
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      placeholder="+880 1700 000000"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* location */}
            <form.Field name="location">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      current location
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Dhaka, Bangladesh (or Remote)"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* years of experience */}
            <form.Field name="experienceYears">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      coding experience (years)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      max={50}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* preferred role */}
            <form.Field name="preferredRole">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>preferred role</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Full Stack Developer"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* bio summary */}
            <form.Field name="bio">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid} className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>
                        professional summary / bio
                      </FieldLabel>
                      <span className="text-[11px] text-muted-foreground">
                        {field.state.value?.length || 0} / 1200 characters
                      </span>
                    </div>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      placeholder="brief overview of your engineering specialties, backend architectures, frontend workflows, and projects."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* developer & portfolio links */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Globe className="size-4" />
            <span>developer footprint</span>
          </div>
          <CardTitle className="text-lg">
            github, portfolio & resume links
          </CardTitle>
          <CardDescription className="text-xs">
            recruiters and hiring managers inspect these repositories and
            documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* github profile url */}
            <form.Field name="githubUrl">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1.5"
                    >
                      <GithubIcon className="size-3.5 text-foreground" />
                      <span>github profile url</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      placeholder="https://github.com/your-username"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* linkedin profile url */}
            <form.Field name="linkedinUrl">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1.5"
                    >
                      <LinkedinIcon className="size-3.5 text-blue-600" />
                      <span>linkedin profile url</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      placeholder="https://linkedin.com/in/your-profile"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* portfolio website url */}
            <form.Field name="portfolioUrl">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1.5"
                    >
                      <Globe className="size-3.5 text-primary" />
                      <span>personal portfolio website</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      placeholder="https://yourname.dev"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* resume url */}
            <form.Field name="resumeUrl">
              {(field) => {
                const isInvalid = field.state.meta.errors.length > 0;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="flex items-center gap-1.5"
                    >
                      <FileText className="size-3.5 text-amber-500" />
                      <span>resume / cv document url</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      placeholder="https://drive.google.com/... or pdf url"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* technical skills editor */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Code2 className="size-4" />
              <span>technical competencies</span>
            </div>
            <form.Field name="skills">
              {(field) => (
                <Badge variant="outline" className="text-xs">
                  {field.state.value.length} skills selected
                </Badge>
              )}
            </form.Field>
          </div>
          <CardTitle className="text-lg">tech stack & skills editor</CardTitle>
          <CardDescription className="text-xs">
            add programming languages, frameworks, databases, and engineering
            tools you master.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <form.Field name="skills">
            {(field) => {
              const currentSkills = field.state.value || [];
              const isInvalid = field.state.meta.errors.length > 0;

              return (
                <div className="space-y-5">
                  {/* custom skill adder input */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="type any tech skill (e.g. Docker, Rust, Kubernetes, Redis)..."
                        value={customSkillInput}
                        onChange={(e) => {
                          setCustomSkillInput(e.target.value);
                          if (skillInputError) setSkillInputError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill(customSkillInput, currentSkills);
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        handleAddSkill(customSkillInput, currentSkills)
                      }
                      className="gap-1.5 shrink-0"
                    >
                      <Plus className="size-3.5" />
                      <span>add skill</span>
                    </Button>
                  </div>

                  {skillInputError && (
                    <p className="text-xs text-destructive">
                      {skillInputError}
                    </p>
                  )}
                  {isInvalid && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}

                  {/* active selected skills pills */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-foreground">
                      your active skills:
                    </span>
                    {currentSkills.length === 0 ? (
                      <div className="p-4 rounded-lg border border-dashed border-border/80 text-center text-xs text-muted-foreground">
                        no skills added yet. type a skill above or click from
                        suggestions below.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {currentSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary shadow-2xs transition-all hover:bg-primary/15"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveSkill(skill, currentSkills)
                              }
                              className="size-4 rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-destructive transition-colors"
                              title={`remove ${skill}`}
                            >
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* quick suggested skills */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <span className="text-xs font-medium text-muted-foreground">
                      suggested skills (click to add):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_SKILLS.map((suggested) => {
                        const isAdded = currentSkills.some(
                          (s) => s.toLowerCase() === suggested.toLowerCase(),
                        );
                        return (
                          <button
                            key={suggested}
                            type="button"
                            disabled={isAdded}
                            onClick={() =>
                              handleAddSkill(suggested, currentSkills)
                            }
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors border ${
                              isAdded
                                ? "bg-muted text-muted-foreground border-transparent opacity-50 cursor-not-allowed"
                                : "bg-card hover:bg-muted text-foreground border-border/80 hover:border-primary/50"
                            }`}
                          >
                            {isAdded ? (
                              <Check className="size-2.5 text-emerald-500" />
                            ) : (
                              <Plus className="size-2.5 text-muted-foreground" />
                            )}
                            <span>{suggested}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }}
          </form.Field>
        </CardContent>
      </Card>

      {/* availability status toggle */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardContent className="p-6">
          <form.Field name="isAvailableForHire">
            {(field) => (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      open for technical hiring & interviews
                    </span>
                    {field.state.value ? (
                      <Badge variant="success" className="text-[10px]">
                        available
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        not actively looking
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    enable this to let vetted tech companies invite you to
                    coding challenges.
                  </p>
                </div>
                <Button
                  type="button"
                  variant={field.state.value ? "default" : "outline"}
                  onClick={() => field.handleChange(!field.state.value)}
                  className="gap-2 shrink-0"
                >
                  {field.state.value ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      <span>status: available</span>
                    </>
                  ) : (
                    <span>status: paused</span>
                  )}
                </Button>
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* form submit actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => {
            // console.log("resetting profile form to initial values");
            form.reset();
            toast.add({
              title: "Changes Reset",
              description: "Form values restored to saved state.",
              type: "info",
            });
          }}
          className="w-full sm:w-auto gap-2"
        >
          <RotateCcw className="size-3.5" />
          <span>discard changes</span>
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto gap-2 min-w-44 shadow-md"
        >
          {isSubmitting ? (
            <>
              <Spinner className="size-3.5" />
              <span>saving profile...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>save profile changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
