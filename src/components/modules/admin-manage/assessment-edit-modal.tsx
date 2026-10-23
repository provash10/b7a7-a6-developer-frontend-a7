"use client";

import { FileCode, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ManagedAssessment {
  id: string;
  title: string;
  description: string;
  company: string;
  durationMinutes: number;
  passMarks: number;
  totalMarks: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  skills: string[];
  submissionsCount: number;
  passRate: number;
}

interface AssessmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: ManagedAssessment | null;
  onSave: (updated: ManagedAssessment) => void;
}

export function AssessmentEditModal({
  isOpen,
  onClose,
  assessment,
  onSave,
}: AssessmentEditModalProps) {
  // console.log("assessment edit modal rendered", assessment?.id);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [passMarks, setPassMarks] = useState(70);
  const [totalMarks, setTotalMarks] = useState(100);
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT" | "ARCHIVED">(
    "PUBLISHED",
  );
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "MEDIUM",
  );
  const [skillsText, setSkillsText] = useState("");

  useEffect(() => {
    if (assessment) {
      setTitle(assessment.title);
      setCompany(assessment.company);
      setDurationMinutes(assessment.durationMinutes);
      setPassMarks(assessment.passMarks);
      setTotalMarks(assessment.totalMarks);
      setStatus(assessment.status);
      setDifficulty(assessment.difficulty);
      setSkillsText(assessment.skills.join(", "));
    } else {
      setTitle("");
      setCompany("");
      setDurationMinutes(90);
      setPassMarks(70);
      setTotalMarks(100);
      setStatus("DRAFT");
      setDifficulty("MEDIUM");
      setSkillsText("Next.js, TypeScript, Tailwind CSS");
    }
  }, [assessment]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;

    // console.log("saving assessment challenge", title);
    const parsedSkills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      id: assessment
        ? assessment.id
        : `asst-${Date.now().toString().slice(-4)}`,
      title,
      description: assessment
        ? assessment.description
        : "Interactive developer coding challenge evaluated against automated unit tests and AST analysis.",
      company,
      durationMinutes: Number(durationMinutes),
      passMarks: Number(passMarks),
      totalMarks: Number(totalMarks),
      status,
      difficulty,
      skills: parsedSkills.length ? parsedSkills : ["TypeScript", "Next.js"],
      submissionsCount: assessment ? assessment.submissionsCount : 0,
      passRate: assessment ? assessment.passRate : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* modal header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base">
            <FileCode className="size-4 text-primary" />
            <span>
              {assessment
                ? "edit assessment challenge"
                : "create assessment challenge"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* edit form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* title */}
          <div className="space-y-1.5">
            <label
              htmlFor="assessment-title"
              className="font-medium text-foreground"
            >
              challenge title
            </label>
            <Input
              id="assessment-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Next.js 15 & TypeScript Challenge"
              required
            />
          </div>

          {/* company / organizer */}
          <div className="space-y-1.5">
            <label
              htmlFor="assessment-company"
              className="font-medium text-foreground"
            >
              hiring company / recruiter
            </label>
            <Input
              id="assessment-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TechCorp Labs"
              required
            />
          </div>

          {/* grid: duration, pass marks, total marks */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="assessment-duration"
                className="font-medium text-foreground"
              >
                duration (mins)
              </label>
              <Input
                id="assessment-duration"
                type="number"
                min={15}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="assessment-passmarks"
                className="font-medium text-foreground"
              >
                pass marks
              </label>
              <Input
                id="assessment-passmarks"
                type="number"
                min={0}
                max={100}
                value={passMarks}
                onChange={(e) => setPassMarks(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="assessment-totalmarks"
                className="font-medium text-foreground"
              >
                total marks
              </label>
              <Input
                id="assessment-totalmarks"
                type="number"
                min={50}
                max={200}
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* status & difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="assessment-status"
                className="font-medium text-foreground"
              >
                publishing status
              </label>
              <select
                id="assessment-status"
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "PUBLISHED" | "DRAFT" | "ARCHIVED",
                  )
                }
                className="w-full h-8 px-2.5 rounded-none border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="PUBLISHED">Published (Available)</option>
                <option value="DRAFT">Draft (Under Review)</option>
                <option value="ARCHIVED">Archived (Closed)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="assessment-difficulty"
                className="font-medium text-foreground"
              >
                difficulty level
              </label>
              <select
                id="assessment-difficulty"
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")
                }
                className="w-full h-8 px-2.5 rounded-none border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Intermediate</option>
                <option value="HARD">Advanced / Hard</option>
              </select>
            </div>
          </div>

          {/* skills tags */}
          <div className="space-y-1.5">
            <label
              htmlFor="assessment-skills"
              className="font-medium text-foreground"
            >
              evaluated skills (comma-separated)
            </label>
            <Input
              id="assessment-skills"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. Next.js 15, TypeScript, API Routes, Tailwind CSS"
            />
          </div>

          {/* actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
            <Button type="button" variant="outline" size="xs" onClick={onClose}>
              cancel
            </Button>
            <Button type="submit" size="xs" className="gap-1">
              <span>
                {assessment ? "update challenge" : "publish challenge"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
