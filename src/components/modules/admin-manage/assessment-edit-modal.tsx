"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  FileCode,
  Layers,
  Plus,
  Rocket,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  createAssessment,
  createQuestion,
  getAllQuestions,
} from "@/api/assessment.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export interface QuestionBankItem {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  marks: number;
  description?: string;
}

const DEFAULT_AVAILABLE_QUESTIONS: QuestionBankItem[] = [
  {
    id: "p1",
    title: "Two Sum Problem - Hash Map Lookup",
    difficulty: "EASY",
    marks: 20,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
  },
  {
    id: "p2",
    title: "Valid Palindrome String Validator",
    difficulty: "EASY",
    marks: 20,
    description: "Verify if a string reads the same forward and backward after removing all non-alphanumeric characters.",
  },
  {
    id: "p3",
    title: "Reverse a String with Case Preservation",
    difficulty: "EASY",
    marks: 15,
    description: "Write a function that reverses an input string with exact casing and punctuation preserved.",
  },
  {
    id: "p4",
    title: "FizzBuzz Number Evaluator",
    difficulty: "EASY",
    marks: 20,
    description: "Return Fizz for multiples of 3, Buzz for 5, and FizzBuzz for multiples of both 3 and 5.",
  },
  {
    id: "p5",
    title: "Maximum Subarray Sum (Kadane's Algorithm)",
    difficulty: "MEDIUM",
    marks: 25,
    description: "Find the contiguous subarray within a one-dimensional integer array which has the largest sum.",
  },
  {
    id: "p6",
    title: "Validate Binary Search Tree (BST In-Order)",
    difficulty: "MEDIUM",
    marks: 30,
    description: "Determine if a given binary tree satisfies standard binary search tree invariant properties.",
  },
  {
    id: "p7",
    title: "LRU Cache Memory Management Engine",
    difficulty: "HARD",
    marks: 40,
    description: "Design and implement a Least Recently Used (LRU) data structure with O(1) time complexity.",
  },
];

