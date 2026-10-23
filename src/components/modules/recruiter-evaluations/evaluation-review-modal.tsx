"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Code2,
  FileCode,
  ShieldAlert,
  Star,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { EvaluationStatus, EvaluationTask } from "./types";

interface EvaluationReviewModalProps {
  task: EvaluationTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: EvaluationTask) => void;
}

export function EvaluationReviewModal({
  task,
  isOpen,
  onClose,
  onSave,
}: EvaluationReviewModalProps) {
  // console.log("evaluation review modal component rendered");

  const [status, setStatus] = useState<EvaluationStatus>("PENDING_REVIEW");
  const [notes, setNotes] = useState("");
  const [codeQuality, setCodeQuality] = useState(4);
  const [architecture, setArchitecture] = useState(4);

  useEffect(() => {
    if (task) {
      setStatus(task.status);
      setNotes(task.recruiterNotes || "");
      setCodeQuality(task.codeQualityRating || 4);
      setArchitecture(task.architectureRating || 4);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleUpdate = (newStatus?: EvaluationStatus) => {
    const updatedStatus = newStatus || status;
    // console.log("saving candidate review update", task.id, updatedstatus);
    onSave({
      ...task,
      status: updatedStatus,
      recruiterNotes: notes,
      codeQualityRating: codeQuality,
      architectureRating: architecture,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-xl border border-border bg-card shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* modal header */}
        <div className="flex items-start justify-between border-b border-border/50 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                candidate code review & scoring
              </h2>
              <Badge variant="outline" className="text-[10px] font-mono">
                {task.id}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              evaluate candidate solution, inspect telemetry & anti-cheat
              heuristics, and update review verdict.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* candidate and challenge overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <User className="size-3.5 text-primary" />
              <span>candidate information</span>
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-foreground">
                {task.candidateName}
              </div>
              <div className="text-muted-foreground">{task.candidateEmail}</div>
              <div className="text-primary font-medium text-[11px] pt-1">
                role: {task.roleApplied}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <FileCode className="size-3.5 text-emerald-500" />
              <span>assessment metrics</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="font-bold text-foreground truncate">
                {task.challengeTitle}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                <span>
                  language:{" "}
                  <strong className="text-foreground">
                    {task.challengeLanguage}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  runtime:{" "}
                  <strong className="text-foreground">
                    {task.executionTimeMs}ms
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-emerald-500 font-bold font-mono">
                  {task.score}% score
                </span>
                <span className="text-muted-foreground text-[11px]">
                  ({task.testCasesPassed}/{task.totalTestCases} test cases
                  passed)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* anti-cheat status banner */}
        <div
          className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
            task.antiCheatStatus === "FLAGGED"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
              : task.antiCheatStatus === "LOW_RISK"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
          }`}
        >
          <div className="flex items-center gap-2">
            {task.antiCheatStatus === "FLAGGED" ? (
              <ShieldAlert className="size-4 shrink-0" />
            ) : task.antiCheatStatus === "LOW_RISK" ? (
              <AlertTriangle className="size-4 shrink-0" />
            ) : (
              <CheckCircle2 className="size-4 shrink-0" />
            )}
            <div>
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                anti-cheat status: {task.antiCheatStatus}
              </span>
              <p className="text-[11px] opacity-90 mt-0.5">
                {task.antiCheatSignals.join(" • ")}
              </p>
            </div>
          </div>
          <Badge
            variant={
              task.antiCheatStatus === "FLAGGED" ? "destructive" : "outline"
            }
            className="text-[10px] py-0 px-1.5 uppercase font-mono"
          >
            {task.antiCheatStatus}
          </Badge>
        </div>

        {/* submitted code preview */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Code2 className="size-3.5 text-primary" />
              <span>submitted solution code ({task.challengeLanguage})</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              submitted at {task.submittedAt}
            </span>
          </div>
          <pre className="p-3.5 rounded-lg border border-border/80 bg-muted/60 text-foreground font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
            <code>{task.codeSnippet}</code>
          </pre>
        </div>

        {/* evaluation scoring & feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/50 pt-4">
          {/* code quality rating */}
          <div className="space-y-1.5">
            <label
              htmlFor="code-quality-rating"
              className="text-xs font-medium text-foreground block"
            >
              code quality & readability (1-5)
            </label>
            <div id="code-quality-rating" className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setCodeQuality(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`size-4 ${
                      star <= codeQuality
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono ml-2 text-foreground font-semibold">
                {codeQuality} / 5
              </span>
            </div>
          </div>

          {/* architecture & design */}
          <div className="space-y-1.5">
            <label
              htmlFor="architecture-rating"
              className="text-xs font-medium text-foreground block"
            >
              architecture & edge cases (1-5)
            </label>
            <div id="architecture-rating" className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setArchitecture(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`size-4 ${
                      star <= architecture
                        ? "text-primary fill-primary"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono ml-2 text-foreground font-semibold">
                {architecture} / 5
              </span>
            </div>
          </div>
        </div>

        {/* recruiter written notes */}
        <div className="space-y-1.5">
          <label
            htmlFor="recruiter-notes"
            className="text-xs font-medium text-foreground block"
          >
            recruiter evaluation remarks & hiring notes
          </label>
          <Textarea
            id="recruiter-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="add notes on code cleanliness, time complexity, and interview recommendation..."
            className="text-xs min-h-[70px] bg-background"
          />
        </div>

        {/* decision buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 pt-4">
          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="text-xs text-muted-foreground mr-1">
              decision:
            </span>
            <Button
              type="button"
              size="sm"
              variant={status === "ACCEPTED" ? "default" : "outline"}
              onClick={() => setStatus("ACCEPTED")}
              className={`h-8 text-xs gap-1 ${
                status === "ACCEPTED"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "text-emerald-500 hover:bg-emerald-500/10"
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              <span>accept</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={status === "REJECTED" ? "destructive" : "outline"}
              onClick={() => setStatus("REJECTED")}
              className="h-8 text-xs gap-1"
            >
              <XCircle className="size-3.5" />
              <span>reject</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant={status === "IN_REVIEW" ? "secondary" : "outline"}
              onClick={() => setStatus("IN_REVIEW")}
              className="h-8 text-xs gap-1"
            >
              <Clock className="size-3.5 text-blue-500" />
              <span>in review</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs"
            >
              cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleUpdate()}
              className="h-8 text-xs font-semibold"
            >
              save verdict
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
