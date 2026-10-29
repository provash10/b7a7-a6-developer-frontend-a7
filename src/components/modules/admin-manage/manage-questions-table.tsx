"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileQuestion,
  HelpCircle,
  Plus,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTableUrlState } from "@/hooks";
import { getAllQuestions } from "@/api/assessment.api";
import apiClient from "@/lib/apiClient";
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
import type { Question } from "@/types";
import { QuestionCreateModal } from "./question-create-modal";

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "p1",
    title: "Two Sum Problem",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    type: "CODING",
    difficulty: "EASY",
    marks: 20,
    testCases: [
      { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]", isHidden: false },
      { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]", isHidden: true },
    ],
  },
  {
    id: "p2",
    title: "Valid Palindrome String",
    description:
      "Verify if a string reads the same forward and backward after removing all non-alphanumeric characters.",
    type: "CODING",
    difficulty: "EASY",
    marks: 20,
    testCases: [
      { input: '"racecar"', expectedOutput: "true", isHidden: false },
      { input: '"race a car"', expectedOutput: "false", isHidden: false },
    ],
  },
  {
    id: "p3",
    title: "Reverse a String",
    description:
      "Write a function that reverses an input string with exact casing and punctuation preserved.",
    type: "CODING",
    difficulty: "EASY",
    marks: 15,
    testCases: [
      { input: '"hello"', expectedOutput: '"olleh"', isHidden: false },
    ],
  },
  {
    id: "p4",
    title: "FizzBuzz Number Evaluator",
    description:
      "Return Fizz for multiples of 3, Buzz for 5, and FizzBuzz for multiples of both 3 and 5.",
    type: "CODING",
    difficulty: "EASY",
    marks: 20,
    testCases: [
      { input: "15", expectedOutput: '"FizzBuzz"', isHidden: false },
    ],
  },
  {
    id: "p5",
    title: "Maximum Subarray Sum (Kadane's Algorithm)",
    description:
      "Find the contiguous subarray within a one-dimensional integer array which has the largest sum.",
    type: "CODING",
    difficulty: "MEDIUM",
    marks: 25,
    testCases: [
      { input: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]", expectedOutput: "6", isHidden: false },
    ],
  },
];

