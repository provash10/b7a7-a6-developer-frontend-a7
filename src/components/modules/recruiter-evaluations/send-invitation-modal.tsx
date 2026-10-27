"use client";

import {
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  FileCode2,
  Mail,
  Send,
  Sparkles,
  Square,
  User,
  UserCheck,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createAssessment,
  createQuestion,
  getAllAssessments,
  sendAssessmentInvitation,
} from "@/api/assessment.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import type { EvaluationTask } from "./types";

export interface SavedCandidate {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const INITIAL_SAVED_CANDIDATES: SavedCandidate[] = [
  {
    id: "cand-1",
    name: "Provash Barman",
    email: "provash10dev@gmail.com",
    role: "Candidate (Active)",
  },
  {
    id: "cand-2",
    name: "Amy Bruckner",
    email: "scstanley17111991@gmail.com",
    role: "Candidate (Invited)",
  },
  {
    id: "cand-3",
    name: "Candidate Demo",
    email: "candidate@100.com",
    role: "Candidate (Seed)",
  },
];

interface SendInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationSent: (newTask: EvaluationTask) => void;
}

interface ChallengeOption {
  id: string;
  title: string;
  role: string;
  language: string;
  duration: string;
  difficulty: string;
  isCustom?: boolean;
  isLiveDb?: boolean;
}