export function AssessmentEditModal({
  isOpen,
  onClose,
  assessment,
  onSave,
}: AssessmentEditModalProps) {
  // Wizard Step State: 1 = Basic Info, 2 = Questions, 3 = Settings & Publish
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [passMarks, setPassMarks] = useState(20);
  const [totalMarks, setTotalMarks] = useState(100);
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT" | "ARCHIVED">("PUBLISHED");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [skillsText, setSkillsText] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionBankItem[]>(
    DEFAULT_AVAILABLE_QUESTIONS,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline question creator state (inside Step 2)
  const [isInlineAddingQ, setIsInlineAddingQ] = useState(false);
  const [inlineQTitle, setInlineQTitle] = useState("");
  const [inlineQDesc, setInlineQDesc] = useState("");
  const [inlineQDifficulty, setInlineQDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [inlineQMarks, setInlineQMarks] = useState(20);
  const [inlineQInput, setInlineQInput] = useState("[2, 7, 11, 15], 9");
  const [inlineQOutput, setInlineQOutput] = useState("[0, 1]");

  // Load database questions + custom questions + defaults
  useEffect(() => {
    const fetchDbQuestions = async () => {
      try {
        const res = await getAllQuestions();
        const items = res?.data || (res as any)?.data?.data;
        if (Array.isArray(items) && items.length > 0) {
          const mapped: QuestionBankItem[] = items.map((q: any) => ({
            id: q.id,
            title: q.title,
            difficulty: (q.difficulty as any) || "MEDIUM",
            marks: q.marks || 20,
            description: q.description,
          }));
          setAvailableQuestions((prev) => {
            const combined = [...mapped, ...prev];
            return Array.from(new Map(combined.map((item) => [item.id, item])).values());
          });
        }
      } catch (err) {
        // use local defaults if API unreachable
      }
    };

    if (isOpen) {
      fetchDbQuestions();
    }

    try {
      const stored = localStorage.getItem("devassess_custom_questions");
      if (stored) {
        const custom: Question[] = JSON.parse(stored);
        if (custom.length > 0) {
          const mapped: QuestionBankItem[] = custom.map((c) => ({
            id: c.id,
            title: c.title,
            difficulty: (c.difficulty as any) || "MEDIUM",
            marks: c.marks || 20,
            description: c.description,
          }));
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
      setDescription(assessment.description || "");
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
      setDescription("Candidates are required to solve algorithmic and backend coding problems within the allotted time. Passing score required for certification.");
      setCompany("");
      setDurationMinutes(60);
      setPassMarks(20);
      setTotalMarks(40);
      setStatus("PUBLISHED");
      setDifficulty("MEDIUM");
      setSkillsText("Go, SQL, PostgreSQL, Docker");
      setSelectedQuestionIds([]);
    }
    setCurrentStep(1);
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
    const newQObj: QuestionBankItem = {
      id: newId,
      title: inlineQTitle.trim(),
      difficulty: inlineQDifficulty,
      marks: Number(inlineQMarks) || 20,
      description: inlineQDesc.trim() || inlineQTitle.trim(),
    };

    try {
      await createQuestion({
        title: newQObj.title,
        description: newQObj.description || newQObj.title,
        type: "CODING",
        difficulty: newQObj.difficulty,
        marks: newQObj.marks,
        testCases: [{ input: inlineQInput, expectedOutput: inlineQOutput, isHidden: false }],
      });
      toast.add({
        title: "Saved in Database! 🚀",
        description: `"${newQObj.title}" has been saved to the database 'questions' table.`,
        type: "success",
      });
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Could not reach backend on port 5000";
      toast.add({
        title: "Question Stored Locally 🎯",
        description: `${errMsg}. (Attached to challenge in session).`,
        type: "info",
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
  };

  const totalCalculatedMarks = availableQuestions
    .filter((q) => selectedQuestionIds.includes(q.id))
    .reduce((sum, q) => sum + q.marks, 0);

  // Step 1 Validation
  const validateStep1 = () => {
    if (!title.trim()) {
      toast.add({
        title: "Title Required",
        description: "Please specify an assessment challenge title (e.g. Senior Backend Go & SQL Challenge).",
        type: "error",
      });
      return false;
    }
    if (!company.trim()) {
      toast.add({
        title: "Organization Required",
        description: "Please specify the hiring organization or company.",
        type: "error",
      });
      return false;
    }
    if (!durationMinutes || durationMinutes <= 0) {
      toast.add({
        title: "Duration Required",
        description: "Please enter a valid duration in minutes (e.g. 75).",
        type: "error",
      });
      return false;
    }
    if (passMarks === undefined || passMarks === null || passMarks < 0) {
      toast.add({
        title: "Passing Marks Required",
        description: "Please specify passing marks (e.g. 60).",
        type: "error",
      });
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (selectedQuestionIds.length === 0) {
      toast.add({
        title: "Questions Required",
        description: "Please select at least one coding question for this challenge.",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      if (totalCalculatedMarks > 0 && passMarks > totalCalculatedMarks) {
        setPassMarks(Math.round(totalCalculatedMarks * 0.6) || totalCalculatedMarks);
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    setIsSubmitting(true);
    const parsedSkills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const asstId = assessment
      ? assessment.id
      : `asst-${Date.now().toString().slice(-4)}`;

    const effectiveTotal = totalCalculatedMarks > 0 ? totalCalculatedMarks : Number(totalMarks);

    const updatedData: ManagedAssessment = {
      id: asstId,
      title: title.trim(),
      description:
        description.trim() ||
        (assessment
          ? assessment.description
          : "Interactive developer coding challenge evaluated against automated test cases and anti-cheat telemetry."),
      company: company.trim(),
      durationMinutes: Number(durationMinutes),
      passMarks: Math.min(Number(passMarks), effectiveTotal),
      totalMarks: effectiveTotal,
      status,
      difficulty,
      skills: parsedSkills.length ? parsedSkills : ["TypeScript", "Next.js"],
      submissionsCount: assessment ? assessment.submissionsCount : 0,
      passRate: assessment ? assessment.passRate : 0,
      questionIds: selectedQuestionIds,
    };

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
        title: "Challenge Published to Database! 🚀",
        description: `Linked ${selectedQuestionIds.length} questions to assessment_questions table.`,
        type: "success",
      });
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Could not reach backend on port 5000";
      toast.add({
        title: "Saved to Local Catalog 🎯",
        description: `${errMsg}. (Challenge ready for testing in portal).`,
        type: "info",
      });
    } finally {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-primary/30 bg-card/95 shadow-2xl shadow-primary/10 flex flex-col max-h-[92vh] my-auto overflow-hidden">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-primary/20 blur-3xl opacity-75" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-60 rounded-full bg-emerald-500/15 blur-3xl opacity-75" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-border/80 bg-gradient-to-r from-primary/10 via-background/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary shadow-xs">
              <FileCode className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {assessment ? "Edit Assessment Wizard" : "Create Assessment Wizard"}
                </h2>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-mono border-primary/40 text-primary bg-primary/5"
                >
                  Step {currentStep} of 3
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Multi-step guided workflow for configuring engineering assessments.
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

        {/* 🚀 Step Progress Navigation Bar */}
        <div className="px-6 py-3 border-b border-border/60 bg-muted/30">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                currentStep === 1
                  ? "bg-primary/15 border-primary shadow-xs text-foreground font-bold ring-1 ring-primary/30"
                  : currentStep > 1
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground hover:bg-emerald-500/15"
                    : "bg-background/50 border-border/60 text-muted-foreground hover:bg-muted/60"
              }`}
            >
              <div
                className={`size-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                  currentStep === 1
                    ? "bg-primary text-primary-foreground"
                    : currentStep > 1
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > 1 ? <Check className="size-3.5 stroke-[3]" /> : "1"}
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="text-[11px] uppercase tracking-wider font-semibold opacity-75">Step 1</div>
                <div className="text-xs truncate">Basic Details</div>
              </div>
            </button>

            {/* Step 2 Pill */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                currentStep === 2
                  ? "bg-primary/15 border-primary shadow-xs text-foreground font-bold ring-1 ring-primary/30"
                  : currentStep > 2
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground hover:bg-emerald-500/15"
                    : "bg-background/50 border-border/60 text-muted-foreground hover:bg-muted/60"
              }`}
            >
              <div
                className={`size-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                  currentStep === 2
                    ? "bg-primary text-primary-foreground"
                    : currentStep > 2
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > 2 ? <Check className="size-3.5 stroke-[3]" /> : "2"}
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="text-[11px] uppercase tracking-wider font-semibold opacity-75">Step 2</div>
                <div className="text-xs truncate">Select Questions</div>
              </div>
            </button>

            {/* Step 3 Pill */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1() && validateStep2()) setCurrentStep(3);
              }}
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                currentStep === 3
                  ? "bg-primary/15 border-primary shadow-xs text-foreground font-bold ring-1 ring-primary/30"
                  : "bg-background/50 border-border/60 text-muted-foreground hover:bg-muted/60"
              }`}
            >
              <div
                className={`size-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                  currentStep === 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="text-[11px] uppercase tracking-wider font-semibold opacity-75">Step 3</div>
                <div className="text-xs truncate">Review &amp; Publish</div>
              </div>
            </button>
          </div>
        </div>

        {/* Wizard Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs flex flex-col justify-between">
          {/* ================= STEP 1: BASIC DETAILS ================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-200">
              <div className="border-b border-border/50 pb-2.5">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileCode className="size-4 text-primary" />
                  <span>Step 1: Basic Details</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Specify challenge title, duration, passing score, and candidate instructions.
                </p>
              </div>

              {/* Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="assessment-title" className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>Challenge Title *</span>
                  </label>
                  <Input
                    id="assessment-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Go & SQL Challenge"
                    required
                    className="text-xs sm:text-sm bg-background/80 border-border/80 focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="assessment-company" className="font-semibold text-foreground flex items-center gap-1.5">
                    <span>Hiring Company / Organization *</span>
                  </label>
                  <Input
                    id="assessment-company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. TechCorp Labs / Algorithmix"
                    required
                    className="text-xs sm:text-sm bg-background/80 border-border/80 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Duration and Passing Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    <span>Duration (Minutes) *</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={15}
                      max={300}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      required
                      placeholder="75"
                      className="w-28 text-xs sm:text-sm font-mono"
                    />
                    <div className="flex flex-wrap gap-1">
                      {[45, 60, 75, 90, 120].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDurationMinutes(mins)}
                          className={`px-2 py-1 rounded-md border text-[11px] font-mono transition-colors cursor-pointer ${
                            durationMinutes === mins
                              ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                              : "bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    <Award className="size-3.5 text-emerald-500" />
                    <span>Passing Marks *</span>
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={200}
                    value={passMarks}
                    onChange={(e) => setPassMarks(Number(e.target.value))}
                    required
                    placeholder="60"
                    className="text-xs sm:text-sm font-mono font-bold text-emerald-500 bg-background/80"
                  />
                </div>
              </div>

              {/* Description / Candidate Guidelines */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>Description & Candidate Guidelines *</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Candidate guidelines: All coding problems must be completed within the allotted time. Solutions are evaluated against automated test cases and runtime constraints."
                  rows={3}
                  className="text-xs sm:text-sm bg-background/80 resize-none min-h-[72px]"
                />
              </div>

              {/* Evaluated Skills */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-1.5">
                  <Code2 className="size-3.5 text-primary" />
                  <span>Skills / Target Tech Stack (comma-separated)</span>
                </label>
                <Input
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="e.g. Go, SQL, Docker, PostgreSQL, Concurrency"
                  className="text-xs sm:text-sm bg-background/80"
                />
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {skillsText
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded px-2 py-0.5"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: CODING QUESTIONS ================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-200">
              <div className="border-b border-border/50 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Layers className="size-4 text-primary" />
                    <span>Assign Coding Questions to Challenge</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select problems from the question bank or author a new test case.
                  </p>
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
                    <span>{isInlineAddingQ ? "Close Editor" : "+ New Question"}</span>
                  </Button>

                  <Badge
                    variant="outline"
                    className="text-xs font-mono font-semibold px-2.5 py-1 bg-background/80 border-primary/30 text-primary shadow-2xs"
                  >
                    {selectedQuestionIds.length} Selected ({totalCalculatedMarks} pts)
                  </Badge>
                </div>
              </div>

              {/* Inline Question Authoring Form */}
              {isInlineAddingQ && (
                <div className="p-4 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-background to-card shadow-lg space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-primary" />
                      <span>Author Custom Coding Problem</span>
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Database integration ready
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
                      placeholder="Short description of the algorithm and expected constraints..."
                      value={inlineQDesc}
                      onChange={(e) => setInlineQDesc(e.target.value)}
                      className="text-xs h-8 bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground font-mono">Test Case Input</label>
                      <Input
                        value={inlineQInput}
                        onChange={(e) => setInlineQInput(e.target.value)}
                        placeholder="e.g. [2,7,11,15], 9"
                        className="text-xs font-mono h-8 bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground font-mono">Expected Output</label>
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
                      <span>Save &amp; Attach Problem</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Questions Grid with rich hover and selection states */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {availableQuestions.map((q) => {
                  const isSelected = selectedQuestionIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleQuestion(q.id)}
                      className={`group relative p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary/30 hover:bg-primary/15"
                          : "bg-card/70 border-border/80 hover:border-primary/50 hover:bg-card hover:shadow-md hover:scale-[1.01]"
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
                        {q.description && (
                          <p className="text-[11px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                            {q.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              q.difficulty === "HARD"
                                ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                                : q.difficulty === "MEDIUM"
                                  ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                                  : "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] text-foreground font-mono font-bold bg-muted px-1.5 py-0.5 rounded">
                            {q.marks} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 3: SETTINGS & PUBLISH ================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-200">
              <div className="border-b border-border/50 pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="size-4 text-emerald-500" />
                  <span>Evaluation Benchmarks &amp; Final Review</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure scoring thresholds, publishing availability, and inspect the challenge card.
                </p>
              </div>

              {/* Pass Marks, Total Marks, Difficulty, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/80 bg-background/60 space-y-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Award className="size-3.5 text-primary" />
                    <span>Scoring Criteria</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Pass Marks *</label>
                      <Input
                        type="number"
                        min={0}
                        max={totalCalculatedMarks || 200}
                        value={passMarks}
                        onChange={(e) => setPassMarks(Number(e.target.value))}
                        required
                        className="text-xs sm:text-sm font-mono font-bold text-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Total Marks</label>
                      <Input
                        type="number"
                        readOnly
                        value={totalCalculatedMarks > 0 ? totalCalculatedMarks : totalMarks}
                        className="text-xs sm:text-sm font-mono font-bold bg-muted/60 text-primary cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Candidates scoring {passMarks}+ will receive an automatic verified pass certificate.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-background/60 space-y-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Shield className="size-3.5 text-primary" />
                    <span>Publishing &amp; Difficulty</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                      >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground">Overall Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full h-8 px-2 rounded-md border border-border bg-background text-xs text-foreground focus:ring-1 focus:ring-primary"
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                    <Sparkles className="size-3 text-amber-500" />
                    <span>Auto-graded by container test runner</span>
                  </div>
                </div>
              </div>

              {/* 🎯 Real-Time Challenge Card Preview */}
              <div className="p-4 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-background space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="size-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
                      Candidate Live Preview Card
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono font-bold text-primary">
                    {difficulty}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {title || "Untitled Assessment Challenge"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Organized by <strong className="text-foreground">{company || "Tech Organization"}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                      <Clock className="size-3 text-primary" /> {durationMinutes} Mins
                    </span>
                    <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                      <Award className="size-3 text-emerald-500" /> {passMarks}/{totalCalculatedMarks} pts
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  <span>Linked Questions: <strong className="text-foreground">{selectedQuestionIds.length} problems</strong></span>
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Ready for Candidate Attempt
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-5 mt-4 border-t border-border/80">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={isSubmitting}
                className="gap-1.5 text-xs font-medium cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </Button>
            )}

            <div className="flex items-center gap-2">
              {currentStep < 3 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="gap-1.5 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>
                    {currentStep === 1 ? "Next: Configure Questions →" : "Next: Review & Publish →"}
                  </span>
                  <ArrowRight className="size-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="gap-2 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer px-4"
                >
                  <Rocket className="size-3.5" />
                  <span>
                    {isSubmitting
                      ? "Publishing Challenge..."
                      : assessment
                        ? "Save & Update Challenge"
                        : "Publish Challenge & Sync"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
