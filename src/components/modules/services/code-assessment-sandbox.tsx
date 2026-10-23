"use client";

import {
  CheckCircle2,
  Clock,
  FileCode,
  Play,
  RotateCcw,
  Send,
  ShieldAlert,
  Terminal,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Problem {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  type: "CODING" | "MCQ";
  marks: number;
  timeLimit: string;
  description: string;
  starterCode: Record<string, string>;
  testCases: {
    input: string;
    expected: string;
    hidden?: boolean;
  }[];
}

const PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "1. Two Sum - Hash Map Lookup",
    difficulty: "EASY",
    type: "CODING",
    marks: 10,
    timeLimit: "1000 ms",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.",
    starterCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    lookup = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in lookup:
            return [lookup[complement], i]
        lookup[num] = i
    return []`,
    },
    testCases: [
      { input: "nums = [2, 7, 11, 15], target = 9", expected: "[0, 1]" },
      { input: "nums = [3, 2, 4], target = 6", expected: "[1, 2]" },
      { input: "nums = [3, 3], target = 6", expected: "[0, 1]", hidden: true },
    ],
  },
  {
    id: "p2",
    title: "2. Validate Binary Search Tree",
    difficulty: "MEDIUM",
    type: "CODING",
    marks: 20,
    timeLimit: "1500 ms",
    description:
      "Given the root of a binary tree, determine if it is a valid binary search tree (BST). The left subtree of a node contains only nodes with keys strictly less than the node's key.",
    starterCode: {
      javascript: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
      typescript: `function isValidBST(root: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
      python: `def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')) -> bool:
    if not root:
        return True
    if root.val <= min_val or root.val >= max_val:
        return False
    return is_valid_bst(root.left, min_val, root.val) and is_valid_bst(root.right, root.val, max_val)`,
    },
    testCases: [
      { input: "root = [2, 1, 3]", expected: "true" },
      { input: "root = [5, 1, 4, null, null, 3, 6]", expected: "false" },
      { input: "root = [2, 2, 2]", expected: "false", hidden: true },
    ],
  },
];