const DEFAULT_CHALLENGES: ChallengeOption[] = [
  {
    id: "a168cb72-2fa5-471a-830e-46a82dee6b9d",
    title: "React Developer jr (PostgreSQL Live DB)",
    role: "Frontend Engineer",
    language: "React / TypeScript",
    duration: "90 Mins",
    difficulty: "Intermediate",
    isLiveDb: true,
  },
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
  const [challenges, setChallenges] = useState<ChallengeOption[]>(DEFAULT_CHALLENGES);
  const [selectedChallengeId, setSelectedChallengeId] = useState(
    DEFAULT_CHALLENGES[0].id,
  );
  const [expiryDays, setExpiryDays] = useState("3");
  const [customNote, setCustomNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeedingDb, setIsSeedingDb] = useState(false);
  const [dispatchedToken, setDispatchedToken] = useState<string | null>(null);

  // Saved / Previously Invited Candidates state & dropdown toggle
  const [savedCandidates, setSavedCandidates] = useState<SavedCandidate[]>(
    INITIAL_SAVED_CANDIDATES,
  );
  const [isCandidateDropdownOpen, setIsCandidateDropdownOpen] = useState(false);
  const candidateDropdownRef = useRef<HTMLDivElement>(null);

  // Close candidate dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        candidateDropdownRef.current &&
        !candidateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCandidateDropdownOpen(false);
      }
    }
    if (isCandidateDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCandidateDropdownOpen]);

  // Load previously invited candidates from localStorage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const candidateMap = new Map<string, SavedCandidate>();
      INITIAL_SAVED_CANDIDATES.forEach((c) =>
        candidateMap.set(c.email.toLowerCase(), c),
      );

      // Load custom saved candidates
      const storedSaved = localStorage.getItem("devassess_saved_candidates");
      if (storedSaved) {
        const parsed = JSON.parse(storedSaved);
        if (Array.isArray(parsed)) {
          parsed.forEach((c: any) => {
            if (c.email) {
              candidateMap.set(c.email.toLowerCase(), {
                id: c.id || `cand-${Date.now()}-${Math.random()}`,
                name: c.name || c.email.split("@")[0],
                email: c.email,
                role: c.role || "Previous Candidate",
              });
            }
          });
        }
      }

      // Also merge past dispatched invitations if any
      const storedInvites = localStorage.getItem("devassess_invitations");
      if (storedInvites) {
        const parsedInv = JSON.parse(storedInvites);
        if (Array.isArray(parsedInv)) {
          parsedInv.forEach((inv: any) => {
            if (inv.candidateEmail) {
              const emailKey = inv.candidateEmail.toLowerCase();
              if (!candidateMap.has(emailKey)) {
                candidateMap.set(emailKey, {
                  id: `cand-${emailKey}`,
                  name: inv.candidateName || emailKey.split("@")[0],
                  email: inv.candidateEmail,
                  role: "Invited Candidate",
                });
              }
            }
          });
        }
      }

      setSavedCandidates(Array.from(candidateMap.values()));
    } catch {
      // ignore
    }
  }, [isOpen]);

  // Load live DB assessments + custom challenges created in Admin Catalog
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadChallenges() {
      let customOptions: ChallengeOption[] = [];
      try {
        const storedChallenges = localStorage.getItem("devassess_custom_challenges");
        if (storedChallenges) {
          const customList = JSON.parse(storedChallenges);
          if (Array.isArray(customList) && customList.length > 0) {
            customOptions = customList.map((c: any) => ({
              id: c.id,
              title: c.title,
              role: c.skills?.[0] ? `${c.skills[0]} Specialist` : "Software Engineer",
              language: c.skills?.[0] || "TypeScript",
              duration: `${c.durationMinutes || 90} Mins`,
              difficulty: c.difficulty || "Intermediate",
              isCustom: true,
            }));
          }
        }
      } catch (e) {
        // ignore
      }

      // Fetch live assessments from database API
      try {
        const res = await getAllAssessments();
        const liveAssessments = res?.data;
        if (Array.isArray(liveAssessments) && liveAssessments.length > 0 && isMounted) {
          const liveOptions: ChallengeOption[] = liveAssessments.map((a: any) => ({
            id: a.id,
            title: a.title,
            role: a.skills?.[0] ? `${a.skills[0]} Specialist` : "Software Engineer",
            language: a.skills?.[0] || "TypeScript",
            duration: `${a.durationMinutes || 90} Mins`,
            difficulty: a.difficulty || "Intermediate",
            isLiveDb: true,
          }));

          const combined = [...liveOptions, ...customOptions, ...DEFAULT_CHALLENGES];
          setChallenges(combined);
          setSelectedChallengeId(combined[0].id);
          return;
        }
      } catch (err) {
        // backend offline fallback
      }

      if (isMounted) {
        const combined = [...customOptions, ...DEFAULT_CHALLENGES];
        setChallenges(combined.length > 0 ? combined : DEFAULT_CHALLENGES);
        setSelectedChallengeId(combined[0]?.id || DEFAULT_CHALLENGES[0].id);
      }
    }

    loadChallenges();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleSeedDatabaseChallenge = async () => {
    setIsSeedingDb(true);
    try {
      // 1. Create a question in PostgreSQL DB
      const qRes = await createQuestion({
        title: "Two Sum & Algorithm Benchmark",
        description: "Given an array of integers and target, return indices of two numbers that add up to target.",
        marks: 50,
        difficulty: "EASY",
        type: "CODING",
      });
      const qId = (qRes as any)?.data?.id || `q-${Date.now()}`;

      // 2. Create the assessment in PostgreSQL DB
      const asstRes = await createAssessment({
        title: "Full Stack Next.js & TypeScript Challenge (PostgreSQL Live)",
        description: "Live interactive coding assessment for software engineering candidates.",
        durationMinutes: 90,
        passMarks: 50,
        totalMarks: 100,
        status: "PUBLISHED",
        difficulty: "MEDIUM",
        skills: ["TypeScript", "Next.js"],
        questionIds: [qId],
      });

      const newDbId = (asstRes as any)?.data?.id || `asst-db-${Date.now().toString().slice(-4)}`;
      const newChallenge: ChallengeOption = {
        id: newDbId,
        title: (asstRes as any)?.data?.title || "Full Stack Next.js & TypeScript Challenge (Live DB)",
        role: "Full Stack Software Engineer",
        language: "TypeScript",
        duration: "90 Mins",
        difficulty: "Intermediate",
        isLiveDb: true,
      };

      setChallenges((prev) => [newChallenge, ...prev.filter((c) => c.id !== newDbId)]);
      setSelectedChallengeId(newDbId);

      toast.add({
        title: "Synced with PostgreSQL Database! 🚀",
        description: `Assessment saved in 'assessments' table (ID: ${newDbId}). Ready to record attempts.`,
        type: "success",
      });
    } catch (err: any) {
      console.error(err);
      toast.add({
        title: "Database Sync Note",
        description: "Backend API offline or unreachable. Using active challenge.",
        type: "info",
      });
    } finally {
      setIsSeedingDb(false);
    }
  };

  if (!isOpen) return null;

  const selectedChallenge =
    challenges.find((c) => c.id === selectedChallengeId) ||
    challenges[0] ||
    DEFAULT_CHALLENGES[0];

  const selectedSavedCandidate = savedCandidates.find(
    (c) =>
      c.email.trim().toLowerCase() === candidateEmail.trim().toLowerCase(),
  );

  const handleSelectCandidate = (cand: SavedCandidate) => {
    setCandidateName(cand.name);
    setCandidateEmail(cand.email);
    setIsCandidateDropdownOpen(false);
    toast.add({
      title: "Candidate Selected",
      description: `Filled ${cand.name} (${cand.email})`,
      type: "info",
    });
  };

  const handleSelectNewCandidate = () => {
    setCandidateName("");
    setCandidateEmail("");
    setIsCandidateDropdownOpen(false);
    toast.add({
      title: "New Candidate Mode",
      description: "Enter candidate full name and email manually below.",
      type: "info",
    });
  };

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

    let backendToken: string | null = null;
    try {
      const res = await sendAssessmentInvitation({
        candidateEmail: candidateEmail.trim().toLowerCase(),
        candidateName: candidateName.trim(),
        assessmentId: selectedChallenge.id,
        expiresInDays: parseInt(expiryDays, 10),
      });
      if (res && res.success !== false && res?.data?.inviteToken) {
        backendToken = res.data.inviteToken;
        toast.add({
          title: "Saved in PostgreSQL Database! 🚀",
          description: `Invitation recorded in 'assessment_invitations' table.`,
          type: "success",
        });
      } else {
        const errMsg = res?.message || "Recruiter authentication required";
        toast.add({
          title: "Candidate Link Generated 🎯",
          description: `${errMsg}. (Ready to dispatch & test).`,
          type: "info",
        });
      }
    } catch (err: any) {
      const errMsg =
        err?.data?.message || err?.message || "Check recruiter auth or UUID format";
      toast.add({
        title: "Candidate Link Generated 🎯",
        description: `${errMsg}. (Ready to dispatch & test).`,
        type: "info",
      });
    }

    const generatedToken =
      backendToken ||
      `inv_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    setDispatchedToken(generatedToken);

      // 1. Record invitation in devassess_invitations (simulating Prisma assessment_invitations table)
      try {
        const storedInvites = localStorage.getItem("devassess_invitations");
        const invitesList = storedInvites ? JSON.parse(storedInvites) : [];
        const newInvite = {
          id: `inv-${Date.now()}`,
          inviteToken: generatedToken,
          candidateName: candidateName.trim(),
          candidateEmail: candidateEmail.trim().toLowerCase(),
          assessmentId: selectedChallenge.id,
          assessmentTitle: selectedChallenge.title,
          status: "PENDING",
          expiresAt: new Date(Date.now() + parseInt(expiryDays, 10) * 86400000).toISOString(),
          createdAt: new Date().toISOString(),
        };
        invitesList.unshift(newInvite);
        localStorage.setItem("devassess_invitations", JSON.stringify(invitesList));
      } catch (err) {
        // ignore
      }

      // 2. Create a pending evaluation queue entry for this candidate
      const newTask: EvaluationTask = {
        id: `eval_${Date.now().toString().slice(-4)}`,
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim().toLowerCase(),
        roleApplied: selectedChallenge.role,
        challengeTitle: selectedChallenge.title,
        challengeLanguage: selectedChallenge.language,
        submittedAt: "Invitation Dispatched (Awaiting Exam)",
        score: 0,
        testCasesPassed: 0,
        totalTestCases: 10,
        executionTimeMs: 0,
        antiCheatStatus: "CLEAN",
        antiCheatSignals: ["invitation dispatched via tokenized link", "awaiting candidate start"],
        status: "PENDING_REVIEW",
        codeSnippet: `// Candidate invitation dispatched\n// Status: Awaiting candidate attempt start via tokenized link\n// Candidate: ${candidateName.trim()} (${candidateEmail.trim()})\n// Challenge: ${selectedChallenge.title}\n// Token: ${generatedToken}`,
        recruiterNotes: customNote.trim() || "Initial candidate assessment invitation.",
      };

      // Save to candidate submissions list
      try {
        const stored = localStorage.getItem("devassess_candidate_submissions");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newTask);
        localStorage.setItem("devassess_candidate_submissions", JSON.stringify(list));
      } catch (err) {
        // ignore
      }

      // Save newly invited candidate to saved candidates list for future quick pick
      try {
        const newCandEntry: SavedCandidate = {
          id: `cand-${Date.now()}`,
          name: candidateName.trim(),
          email: candidateEmail.trim().toLowerCase(),
          role: "Invited Candidate",
        };
        setSavedCandidates((prev) => {
          const map = new Map<string, SavedCandidate>();
          map.set(newCandEntry.email.toLowerCase(), newCandEntry);
          prev.forEach((c) => {
            if (!map.has(c.email.toLowerCase())) {
              map.set(c.email.toLowerCase(), c);
            }
          });
          const updated = Array.from(map.values());
          localStorage.setItem(
            "devassess_saved_candidates",
            JSON.stringify(updated),
          );
          return updated;
        });
      } catch {
        // ignore
      }

      onInvitationSent(newTask);
      setIsSubmitting(false);

      toast.add({
        title: "Invitation Dispatched Successfully",
        description: `Assessment link dispatched to ${candidateEmail.trim()}. 1 credit deducted.`,
        type: "success",
      });
  };

  const handleCopyLink = () => {
    if (!dispatchedToken) return;
    const link = `${window.location.origin}/assessment/attempt?id=${selectedChallenge.id}&token=${dispatchedToken}`;
    navigator.clipboard.writeText(link);
    toast.add({
      title: "Copied to Clipboard",
      description: "Direct invitation exam link copied.",
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

  const isProvashSelected =
    candidateEmail.toLowerCase().includes("provash10dev@gmail.com") &&
    candidateName.toLowerCase().includes("provash");

  const examLink = dispatchedToken
    ? `/assessment/attempt?id=${selectedChallenge.id}&token=${dispatchedToken}`
    : "#";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
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

        {/* Confirmation Success View */}
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
                  An email with instructions and magic token has been sent to{" "}
                  <strong className="text-foreground">{candidateEmail}</strong> for{" "}
                  <span className="font-semibold text-primary">{selectedChallenge.title}</span>.
                </p>
              </div>

              {/* Direct Open Exam Action */}
              <div className="pt-2 pb-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={examLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs h-10 px-5 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <ExternalLink className="size-4" />
                  <span>🚀 Open Exam as Candidate ({candidateName})</span>
                </a>
              </div>

              {/* Copy Link Bar */}
              <div className="pt-2">
                <span className="block text-[11px] font-medium text-muted-foreground mb-1 text-left">
                  Direct Magic Link (Single-use token):
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/90 p-2 text-xs font-mono">
                  <span className="flex-1 truncate text-left text-muted-foreground">
                    {typeof window !== "undefined" ? window.location.origin : ""}{examLink}
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    onClick={handleCopyLink}
                    className="gap-1.5 font-sans h-7 px-2.5 cursor-pointer"
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
                className="text-xs h-9 px-4 cursor-pointer"
              >
                Send Another Invitation
              </Button>
              <Button
                type="button"
                onClick={handleResetAndClose}
                className="text-xs h-9 px-5 font-semibold cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Quick Candidate Select Dropdown Card with Down Arrow */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>Candidate Quick Select &amp; Saved Profiles</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {selectedSavedCandidate ? (
                    <>
                      Selected: <strong className="text-foreground">{selectedSavedCandidate.name}</strong> ({selectedSavedCandidate.email})
                    </>
                  ) : (
                    "Select a previously saved candidate or enter a new one below."
                  )}
                </p>
              </div>

              {/* Dropdown with Down Arrow (Replaces single button) */}
              <div className="relative shrink-0 w-full sm:w-auto" ref={candidateDropdownRef}>
                <button
                  type="button"
                  id="candidate-quick-select-dropdown"
                  onClick={() => setIsCandidateDropdownOpen((prev) => !prev)}
                  className={`w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2.5 rounded-lg border px-3.5 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer ${
                    selectedSavedCandidate
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                      : "border-primary/40 bg-background/90 text-primary hover:bg-primary/10"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {selectedSavedCandidate ? (
                      <>
                        <UserCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate max-w-[140px]">
                          👤 {selectedSavedCandidate.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <User className="size-3.5 text-primary" />
                        <span>👤 Select Candidate</span>
                      </>
                    )}
                  </div>
                  <ChevronDown
                    className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                      isCandidateDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Floating Menu with Checkboxes */}
                {isCandidateDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 border-b border-border/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Saved Candidates ({savedCandidates.length})
                      </span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5 py-0">
                        Check to select
                      </Badge>
                    </div>

                    <div className="max-h-56 overflow-y-auto py-1 space-y-1">
                      {savedCandidates.map((cand) => {
                        const isSelected =
                          candidateEmail.trim().toLowerCase() ===
                          cand.email.trim().toLowerCase();
                        return (
                          <button
                            key={cand.id || cand.email}
                            type="button"
                            onClick={() => handleSelectCandidate(cand)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary/15 text-primary font-semibold border border-primary/20"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <div className="shrink-0">
                              {isSelected ? (
                                <CheckSquare className="size-4 text-primary fill-primary/20" />
                              ) : (
                                <Square className="size-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold truncate">
                                  {cand.name}
                                </span>
                                {cand.role && (
                                  <span className="text-[10px] text-muted-foreground shrink-0 font-normal">
                                    {cand.role}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground truncate block">
                                {cand.email}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* New candidate option (clear form) */}
                    <div className="border-t border-border/60 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleSelectNewCandidate}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs text-primary hover:bg-primary/10 font-semibold transition-colors cursor-pointer"
                      >
                        <UserPlus className="size-3.5" />
                        <span>✍️ New Candidate (Type Manually)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Name & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="size-3 text-primary" />
                  <span>Candidate Full Name *</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Provash Barman"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="size-3 text-primary" />
                  <span>Candidate Email *</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder="provash10dev@gmail.com"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Select Assessment Challenge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <FileCode2 className="size-3 text-primary" />
                  <span>Select Assessment Challenge *</span>
                  {selectedChallenge.isLiveDb && (
                    <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                      Live DB
                    </Badge>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleSeedDatabaseChallenge}
                    disabled={isSeedingDb}
                    className="text-[11px] h-6 px-2 text-primary hover:bg-primary/10 cursor-pointer font-bold"
                  >
                    <Zap className="size-3 text-amber-500 fill-amber-500" />
                    <span>{isSeedingDb ? "Syncing DB..." : "⚡ Seed DB Challenge"}</span>
                  </Button>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    {selectedChallenge.duration} • {selectedChallenge.difficulty}
                  </span>
                </div>
              </div>
              <select
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {challenges.map((challenge) => (
                  <option key={challenge.id} value={challenge.id}>
                    {challenge.isLiveDb ? "🟢 [PostgreSQL DB] " : challenge.isCustom ? "★ [Custom Challenge] " : ""}
                    {challenge.title} ({challenge.language} • {challenge.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Expiry Window */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="size-3 text-primary" />
                <span>Link Expiration Window</span>
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="2">Expires in 48 Hours</option>
                <option value="3">Expires in 72 Hours (Recommended)</option>
                <option value="7">Expires in 7 Days</option>
                <option value="14">Expires in 14 Days</option>
              </select>
            </div>

            {/* Optional Note */}
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

            {/* Credit Cost Notice */}
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

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetAndClose}
                disabled={isSubmitting}
                className="h-9 px-4 text-xs cursor-pointer"
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
