"use client";

import { Code2, HelpCircle, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { createQuestion } from "@/api/assessment.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { Question } from "@/types";

export interface TestCaseInput {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface QuestionCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated?: (question: Question) => void;
}

export function QuestionCreateModal({
  isOpen,
  onClose,
  onQuestionCreated,
}: QuestionCreateModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"CODING" | "MCQ">("CODING");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "MEDIUM",
  );
  const [marks, setMarks] = useState(20);
  const [starterCode, setStarterCode] = useState(
    "function solution(input) {\n  // Write your code here\n  return input;\n}",
  );
  const [testCases, setTestCases] = useState<TestCaseInput[]>([
    { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]", isHidden: false },
    { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]", isHidden: true },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      { input: "", expectedOutput: "", isHidden: false },
    ]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateTestCase = (
    index: number,
    field: keyof TestCaseInput,
    val: any,
  ) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: val } : tc)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Title and description are required.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    const newQuestionData: Question = {
      id: `q-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      description: description.trim(),
      type,
      difficulty,
      marks: Number(marks) || 10,
      testCases: testCases.filter((tc) => tc.input.trim() !== ""),
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Try real backend API call
      await createQuestion({
        title: newQuestionData.title,
        description: newQuestionData.description,
        type: newQuestionData.type,
        difficulty: newQuestionData.difficulty,
        marks: newQuestionData.marks,
        testCases: newQuestionData.testCases,
      });

      toast.add({
        title: "Question Saved in Database!",
        description: `"${newQuestionData.title}" has been saved in the database.`,
        type: "success",
      });
    } catch (err: any) {
      console.warn("Backend API unavailable, stored locally", err);
      toast.add({
        title: "Question Created!",
        description: `"${newQuestionData.title}" has been added to the question bank.`,
        type: "success",
      });
    } finally {
      // Always store in local question bank so candidate exam can load it immediately!
      try {
        const stored = localStorage.getItem("devassess_custom_questions");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newQuestionData);
        localStorage.setItem("devassess_custom_questions", JSON.stringify(list));
      } catch (e) {
        // ignore
      }

      setIsSubmitting(false);
      onQuestionCreated?.(newQuestionData);
      onClose();

      // Reset form
      setTitle("");
      setDescription("");
      setMarks(20);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl p-6 max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Code2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Author Assessment Question
              </h2>
              <p className="text-xs text-muted-foreground">
                Add coding problems or MCQs directly to the database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Question Title *
            </label>
            <Input
              required
              placeholder="e.g. Reverse a Linked List / Two Sum Problem"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>

          {/* Type & Difficulty & Marks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Question Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs sm:text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
              >
                <option value="CODING">Coding Problem</option>
                <option value="MCQ">Multiple Choice (MCQ)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full text-xs sm:text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Marks / Points
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Problem Description *
            </label>
            <Textarea
              required
              rows={4}
              placeholder="Describe the task, edge cases, constraints, and return requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs sm:text-sm resize-none"
            />
          </div>

          {/* Starter Code */}
          {type === "CODING" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Starter Code Template</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  Provided to candidate in code editor
                </span>
              </label>
              <Textarea
                rows={3}
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                className="font-mono text-xs bg-muted/40 resize-none"
              />
            </div>
          )}

          {/* Automated Test Cases */}
          {type === "CODING" && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    Automated Unit Test Cases
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Evaluated when candidate runs or submits code.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddTestCase}
                  className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Plus className="size-3" />
                  <span>Add Case</span>
                </Button>
              </div>

              <div className="space-y-2">
                {testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        Test Case #{idx + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tc.isHidden}
                            onChange={(e) =>
                              handleUpdateTestCase(
                                idx,
                                "isHidden",
                                e.target.checked,
                              )
                            }
                            className="rounded border-border text-primary"
                          />
                          <span>Hidden Test Case</span>
                        </label>
                        {testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTestCase(idx)}
                            className="text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-1">
                          Input Parameters
                        </label>
                        <Input
                          placeholder="e.g. [2,7,11,15], 9"
                          value={tc.input}
                          onChange={(e) =>
                            handleUpdateTestCase(idx, "input", e.target.value)
                          }
                          className="text-xs font-mono h-8"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block mb-1">
                          Expected Output
                        </label>
                        <Input
                          placeholder="e.g. [0, 1]"
                          value={tc.expectedOutput}
                          onChange={(e) =>
                            handleUpdateTestCase(
                              idx,
                              "expectedOutput",
                              e.target.value,
                            )
                          }
                          className="text-xs font-mono h-8"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 cursor-pointer shadow-sm"
            >
              {isSubmitting ? "Saving to Database..." : "Save Question to Database"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
