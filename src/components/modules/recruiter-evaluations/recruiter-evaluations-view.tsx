"use client";

import { Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { BuyCreditsModal } from "@/components/modules/payment";
import { Button } from "@/components/ui/button";
import { EvaluationTasksTable } from "./evaluation-tasks-table";
import { initialEvaluationTasks } from "./mock-data";
import { RecruiterQuickStats } from "./recruiter-quick-stats";
import type { EvaluationTask } from "./types";

export function RecruiterEvaluationsView() {
  const [tasks, setTasks] = useState<EvaluationTask[]>(initialEvaluationTasks);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* bKash credit recharge banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-transparent p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-pink-500/15 text-pink-600 dark:text-pink-400">
            <Zap className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">
                Recruiter Assessment Credits
              </span>
              <span className="rounded-full bg-pink-500/15 px-2 py-0.5 text-[10px] font-bold text-pink-600 dark:text-pink-400">
                bKash Tokenized
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Available balance: 180 Credits (৳5 / Credit). Top up anytime with instant activation.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsBuyModalOpen(true)}
          className="gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs shadow-xs"
        >
          <Sparkles className="size-3.5" />
          <span>Buy Assessment Credits</span>
        </Button>
      </div>

      {/* quick metrics overview */}
      <RecruiterQuickStats tasks={tasks} />

      {/* evaluations task queue table */}
      <EvaluationTasksTable tasks={tasks} onTasksChange={setTasks} />

      {/* buy credits modal */}
      <BuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  );
}
