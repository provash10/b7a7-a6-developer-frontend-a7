"use client";

import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileCode2,
  Mail,
  Send,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import type { EvaluationTask } from "./types";

interface SendInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationSent: (newTask: EvaluationTask) => void;
}

const AVAILABLE_CHALLENGES = [
  {
    id: "asst-01",
    title: "Full Stack Next.js & TypeScript Challenge",
    role: "Full Stack Software Engineer",
    language: "TypeScript",
    duration: "90 Mins",
    difficulty: "Intermediate",
  },
  {
    id: "asst-02",
    title: "Algorithmic Problem Solving & Data Structures",
    role: "Core Software Engineer (Algorithms)",
    language: "Python",
    duration: "120 Mins",
    difficulty: "Advanced",
  },
  {
    id: "asst-03",
    title: "React Component Architecture & Accessibility",
    role: "Senior Frontend Engineer",
    language: "TypeScript",
    duration: "60 Mins",
    difficulty: "Intermediate",
  },
  {
    id: "asst-04",
    title: "PostgreSQL Indexing & Optimization",
    role: "Database & Backend Engineer",
    language: "SQL / PostgreSQL",
    duration: "75 Mins",
    difficulty: "Intermediate",
  },
  {
    id: "asst-05",
    title: "Go Microservices & Docker Concurrency",
    role: "Distributed Systems Engineer",
    language: "Go",
    duration: "90 Mins",
    difficulty: "Advanced",
  },
];

export function SendInvitationModal({
  isOpen,
  onClose,
  onInvitationSent,
}: SendInvitationModalProps) {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [selectedChallengeId, setSelectedChallengeId] = useState(
    AVAILABLE_CHALLENGES[0].id,
  );
  const [expiryDays, setExpiryDays] = useState("3");
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedToken, setDispatchedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedChallenge =
    AVAILABLE_CHALLENGES.find((c) => c.id === selectedChallengeId) ||
    AVAILABLE_CHALLENGES[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateName.trim() || !candidateEmail.trim()) {
      toast.add({
        title: "Required Fields Missing",
        description: "Please enter candidate's full name and email address.",
        type: "error",
      });
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail)) {
      toast.add({
        title: "Invalid Email Address",
        description: "Please provide a valid recipient email address.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate cryptographic invite token generation & email dispatch
    setTimeout(() => {
      const generatedToken = `inv_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      setDispatchedToken(generatedToken);

      // Create a pending evaluation queue entry for this candidate
      const newTask: EvaluationTask = {
        id: `eval_${Date.now().toString().slice(-4)}`,
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim().toLowerCase(),
        roleApplied: selectedChallenge.role,
        challengeTitle: selectedChallenge.title,
        challengeLanguage: selectedChallenge.language,
        submittedAt: "Invitation Pending",
        score: 0,
        testCasesPassed: 0,
        totalTestCases: 10,
        executionTimeMs: 0,
        antiCheatStatus: "CLEAN",
        antiCheatSignals: ["invitation dispatched", "awaiting attempt start"],
        status: "PENDING_REVIEW",
        codeSnippet: `// Candidate invitation dispatched\n// Status: Awaiting candidate attempt start via tokenized link\n// Candidate: ${candidateName.trim()} (${candidateEmail.trim()})\n// Challenge: ${selectedChallenge.title}`,
        recruiterNotes: customNote.trim() || "Initial candidate invitation.",
      };

      onInvitationSent(newTask);
      setIsSubmitting(false);

      toast.add({
        title: "Invitation Dispatched Successfully",
        description: `Assessment link sent to ${candidateEmail.trim()}. 1 credit deducted.`,
        type: "success",
      });
    }, 700);
  };

  const handleCopyLink = () => {
    if (!dispatchedToken) return;
    const link = `${window.location.origin}/assessment/attempt?token=${dispatchedToken}`;
    navigator.clipboard.writeText(link);
    toast.add({
      title: "Copied to Clipboard",
      description: "Direct invitation link copied.",
      type: "info",
    });
  };

  const handleResetAndClose = () => {
    setCandidateName("");
    setCandidateEmail("");
    setCustomNote("");
    setDispatchedToken(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* close button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>

        {/* modal title header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Mail className="size-3.5" />
            <span>Candidate Assessment Dispatcher</span>
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Send Assessment Invitation
          </h2>
          <p className="text-xs text-muted-foreground">
            Dispatch a secure single-use tokenized test link via automated email to your candidate.
          </p>
        </div>

        {/* confirmation success view if already dispatched */}
        {dispatchedToken ? (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-3">
              <div className="mx-auto size-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="size-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Invitation Sent to {candidateName}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  An email with instructions and magic link has been sent to{" "}
                  <strong className="text-foreground">{candidateEmail}</strong>.
                </p>
              </div>

              {/* copy link bar */}
              <div className="pt-2">
                <span className="block text-[11px] font-medium text-muted-foreground mb-1 text-left">
                  Direct Magic Link (Single-use token):
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/90 p-2 text-xs font-mono">
                  <span className="flex-1 truncate text-left text-muted-foreground">
                    {typeof window !== "undefined" ? window.location.origin : ""}/assessment/attempt?token={dispatchedToken}
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    onClick={handleCopyLink}
                    className="gap-1.5 font-sans h-7 px-2.5"
                  >
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDispatchedToken(null);
                  setCandidateName("");
                  setCandidateEmail("");
                  setCustomNote("");
                }}
                className="text-xs h-9 px-4"
              >
                Send Another Invitation
              </Button>
              <Button
                type="button"
                onClick={handleResetAndClose}
                className="text-xs h-9 px-5 font-semibold"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* candidate name & email grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="size-3 text-primary" />
                  <span>Candidate Full Name</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Tariqul Islam"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="size-3 text-primary" />
                  <span>Candidate Email</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder="candidate@example.com"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* select assessment challenge */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="size-3 text-primary" />
                  <span>Select Assessment Challenge</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  {selectedChallenge.duration} • {selectedChallenge.difficulty}
                </span>
              </label>
              <select
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {AVAILABLE_CHALLENGES.map((challenge) => (
                  <option key={challenge.id} value={challenge.id}>
                    {challenge.title} ({challenge.language} • {challenge.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* expiry days */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="size-3 text-primary" />
                <span>Link Expiration Window</span>
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="2">Expires in 48 Hours</option>
                <option value="3">Expires in 72 Hours (Recommended)</option>
                <option value="7">Expires in 7 Days</option>
                <option value="14">Expires in 14 Days</option>
              </select>
            </div>

            {/* optional note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Custom Message / Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please complete this technical screening before your interview on Thursday."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* credit cost notice */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                <span className="text-muted-foreground">
                  Cost per candidate invite:
                </span>
                <span className="font-bold text-foreground font-mono">
                  1 Credit (৳5.00)
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-background">
                Balance: 180 Credits
              </Badge>
            </div>

            {/* modal actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetAndClose}
                disabled={isSubmitting}
                className="h-9 px-4 text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="gap-2 h-9 px-5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>
                  {isSubmitting ? "Dispatching..." : "Send Invitation"}
                </span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