export function ManageQuestionsTable() {
  const { getParam, getNumberParam, updateUrl } = useTableUrlState();

  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => getParam("q_search", ""));
  const [difficultyFilter, setDifficultyFilter] = useState<string>(() =>
    getParam("q_diff", "ALL"),
  );
  const [typeFilter, setTypeFilter] = useState<string>(() =>
    getParam("q_type", "ALL"),
  );
  const [currentPage, setCurrentPage] = useState(() =>
    getNumberParam("q_page", 1),
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const pageSize = 10;

  // load live questions from database
  const loadQuestions = async () => {
    setLoading(true);
    let dbQuestions: Question[] = [];

    try {
      const res: any = await apiClient("/questions");
      const list = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(list) && list.length > 0) {
        dbQuestions = list;
      }
    } catch (e) {
      console.warn("Could not fetch questions from /questions:", e);
    }

    // merge with any custom local questions
    let customQuestions: Question[] = [];
    try {
      const stored = localStorage.getItem("devassess_custom_questions");
      if (stored) {
        customQuestions = JSON.parse(stored);
      }
    } catch {}

    const map = new Map<string, Question>();
    for (const q of dbQuestions) {
      if (q.title) map.set(q.title.toLowerCase().trim(), q);
    }
    for (const q of customQuestions) {
      if (q.title && !map.has(q.title.toLowerCase().trim())) {
        map.set(q.title.toLowerCase().trim(), q);
      }
    }
    for (const q of DEFAULT_QUESTIONS) {
      if (q.title && !map.has(q.title.toLowerCase().trim())) {
        map.set(q.title.toLowerCase().trim(), q);
      }
    }

    setQuestions(Array.from(map.values()));
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrl({ q_search: val.trim() ? val : null, q_page: null });
  };

  const handleDifficultyChange = (val: string) => {
    setDifficultyFilter(val);
    setCurrentPage(1);
    updateUrl({ q_diff: val === "ALL" ? null : val, q_page: null });
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setCurrentPage(1);
    updateUrl({ q_type: val === "ALL" ? null : val, q_page: null });
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.description &&
          q.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDiff =
        difficultyFilter === "ALL" ||
        q.difficulty?.toUpperCase() === difficultyFilter.toUpperCase();

      const matchesType =
        typeFilter === "ALL" ||
        q.type?.toUpperCase() === typeFilter.toUpperCase();

      return matchesSearch && matchesDiff && matchesType;
    });
  }, [questions, searchQuery, difficultyFilter, typeFilter]);

  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  return (
    <>
      <Card className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-6 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400">
                  <Terminal className="size-4 shrink-0" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">
                  Problem & Question Catalog
                </CardTitle>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/5 uppercase"
                >
                  {filteredQuestions.length} Questions
                </Badge>
              </div>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Author, inspect test cases, review benchmarking parameters, and manage questions in the database.
              </CardDescription>
            </div>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2 rounded-xl font-semibold text-xs sm:text-sm shadow-sm bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Create Question</span>
            </Button>
          </div>

          {/* filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search problem title or description..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8 text-xs h-9 rounded-xl"
              />
            </div>

            <select
              value={difficultyFilter}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="ALL">All Difficulties (Easy, Medium, Hard)</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="h-9 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="ALL">All Problem Types</option>
              <option value="CODING">Coding Challenge</option>
              <option value="MCQ">Multiple Choice (MCQ)</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Problem Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Marks</th>
                  <th className="py-3 px-4">Test Cases</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedQuestions.map((q) => {
                  const tcCount = Array.isArray(q.testCases)
                    ? q.testCases.length
                    : 0;
                  const isEasy = q.difficulty?.toUpperCase() === "EASY";
                  const isHard = q.difficulty?.toUpperCase() === "HARD";

                  return (
                    <tr
                      key={q.id || q.title}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedQuestion(q)}
                    >
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Code2 className="size-4 text-purple-500 shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {q.title}
                            </span>
                            {q.description && (
                              <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-md mt-0.5">
                                {q.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase font-mono border-border"
                        >
                          {q.type || "CODING"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-mono font-bold ${
                            isEasy
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : isHard
                                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {q.difficulty || "MEDIUM"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">
                        {q.marks || 20} pts
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {tcCount > 0 ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="size-3" />
                            {tcCount} cases
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQuestion(q);
                          }}
                          className="h-7 px-2 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border/60 text-xs text-muted-foreground">
            <span>
              Showing {filteredQuestions.length === 0 ? 0 : 1} to{" "}
              {Math.min(pageSize, filteredQuestions.length)} of{" "}
              {filteredQuestions.length} questions
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2 rounded-lg"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <span className="font-mono font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2 rounded-lg"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* question details modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-lg w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono uppercase">
                    {selectedQuestion.type || "CODING"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono uppercase font-bold text-emerald-500 border-emerald-500/30"
                  >
                    {selectedQuestion.difficulty || "EASY"}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    {selectedQuestion.marks || 20} Marks
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-2">
                  {selectedQuestion.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedQuestion(null)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </span>
              <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                {selectedQuestion.description || "No description provided."}
              </p>
            </div>

            {Array.isArray(selectedQuestion.testCases) &&
              selectedQuestion.testCases.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Test Cases ({selectedQuestion.testCases.length})
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedQuestion.testCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs font-mono space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground">
                            Case #{idx + 1}
                          </span>
                          {tc.isHidden && (
                            <Badge
                              variant="outline"
                              className="text-[9px] uppercase border-amber-500/40 text-amber-500"
                            >
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <div>
                          <span className="text-muted-foreground text-[11px]">
                            Input:{" "}
                          </span>
                          <span className="text-foreground">{tc.input}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-[11px]">
                            Expected:{" "}
                          </span>
                          <span className="text-emerald-500 font-bold">
                            {tc.expectedOutput}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                onClick={() => setSelectedQuestion(null)}
                className="rounded-xl px-4 text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* create question modal */}
      <QuestionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onQuestionCreated={() => {
          loadQuestions();
        }}
      />
    </>
  );
}
