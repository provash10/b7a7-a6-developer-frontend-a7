"use client";

import {
  Award,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  FileCode,
  Layers,
  Plus,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createAssessment, createQuestion } from "@/api/assessment.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import type { Question } from "@/types";

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
  questionIds?: string[];
}

interface AssessmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: ManagedAssessment | null;
  onSave: (updated: ManagedAssessment) => void;
}

const DEFAULT_AVAILABLE_QUESTIONS: {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  marks: number;
}[] = [
  {
    id: "p1",
    title: "Two Sum - Hash Map Lookup",
    difficulty: "EASY",
    marks: 20,
  },
  {
    id: "p2",
    title: "Palindrome String Validator",
    difficulty: "EASY",
    marks: 20,
  },
  {
    id: "p3",
    title: "Validate Binary Search Tree",
    difficulty: "MEDIUM",
    marks: 30,
  },
  {
    id: "p4",
    title: "LRU Cache Memory Management",
    difficulty: "HARD",
    marks: 40,
  },
];

export function AssessmentEditModal({
  isOpen,
  onClose,
  assessment,
  onSave,
}: AssessmentEditModalProps) {
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
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([
    "p1",
    "p2",
  ]);
  const [availableQuestions, setAvailableQuestions] = useState(
    DEFAULT_AVAILABLE_QUESTIONS,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline question creator state
  const [isInlineAddingQ, setIsInlineAddingQ] = useState(false);
  const [inlineQTitle, setInlineQTitle] = useState("");
  const [inlineQDesc, setInlineQDesc] = useState("");
  const [inlineQDifficulty, setInlineQDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [inlineQMarks, setInlineQMarks] = useState(20);
  const [inlineQInput, setInlineQInput] = useState("[2, 7, 11, 15], 9");
  const [inlineQOutput, setInlineQOutput] = useState("[0, 1]");

  // Load custom questions created by user + defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem("devassess_custom_questions");
      if (stored) {
        const custom: Question[] = JSON.parse(stored);
        if (custom.length > 0) {
          const mapped = custom.map((c) => ({
            id: c.id,
            title: c.title,
            difficulty: (c.difficulty as any) || "MEDIUM",
            marks: c.marks || 20,
          }));
          // Merge unique
          const combined = [...mapped, ...DEFAULT_AVAILABLE_QUESTIONS];
          const unique = Array.from(new Map(combined.map((q) => [q.id, q])).values());
          setAvailableQuestions(unique);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [isOpen]);

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
      if (assessment.questionIds?.length) {
        setSelectedQuestionIds(assessment.questionIds);
      }
    } else {
      setTitle("");
      setCompany("");
      setDurationMinutes(90);
      setPassMarks(70);
      setTotalMarks(100);
      setStatus("PUBLISHED");
      setDifficulty("MEDIUM");
      setSkillsText("Next.js, TypeScript, Tailwind CSS");
      setSelectedQuestionIds(["p1", "p2"]);
    }
  }, [assessment, isOpen]);

  if (!isOpen) return null;

  const toggleQuestion = (qId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId],
    );
  };

  const handleSaveInlineQuestion = async () => {
    if (!inlineQTitle.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Please enter a question title.",
        type: "error",
      });
      return;
    }

    const newId = `q-${Date.now().toString().slice(-5)}`;
    const newQObj = {
      id: newId,
      title: inlineQTitle.trim(),
      difficulty: inlineQDifficulty,
      marks: Number(inlineQMarks) || 20,
      description: inlineQDesc.trim() || inlineQTitle.trim(),
      testCases: [{ input: inlineQInput, expectedOutput: inlineQOutput, isHidden: false }],
    };

    try {
      const res = await createQuestion({
        title: newQObj.title,
        description: newQObj.description,
        type: "CODING",
        difficulty: newQObj.difficulty,
        marks: newQObj.marks,
        testCases: newQObj.testCases,
      });
      console.log("Database Question Save Success:", res);
      toast.add({
        title: "Saved in Database! 🚀",
        description: `"${newQObj.title}" has been saved to the database 'questions' table.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Database Question Save Error:", err);
      const statusCode = err?.status || err?.statusCode || "Network";
      const errMsg = err?.data?.message || err?.message || "Could not reach backend on port 5000";
      toast.add({
        title: `Database Save Failed (${statusCode}) ⚠️`,
        description: `${errMsg}. (Saved in browser memory for testing).`,
        type: "error",
      });
    }

    try {
      const stored = localStorage.getItem("devassess_custom_questions");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newQObj);
      localStorage.setItem("devassess_custom_questions", JSON.stringify(list));
    } catch (e) {
      // ignore
    }

    setAvailableQuestions((prev) => [newQObj, ...prev]);
    setSelectedQuestionIds((prev) => [newId, ...prev]);

    setIsInlineAddingQ(false);
    setInlineQTitle("");
    setInlineQDesc("");

    toast.add({
      title: "Question Attached! 🎯",
      description: `"${newQObj.title}" added to this challenge and question bank.`,
      type: "success",
    });
  };

  const totalCalculatedMarks = availableQuestions
    .filter((q) => selectedQuestionIds.includes(q.id))
    .reduce((sum, q) => sum + q.marks, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) {
      toast.add({
        title: "Missing Fields",
        description: "Challenge title and hiring company are required.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    const parsedSkills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const asstId = assessment
      ? assessment.id
      : `asst-${Date.now().toString().slice(-4)}`;

    const updatedData: ManagedAssessment = {
      id: asstId,
      title: title.trim(),
      description: assessment
        ? assessment.description
        : "Interactive developer coding challenge evaluated against automated unit tests and AST analysis.",
      company: company.trim(),
      durationMinutes: Number(durationMinutes),
      passMarks: Number(passMarks),
      totalMarks: totalCalculatedMarks > 0 ? totalCalculatedMarks : Number(totalMarks),
      status,
      difficulty,
      skills: parsedSkills.length ? parsedSkills : ["TypeScript", "Next.js"],
      submissionsCount: assessment ? assessment.submissionsCount : 0,
      passRate: assessment ? assessment.passRate : 0,
      questionIds: selectedQuestionIds,
    };

    // Save relation to assessment_questions table in database API
    try {
      await createAssessment({
        title: updatedData.title,
        description: updatedData.description,
        durationMinutes: updatedData.durationMinutes,
        passMarks: updatedData.passMarks,
        totalMarks: updatedData.totalMarks,
        status: updatedData.status,
        difficulty: updatedData.difficulty,
        skills: updatedData.skills,
        questionIds: selectedQuestionIds,
      });

      toast.add({
        title: "Challenge Saved in Database! 🚀",
        description: `Linked ${selectedQuestionIds.length} questions to assessment_questions table.`,
        type: "success",
      });
    } catch (err: any) {
      console.error("Database Assessment Save Error:", err);
      const statusCode = err?.status || err?.statusCode || "Network";
      const errMsg = err?.data?.message || err?.message || "Could not reach backend on port 5000";
      toast.add({
        title: `Assessment Save Failed (${statusCode}) ⚠️`,
        description: `${errMsg}. (Saved locally in catalog).`,
        type: "error",
      });
    } finally {
      // Map questions to assessment for live candidate exam room
      try {
        localStorage.setItem(
          `assessment_questions_${asstId}`,
          JSON.stringify(selectedQuestionIds),
        );
      } catch (e) {
        // ignore
      }

      setIsSubmitting(false);
      onSave(updatedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-primary/30 bg-card/95 shadow-2xl shadow-primary/10 flex flex-col max-h-[92vh] my-auto overflow-hidden">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-primary/20 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-48 rounded-full bg-emerald-500/15 blur-3xl opacity-70" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between px-6 py-4.5 border-b border-border/80 bg-gradient-to-r from-primary/10 via-background/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary shadow-xs">
              <FileCode className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {assessment ? "Edit Challenge" : "Author New Challenge"}
                </h2>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-mono border-primary/40 text-primary bg-primary/5"
                >
                  assessments & questions
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define evaluation benchmarks and link coding questions together.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs pr-4"
        >
          {/* Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="assessment-title"
                className="font-semibold text-foreground flex items-center gap-1.5"
              >
                <span>Challenge Title *</span>
              </label>
              <Input
                id="assessment-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Stack Next.js & TypeScript Challenge"
                required
                className="text-xs sm:text-sm bg-background/80 border-border/80 focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="assessment-company"
                className="font-semibold text-foreground flex items-center gap-1.5"
              >
                <span>Hiring Organization / Company *</span>
              </label>
              <Input
                id="assessment-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TechCorp Labs / DevPulse Inc."
                required
                className="text-xs sm:text-sm bg-background/80 border-border/80 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Duration, Pass Marks, Total Marks */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="assessment-duration"
                className="font-semibold text-foreground flex items-center gap-1"
              >
                <Clock className="size-3 text-muted-foreground" />
                <span>Duration (Mins)</span>
              </label>
              <Input
                id="assessment-duration"
                type="number"
                min={15}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                required
                className="text-xs sm:text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="assessment-passmarks"
                className="font-semibold text-foreground flex items-center gap-1"
              >
                <Award className="size-3 text-emerald-500" />
                <span>Pass Marks</span>
              </label>
              <Input
                id="assessment-passmarks"
                type="number"
                min={0}
                max={200}
                value={passMarks}
                onChange={(e) => setPassMarks(Number(e.target.value))}
                required
                className="text-xs sm:text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="assessment-totalmarks"
                className="font-semibold text-foreground flex items-center gap-1"
              >
                <Sparkles className="size-3 text-amber-500" />
                <span>Total Marks</span>
              </label>
              <Input
                id="assessment-totalmarks"
                type="number"
                value={totalCalculatedMarks > 0 ? totalCalculatedMarks : totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                required
                className="text-xs sm:text-sm font-mono bg-muted/40 font-bold text-primary"
              />
            </div>
          </div>

          {/* Status & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "PUBLISHED" | "DRAFT" | "ARCHIVED")
                }
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
              >
                <option value="PUBLISHED">Published (Available to Candidates)</option>
                <option value="DRAFT">Draft (Under Preparation)</option>
                <option value="ARCHIVED">Archived (Closed)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as "EASY" | "MEDIUM" | "HARD")
                }
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Intermediate / Medium</option>
                <option value="HARD">Advanced / Hard</option>
              </select>
            </div>
          </div>

          {/* Evaluated Skills */}
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              Evaluated Skills (comma-separated)
            </label>
            <Input
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. Next.js 15, TypeScript, API Route Handlers, Tailwind CSS"
              className="text-xs sm:text-sm bg-background/80"
            />
          </div>

          {/* 🔗 LINK QUESTIONS SECTION (Directly connects to assessment_questions table) */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground text-xs sm:text-sm">
                    Assign Questions to this Challenge
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Selected questions will be mapped via{" "}
                    <code className="text-primary font-mono font-semibold">
                      assessment_questions
                    </code>{" "}
                    table.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={isInlineAddingQ ? "destructive" : "default"}
                  onClick={() => setIsInlineAddingQ(!isInlineAddingQ)}
                  className="h-8 text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className={`size-3.5 transition-transform ${isInlineAddingQ ? "rotate-45" : ""}`} />
                  <span>{isInlineAddingQ ? "Cancel" : "+ Write New Question"}</span>
                </Button>

                <Badge
                  variant="outline"
                  className="text-xs font-mono font-semibold px-2.5 py-1 bg-background/80 border-primary/30 text-primary shadow-2xs"
                >
                  {selectedQuestionIds.length} Selected ({totalCalculatedMarks} Marks)
                </Badge>
              </div>
            </div>

            {/* Inline Question Authoring Form */}
            {isInlineAddingQ && (
              <div className="p-4 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-background to-card shadow-lg space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" />
                    <span>Author New Question for this Challenge</span>
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Saves to questions & assessment_questions
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">Question Title *</label>
                    <Input
                      placeholder="e.g. Invert a Binary Tree / Two Sum Problem"
                      value={inlineQTitle}
                      onChange={(e) => setInlineQTitle(e.target.value)}
                      className="text-xs h-8 bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Difficulty</label>
                      <select
                        value={inlineQDifficulty}
                        onChange={(e) => setInlineQDifficulty(e.target.value as any)}
                        className="w-full h-8 text-xs bg-background border border-border rounded-md px-2"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Marks</label>
                      <Input
                        type="number"
                        min={5}
                        max={100}
                        value={inlineQMarks}
                        onChange={(e) => setInlineQMarks(Number(e.target.value))}
                        className="text-xs h-8 bg-background font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">Problem Description</label>
                  <Input
                    placeholder="Short description of the coding task and constraints..."
                    value={inlineQDesc}
                    onChange={(e) => setInlineQDesc(e.target.value)}
                    className="text-xs h-8 bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">Test Case Input</label>
                    <Input
                      value={inlineQInput}
                      onChange={(e) => setInlineQInput(e.target.value)}
                      placeholder="e.g. [2,7,11,15], 9"
                      className="text-xs font-mono h-8 bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground">Expected Output</label>
                    <Input
                      value={inlineQOutput}
                      onChange={(e) => setInlineQOutput(e.target.value)}
                      placeholder="e.g. [0, 1]"
                      className="text-xs font-mono h-8 bg-background"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsInlineAddingQ(false)}
                    className="h-7 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveInlineQuestion}
                    className="h-7 text-xs font-bold bg-primary text-primary-foreground gap-1"
                  >
                    <CheckCircle2 className="size-3" />
                    <span>Save & Attach Question</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Questions Grid with eye-catching hover effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {availableQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestion(q.id)}
                    className={`group relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary/30 hover:bg-primary/15 hover:border-primary"
                        : "bg-muted/30 border-border/70 hover:border-primary/50 hover:bg-muted/70 hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={`mt-0.5 size-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border/80 bg-background group-hover:border-primary/50"
                      }`}
                    >
                      {isSelected && <Check className="size-3 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold leading-snug line-clamp-2 transition-colors ${
                          isSelected
                            ? "text-foreground font-bold"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {q.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            q.difficulty === "HARD"
                              ? "bg-rose-500/15 text-rose-500"
                              : q.difficulty === "MEDIUM"
                                ? "bg-amber-500/15 text-amber-500"
                                : "bg-emerald-500/15 text-emerald-500"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {q.marks} pts
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs hover:bg-muted cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <CheckCircle2 className="size-3.5" />
              <span>
                {isSubmitting
                  ? "Saving to Database..."
                  : assessment
                    ? "Update Challenge & Questions"
                    : "Publish Challenge & Questions"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
