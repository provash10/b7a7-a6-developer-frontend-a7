"use client";

import { Code2, Mail, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { QuestionCreateModal } from "@/components/modules/admin-manage";
import { BuyCreditsModal } from "@/components/modules/payment";
import { Button } from "@/components/ui/button";
import { EvaluationTasksTable } from "./evaluation-tasks-table";
import { initialEvaluationTasks } from "./mock-data";
import { RecruiterQuickStats } from "./recruiter-quick-stats";
import { SendInvitationModal } from "./send-invitation-modal";
import type { EvaluationTask } from "./types";

export function RecruiterEvaluationsView() {
  const [tasks, setTasks] = useState<EvaluationTask[]>(initialEvaluationTasks);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("devassess_candidate_submissions");
      if (stored) {
        const live: EvaluationTask[] = JSON.parse(stored);
        if (live.length > 0) {
          setTasks([...live, ...initialEvaluationTasks]);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleInvitationSent = (newTask: EvaluationTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTasksChange = (newTasks: EvaluationTask[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem("devassess_candidate_submissions", JSON.stringify(newTasks));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("devassess_submission_update"));
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* bKash credit recharge banner */}
      <div className="relative overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-500/15 via-pink-500/10 to-pink-500/5 hover:from-pink-500/20 hover:via-pink-500/15 hover:to-pink-500/10 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 p-5 sm:p-6 group/banner">
        {/* ambient background glows */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-pink-500/20 blur-3xl transition-opacity group-hover/banner:opacity-100 opacity-60" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 size-40 rounded-full bg-rose-500/15 blur-3xl transition-opacity group-hover/banner:opacity-100 opacity-60" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex size-12 sm:size-13 shrink-0 items-center justify-center rounded-2xl bg-pink-500/20 border border-pink-500/30 text-pink-600 dark:text-pink-400 shadow-sm transition-transform duration-300 group-hover/banner:scale-105">
              <Zap className="size-6 text-pink-600 dark:text-pink-400 fill-pink-500/30" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-bold text-base sm:text-lg text-foreground tracking-tight">
                  Recruiter Assessment Credits
                </span>
                <span className="rounded-full bg-pink-500/15 border border-pink-500/30 px-2.5 py-0.5 text-xs font-bold text-pink-600 dark:text-pink-400 shadow-2xs">
                  bKash Tokenized
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Available balance:{" "}
                <span className="font-extrabold text-foreground font-mono">
                  180 Credits
                </span>{" "}
                <span className="text-xs text-muted-foreground/90">(৳5.00 / Credit)</span>. Top up anytime with instant activation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsQuestionModalOpen(true)}
              className="gap-2 h-10 px-4 border-primary/40 text-primary hover:bg-primary/10 font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-xs"
            >
              <Code2 className="size-4 shrink-0" />
              <span>Add Question</span>
            </Button>

            <Button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="gap-2 h-10 px-4.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all duration-200 cursor-pointer"
            >
              <Mail className="size-4 shrink-0" />
              <span>Invite Candidate</span>
            </Button>

            <Button
              type="button"
              onClick={() => setIsBuyModalOpen(true)}
              className="group/btn gap-2 h-10 px-4.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:scale-125 group-hover/btn:rotate-12" />
              <span>Buy Credits</span>
            </Button>
          </div>
        </div>
      </div>

      {/* quick metrics overview */}
      <RecruiterQuickStats tasks={tasks} />

      {/* evaluations task queue table */}
      <EvaluationTasksTable
        tasks={tasks}
        onTasksChange={handleTasksChange}
        onOpenInvite={() => setIsInviteModalOpen(true)}
      />

      {/* buy credits modal */}
      <BuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

      {/* send assessment invitation modal */}
      <SendInvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvitationSent={handleInvitationSent}
      />

      {/* question create modal */}
      <QuestionCreateModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
      />
    </div>
  );
}