export default function CodeAssessmentSandbox() {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [language, setLanguage] = useState<
    "javascript" | "typescript" | "python"
  >("typescript");
  const [activeTab, setActiveTab] = useState<
    "description" | "testcases" | "verdict"
  >("description");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [antiCheatFlags, setAntiCheatFlags] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [testResults, setTestResults] = useState<
    { index: number; passed: boolean; time: string; hidden: boolean }[] | null
  >(null);

  // console.log("code assessment sandbox loaded");
  const problem = PROBLEMS[selectedProblemIndex];
  const code = problem.starterCode[language];

  const handleRunCode = () => {
    // console.log("running code execution in sandbox");
    setIsRunning(true);
    setActiveTab("testcases");
    setTimeout(() => {
      const results = problem.testCases.map((tc, idx) => ({
        index: idx + 1,
        passed: true,
        time: `${Math.floor(Math.random() * 25) + 18}ms`,
        hidden: !!tc.hidden,
      }));
      setTestResults(results);
      setIsRunning(false);
    }, 700);
  };

  const handleSimulateTabSwitch = () => {
    // console.log("anti-cheat tab switch flag recorded");
    setAntiCheatFlags((prev) => prev + 1);
    setShowCheatWarning(true);
    setTimeout(() => {
      setShowCheatWarning(false);
    }, 4000);
  };

  const handleSubmit = () => {
    // console.log("submitting assessment solution");
    handleRunCode();
    setIsSubmitted(true);
    setActiveTab("verdict");
  };

  const handleReset = () => {
    // console.log("resetting sandbox test environment");
    setTestResults(null);
    setIsSubmitted(false);
    setAntiCheatFlags(0);
    setActiveTab("description");
  };

  return (
    <section
      id="interactive-demo"
      className="py-20 border-y border-border/60 bg-muted/20"
    >
      <div className="container mx-auto px-4">
        {/* header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-primary border-primary/30 bg-primary/5"
          >
            <Terminal className="size-3.5" />
            Live Candidate Simulator
          </Badge>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Interactive Code Assessment Sandbox
          </h2>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            Experience the real timed candidate test environment. Run test
            cases, test the anti-cheat telemetry flag detector, and inspect
            real-time grading.
          </p>
        </div>

        {/* anti-cheat alert banner */}
        {showCheatWarning && (
          <div className="mt-6 max-w-5xl mx-auto rounded-lg border border-amber-500/50 bg-amber-500/10 p-3.5 text-amber-600 dark:text-amber-400 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              <ShieldAlert className="size-5 shrink-0 text-amber-500" />
              <span>
                <strong>Anti-Cheat Telemetry:</strong> Window blur / tab switch
                detected. Logged to attempt telemetry (Flag #{antiCheatFlags}).
              </span>
            </div>
            <Badge variant="destructive" className="text-[10px]">
              Flagged
            </Badge>
          </div>
        )}

        {/* sandbox container */}
        <div className="mt-8 max-w-5xl mx-auto rounded-xl border border-border/80 bg-card shadow-xl overflow-hidden">
          {/* top bar / status header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-muted/40 px-4 py-3">
            {/* problem selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:inline">
                Problem:
              </span>
              <div className="flex gap-1.5">
                {PROBLEMS.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedProblemIndex(idx);
                      handleReset();
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedProblemIndex === idx
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "bg-background/80 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Problem {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* assessment state indicators */}
            <div className="flex items-center gap-2.5">
              {/* timer indicator */}
              <div className="flex items-center gap-1.5 rounded-md border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-mono text-foreground">
                <Clock className="size-3.5 text-primary animate-pulse" />
                <span>44:12 remaining</span>
              </div>

              {/* anti-cheat badge */}
              <div
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium border ${
                  antiCheatFlags > 0
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                    : "border-border/80 bg-background/80 text-muted-foreground"
                }`}
              >
                <ShieldAlert className="size-3.5" />
                <span>
                  Anti-Cheat Flags: <strong>{antiCheatFlags}</strong>
                </span>
              </div>

              {/* status pill */}
              <Badge
                variant={isSubmitted ? "success" : "secondary"}
                className="text-[11px]"
              >
                {isSubmitted ? "SUBMITTED" : "IN_PROGRESS"}
              </Badge>
            </div>
          </div>

          {/* main grid: left spec/details, right code sandbox */}
          <div className="grid lg:grid-cols-12 min-h-[460px]">
            {/* left panel: problem details & tabs (5 cols) */}
            <div className="lg:col-span-5 border-r border-border/80 flex flex-col bg-background/50">
              {/* tab selector */}
              <div className="flex border-b border-border/80 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`flex-1 py-2.5 font-medium border-b-2 transition-colors ${
                    activeTab === "description"
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("testcases")}
                  className={`flex-1 py-2.5 font-medium border-b-2 transition-colors ${
                    activeTab === "testcases"
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Test Cases {testResults ? `(${testResults.length})` : ""}
                </button>
                {isSubmitted && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("verdict")}
                    className={`flex-1 py-2.5 font-medium border-b-2 transition-colors ${
                      activeTab === "verdict"
                        ? "border-emerald-500 text-emerald-500 bg-emerald-500/5"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Final Verdict
                  </button>
                )}
              </div>

              {/* tab content */}
              <div className="p-4 flex-1 overflow-y-auto text-xs space-y-4">
                {activeTab === "description" && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">
                        {problem.title}
                      </h4>
                      <Badge
                        variant={
                          problem.difficulty === "EASY" ? "success" : "amber"
                        }
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>
                        Marks:{" "}
                        <strong className="text-foreground">
                          {problem.marks} pts
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Time Limit:{" "}
                        <strong className="text-foreground">
                          {problem.timeLimit}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Type:{" "}
                        <strong className="text-foreground">
                          {problem.type}
                        </strong>
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="font-semibold text-foreground">
                        Sample Test Cases:
                      </div>
                      {problem.testCases.map((tc, idx) => (
                        <div
                          key={`sample-${idx + 1}`}
                          className="rounded-md border border-border/60 bg-muted/40 p-2.5 space-y-1 font-mono text-[11px]"
                        >
                          <div className="text-muted-foreground">
                            Input:{" "}
                            <span className="text-foreground">{tc.input}</span>
                          </div>
                          <div className="text-muted-foreground">
                            Expected:{" "}
                            <span className="text-emerald-500 font-semibold">
                              {tc.expected}
                            </span>
                            {tc.hidden && (
                              <span className="ml-2 text-amber-500 text-[10px]">
                                (Hidden Test)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "testcases" && (
                  <div className="space-y-3">
                    <div className="font-semibold text-foreground">
                      Automated Test Execution:
                    </div>
                    {!testResults ? (
                      <div className="py-8 text-center text-muted-foreground">
                        <Terminal className="size-8 mx-auto mb-2 opacity-40" />
                        <p>No tests run yet.</p>
                        <p className="text-[11px]">
                          Click &quot;Run Code&quot; below to execute against
                          the sandbox.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {testResults.map((res) => (
                          <div
                            key={res.index}
                            className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {res.passed ? (
                                <CheckCircle2 className="size-4 text-emerald-500" />
                              ) : (
                                <XCircle className="size-4 text-rose-500" />
                              )}
                              <span className="font-medium text-foreground">
                                Test Case #{res.index}{" "}
                                {res.hidden ? "(Hidden)" : "(Public)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-muted-foreground text-[11px]">
                                {res.time}
                              </span>
                              <Badge variant="success" className="text-[10px]">
                                PASSED
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "verdict" && (
                  <div className="space-y-4 py-2">
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                      <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2" />
                      <div className="text-base font-bold text-foreground">
                        Verdict: ACCEPTED
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        All {problem.testCases.length} test cases passed
                        successfully.
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Marks Earned:
                        </span>
                        <strong className="text-emerald-500">
                          {problem.marks} / {problem.marks} pts
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Pass Status:
                        </span>
                        <strong className="text-emerald-500">
                          PASSED (Above Pass Marks)
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Anti-Cheat Flags:
                        </span>
                        <strong
                          className={
                            antiCheatFlags > 0
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }
                        >
                          {antiCheatFlags} flags recorded
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Candidate Lifecycle:
                        </span>
                        <strong className="text-foreground">
                          COMPLETED & SUBMITTED
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* right panel: simulated code editor (7 cols) */}
            <div className="lg:col-span-7 flex flex-col bg-zinc-950 text-zinc-100 font-mono text-xs">
              {/* editor top bar */}
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 text-[11px]">
                <div className="flex items-center gap-2 text-zinc-400">
                  <FileCode className="size-3.5 text-blue-400" />
                  <span>
                    solution.
                    {language === "python"
                      ? "py"
                      : language === "typescript"
                        ? "ts"
                        : "js"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    aria-label="Select Programming Language"
                    value={language}
                    onChange={(e) =>
                      setLanguage(
                        e.target.value as
                          | "javascript"
                          | "typescript"
                          | "python",
                      )
                    }
                    className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200 border border-zinc-700 outline-none focus:border-primary"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python 3</option>
                  </select>
                </div>
              </div>

              {/* code display simulation */}
              <div className="flex-1 p-4 overflow-x-auto leading-relaxed text-zinc-300 font-mono text-xs bg-zinc-950/90 selection:bg-primary/30">
                <pre>
                  <code>{code}</code>
                </pre>
              </div>

              {/* editor actions footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 bg-zinc-900 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleSimulateTabSwitch}
                    className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 text-[11px] gap-1.5"
                  >
                    <ShieldAlert className="size-3" />
                    Simulate Tab Switch
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleReset}
                    className="text-zinc-400 hover:text-zinc-200 text-[11px] gap-1"
                  >
                    <RotateCcw className="size-3" />
                    Reset
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="gap-1.5 text-xs bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  >
                    <Play className="size-3 text-emerald-400" />
                    {isRunning ? "Running Sandbox..." : "Run Tests"}
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isRunning}
                    className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Send className="size-3" />
                    Submit Assessment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
