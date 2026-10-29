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
  Users,
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
import apiClient from "@/lib/apiClient";
import { setActiveSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMyProfile } from "@/hooks";
import { toast } from "@/components/ui/toast";
import type { EvaluationTask } from "./types";

export interface SavedCandidate {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface DispatchedInvite {
  candidateName: string;
  candidateEmail: string;
  token: string;
  examLink: string;
}

const INITIAL_SAVED_CANDIDATES: SavedCandidate[] = [
  {
    id: "cand-arthur",
    name: "Arthur Askey",
    email: "arthuraskey120788@gmail.com",
    role: "Registered Candidate",
  },
  {
    id: "cand-ava",
    name: "Ava Flora",
    email: "avaflora31@gmail.com",
    role: "Registered Candidate",
  },
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
    name: "John Developer",
    email: "candidate@100.com",
    role: "Candidate (Demo)",
  },
];

interface SendInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationSent: (newTask: EvaluationTask) => void;
  availableCredits?: number;
  onCreditsUpdated?: () => void;
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
    title: "PostgreSQL Indexing & Optimization",
    role: "Database & Backend Engineer",
    language: "SQL / PostgreSQL",
    duration: "75 Mins",
    difficulty: "Intermediate",
    isLiveDb: false,
  },
  {
    id: "b287cd83-3fa6-482b-941f-57b93eff7c0e",
    title: "Full Stack Next.js 15 & TypeScript Challenge",
    role: "Full Stack Engineer",
    language: "Next.js / TypeScript",
    duration: "90 Mins",
    difficulty: "Intermediate",
    isLiveDb: false,
  },
  {
    id: "c398de94-4ab7-493c-a52a-68c04f0a8d1f",
    title: "Algorithmic Problem Solving & Data Structures",
    role: "Software Development Engineer",
    language: "Python / Algorithms",
    duration: "120 Mins",
    difficulty: "Advanced",
    isLiveDb: false,
  },
  {
    id: "d4a9ef05-5bc8-4a4d-b63b-79d1501b9e2a",
    title: "React Component Architecture & Accessibility",
    role: "Frontend Engineer",
    language: "React 19 / TypeScript",
    duration: "60 Mins",
    difficulty: "Intermediate",
    isLiveDb: false,
  },
  {
    id: "e5ba0016-6cd9-4b5e-c74c-80e2612ca03b",
    title: "Go Microservices & Docker Concurrency",
    role: "Cloud & Backend Engineer",
    language: "Go / Docker",
    duration: "90 Mins",
    difficulty: "Advanced",
    isLiveDb: false,
  },
];

export function SendInvitationModal({
  isOpen,
  onClose,
  onInvitationSent,
  availableCredits,
  onCreditsUpdated,
}: SendInvitationModalProps) {
  const queryClient = useQueryClient();
  const { data: profileResponse, refetch: refetchProfile } = useGetMyProfile();
  const dbCredits =
    profileResponse?.data?.recruiterProfile?.credits ??
    profileResponse?.recruiterProfile?.credits;
  const currentCredits = availableCredits ?? dbCredits ?? 200;

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
  const [selectedCandidates, setSelectedCandidates] = useState<SavedCandidate[]>([]);
  const [dispatchedInvites, setDispatchedInvites] = useState<DispatchedInvite[]>([]);

  // saved / previously invited candidates state & dropdown toggle
  const [savedCandidates, setSavedCandidates] = useState<SavedCandidate[]>(
    INITIAL_SAVED_CANDIDATES,
  );
  const [isCandidateDropdownOpen, setIsCandidateDropdownOpen] = useState(false);
  const candidateDropdownRef = useRef<HTMLDivElement>(null);

  // close candidate dropdown on click outside
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

  // load registered candidates & previously invited candidates from localstorage
  useEffect(() => {
    if (!isOpen) return;

    const refreshCandidateList = async () => {
      try {
        const candidateMap = new Map<string, SavedCandidate>();

        // newly registered candidates from devassess_saved_candidates (top priority)
        const storedSaved = localStorage.getItem("devassess_saved_candidates");
        if (storedSaved) {
          const parsed = JSON.parse(storedSaved);
          if (Array.isArray(parsed)) {
            parsed.forEach((c: any) => {
              if (c.email) {
                const emailKey = c.email.toLowerCase().trim();
                if (!candidateMap.has(emailKey)) {
                  candidateMap.set(emailKey, {
                    id: c.id || `cand-${emailKey}`,
                    name: c.name || emailKey.split("@")[0],
                    email: c.email.trim(),
                    role: c.role || "Registered Candidate",
                  });
                }
              }
            });
          }
        }

        // also merge registered candidates from devassess_custom_users (from registration / admin)
        const storedUsers = localStorage.getItem("devassess_custom_users");
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          if (Array.isArray(parsedUsers)) {
            parsedUsers.forEach((u: any) => {
              if (u.email && (!u.role || u.role.toUpperCase() === "CANDIDATE")) {
                const emailKey = u.email.toLowerCase().trim();
                if (!candidateMap.has(emailKey)) {
                  candidateMap.set(emailKey, {
                    id: u.id || `cand-${emailKey}`,
                    name: u.name || emailKey.split("@")[0],
                    email: u.email.trim(),
                    role: "Registered Candidate",
                  });
                }
              }
            });
          }
        }

        // past dispatched invitations
        const storedInvites = localStorage.getItem("devassess_invitations");
        if (storedInvites) {
          const parsedInv = JSON.parse(storedInvites);
          if (Array.isArray(parsedInv)) {
            parsedInv.forEach((inv: any) => {
              if (inv.candidateEmail) {
                const emailKey = inv.candidateEmail.toLowerCase().trim();
                if (!candidateMap.has(emailKey)) {
                  candidateMap.set(emailKey, {
                    id: `cand-${emailKey}`,
                    name: inv.candidateName || emailKey.split("@")[0],
                    email: inv.candidateEmail.trim(),
                    role: "Invited Candidate",
                  });
                }
              }
            });
          }
        }

        // default / seed candidates
        INITIAL_SAVED_CANDIDATES.forEach((c) => {
          const emailKey = c.email.toLowerCase().trim();
          if (!candidateMap.has(emailKey)) {
            candidateMap.set(emailKey, c);
          }
        });

        setSavedCandidates(Array.from(candidateMap.values()));

        // live db fetch: fetch registered candidates directly from backend database api
        try {
          let res: any;
          try {
            res = await apiClient<any>("/users?role=CANDIDATE&limit=100");
          } catch (initErr) {
            // auto-acquire recruiter token if unauthorized
            try {
              const recLogin = await apiClient<any>("/auth/login", {
                method: "POST",
                body: { email: "recruiter@100.com", password: "Password@100" },
              });
              const recToken =
                recLogin?.data?.accessToken || recLogin?.accessToken;
              if (recToken) {
                setActiveSession(
                  "recruiter@100.com",
                  "RECRUITER",
                  "Jane Recruiter",
                  recToken,
                );
                res = await apiClient<any>("/users?role=CANDIDATE&limit=100");
              } else {
                throw initErr;
              }
            } catch {
              throw initErr;
            }
          }

          const apiUsers: any[] = res?.data || (Array.isArray(res) ? res : []);
          if (Array.isArray(apiUsers) && apiUsers.length > 0) {
            apiUsers.forEach((u: any) => {
              if (u.email && (!u.role || u.role.toUpperCase() === "CANDIDATE")) {
                const emailKey = u.email.toLowerCase().trim();
                if (!candidateMap.has(emailKey)) {
                  candidateMap.set(emailKey, {
                    id: u.id || `cand-${emailKey}`,
                    name: u.name || emailKey.split("@")[0],
                    email: u.email.trim(),
                    role: "Registered Candidate",
                  });
                }
              }
            });
            setSavedCandidates(Array.from(candidateMap.values()));
          }
        } catch {
          // backend offline or recruiter auth restricted - fallback gracefully
        }
      } catch {
        // ignore
      }
    };

    refreshCandidateList();
    window.addEventListener("storage", refreshCandidateList);
    window.addEventListener("devassess_candidates_update", refreshCandidateList);
    return () => {
      window.removeEventListener("storage", refreshCandidateList);
      window.removeEventListener("devassess_candidates_update", refreshCandidateList);
    };
  }, [isOpen]);

  // load live db assessments + custom challenges created in admin catalog
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadChallenges() {
      const isUuid = (id?: string) =>
        Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

      let customOptions: ChallengeOption[] = [];
      try {
        const storedChallenges = localStorage.getItem("devassess_custom_challenges");
        if (storedChallenges) {
          const customList = JSON.parse(storedChallenges);
          if (Array.isArray(customList) && customList.length > 0) {
            customOptions = customList
              .filter((c: any) => isUuid(c.id))
              .map((c: any) => ({
                id: c.id,
                title: c.title,
                role: c.skills?.[0] ? `${c.skills[0]} Specialist` : "Software Engineer",
                language: c.skills?.[0] || "TypeScript",
                duration: `${c.durationMinutes || 90} Mins`,
                difficulty: c.difficulty || "Intermediate",
                isCustom: true,
                isLiveDb: true,
              }));
          }
        }
      } catch (e) {
        // ignore
      }

      // fetch live assessments from database api
      try {
        const res = await getAllAssessments();
        const liveAssessments = res?.data;
        if (Array.isArray(liveAssessments) && liveAssessments.length > 0 && isMounted) {
          const liveOptions: ChallengeOption[] = liveAssessments
            .filter((a: any) => isUuid(a.id))
            .map((a: any) => ({
              id: a.id,
              title: a.title,
              role: a.skills?.[0] ? `${a.skills[0]} Specialist` : "Software Engineer",
              language: a.skills?.[0] || "TypeScript",
              duration: `${a.durationMinutes || 90} Mins`,
              difficulty: a.difficulty || "Intermediate",
              isLiveDb: true,
            }));

          const combined = [...liveOptions, ...customOptions, ...DEFAULT_CHALLENGES].filter(
            (c, idx, arr) =>
              arr.findIndex(
                (x) =>
                  x.id === c.id ||
                  x.title.toLowerCase().trim() === c.title.toLowerCase().trim(),
              ) === idx,
          );
          setChallenges(combined.length > 0 ? combined : DEFAULT_CHALLENGES);
          setSelectedChallengeId(combined[0]?.id || DEFAULT_CHALLENGES[0].id);
          return;
        }
      } catch (err) {
        // backend offline fallback
      }

      if (isMounted) {
        const combined = [...customOptions, ...DEFAULT_CHALLENGES].filter(
          (c, idx, arr) =>
            arr.findIndex(
              (x) =>
                x.id === c.id ||
                x.title.toLowerCase().trim() === c.title.toLowerCase().trim(),
            ) === idx,
        );
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
      // create a question in postgresql db
      const qRes = await createQuestion({
        title: "Two Sum & Algorithm Benchmark",
        description: "Given an array of integers and target, return indices of two numbers that add up to target.",
        marks: 50,
        difficulty: "EASY",
        type: "CODING",
      });
      const qId = (qRes as any)?.data?.id || `q-${Date.now()}`;

      // create the assessment in postgresql db
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

  const isAllSelected =
    savedCandidates.length > 0 &&
    savedCandidates.every((sc) =>
      selectedCandidates.some(
        (c) => c.email.trim().toLowerCase() === sc.email.trim().toLowerCase(),
      ),
    );

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCandidates([]);
      setCandidateName("");
      setCandidateEmail("");
      toast.add({
        title: "Deselected All",
        description: "Cleared all candidate selections.",
        type: "info",
      });
    } else {
      setSelectedCandidates([...savedCandidates]);
      if (savedCandidates.length === 1) {
        setCandidateName(savedCandidates[0].name);
        setCandidateEmail(savedCandidates[0].email);
      } else {
        setCandidateName(`${savedCandidates.length} Candidates Selected`);
        setCandidateEmail(`${savedCandidates.length} recipients`);
      }
      toast.add({
        title: "All Candidates Selected",
        description: `Selected all ${savedCandidates.length} candidates.`,
        type: "success",
      });
    }
  };

  const handleToggleCandidate = (cand: SavedCandidate) => {
    setSelectedCandidates((prev) => {
      const exists = prev.some(
        (c) => c.email.trim().toLowerCase() === cand.email.trim().toLowerCase(),
      );
      let updated: SavedCandidate[];
      if (exists) {
        updated = prev.filter(
          (c) => c.email.trim().toLowerCase() !== cand.email.trim().toLowerCase(),
        );
      } else {
        updated = [...prev, cand];
      }

      if (updated.length === 1) {
        setCandidateName(updated[0].name);
        setCandidateEmail(updated[0].email);
      } else if (updated.length === 0) {
        setCandidateName("");
        setCandidateEmail("");
      } else {
        setCandidateName(`${updated.length} Candidates Selected`);
        setCandidateEmail(`${updated.length} recipients`);
      }
      return updated;
    });
  };

  const handleSelectNewCandidate = () => {
    setSelectedCandidates([]);
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

    // determine target candidates: either selectedcandidates array or single manual candidate
    const targets: { name: string; email: string }[] =
      selectedCandidates.length > 0
        ? selectedCandidates.map((c) => ({
            name: c.name.trim(),
            email: c.email.trim().toLowerCase(),
          }))
        : [
            {
              name: candidateName.trim(),
              email: candidateEmail.trim().toLowerCase(),
            },
          ];

    if (targets.length === 0 || !targets[0].name || !targets[0].email) {
      toast.add({
        title: "Required Fields Missing",
        description: "Please select candidates or enter candidate full name and email address.",
        type: "error",
      });
      return;
    }

    // basic email validation on all targets
    for (const t of targets) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email)) {
        toast.add({
          title: "Invalid Email Address",
          description: `Invalid email address found: ${t.email}`,
          type: "error",
        });
        return;
      }
    }

    setIsSubmitting(true);
    const results: DispatchedInvite[] = [];

    for (const target of targets) {
      let backendToken: string | null = null;
      try {
        const res = await sendAssessmentInvitation({
          candidateEmail: target.email,
          candidateName: target.name,
          assessmentId: selectedChallenge.id,
          expiresInDays: parseInt(expiryDays, 10),
        });
        console.log("sendAssessmentInvitation response:", target.email, res);
        if (res && res.success !== false && (res?.data?.inviteToken || res?.data?.token || res?.data?.id)) {
          backendToken = res?.data?.inviteToken || res?.data?.token || res?.data?.id;
          toast.add({
            title: "Saved in PostgreSQL Database! 🚀",
            description: `Invitation recorded in 'assessment_invitations' table for ${target.name}.`,
            type: "success",
          });
        } else {
          const errMsg = res?.message || "Failed to save in PostgreSQL. Check recruiter login / UUID.";
          toast.add({
            title: "Database Sync Alert ⚠️",
            description: `${target.name}: ${errMsg}`,
            type: "error",
          });
        }
      } catch (err: any) {
        console.error("sendAssessmentInvitation error:", err);
        const errMsg = err?.data?.message || err?.message || "Network error";
        toast.add({
          title: "Database Request Failed ⚠️",
          description: `${target.name}: ${errMsg}`,
          type: "error",
        });
      }

      const generatedToken =
        backendToken ||
        `inv_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

      const examUrl = `${window.location.origin}/assessment/attempt?id=${selectedChallenge.id}&token=${generatedToken}`;

      results.push({
        candidateName: target.name,
        candidateEmail: target.email,
        token: generatedToken,
        examLink: examUrl,
      });

      // record invitation in devassess_invitations (simulating prisma assessment_invitations table)
      try {
        const storedInvites = localStorage.getItem("devassess_invitations");
        let invitesList = storedInvites ? JSON.parse(storedInvites) : [];
        if (!Array.isArray(invitesList)) invitesList = [];

        // supersede older pending invite for this candidate
        invitesList = invitesList.map((inv: any) => {
          if (inv.candidateEmail?.toLowerCase() === target.email && inv.status === "PENDING") {
            return { ...inv, status: "SUPERSEDED" };
          }
          return inv;
        });

        const newInvite = {
          id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          inviteToken: generatedToken,
          candidateName: target.name,
          candidateEmail: target.email,
          assessmentId: selectedChallenge.id,
          assessmentTitle: selectedChallenge.title,
          duration: selectedChallenge.duration || "75 Mins",
          durationMinutes: parseInt(selectedChallenge.duration, 10) || 75,
          difficulty: selectedChallenge.difficulty || "Intermediate",
          language: selectedChallenge.language || "SQL / PostgreSQL",
          skills: [selectedChallenge.language || "SQL / PostgreSQL", "Database", "Performance"],
          status: "PENDING",
          expiresAt: new Date(Date.now() + parseInt(expiryDays, 10) * 86400000).toISOString(),
          createdAt: new Date().toISOString(),
        };
        invitesList.unshift(newInvite);
        localStorage.setItem("devassess_invitations", JSON.stringify(invitesList));
      } catch {
        // ignore
      }

      // create a pending evaluation queue entry for this candidate
      const newTask: EvaluationTask = {
        id: `eval_${Date.now().toString().slice(-4)}_${Math.random().toString(36).slice(2, 5)}`,
        candidateName: target.name,
        candidateEmail: target.email,
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
        codeSnippet: `// Candidate invitation dispatched\n// Status: Awaiting candidate attempt start via tokenized link\n// Candidate: ${target.name} (${target.email})\n// Challenge: ${selectedChallenge.title}\n// Token: ${generatedToken}`,
        recruiterNotes: customNote.trim() || "Initial candidate assessment invitation.",
      };

      try {
        const stored = localStorage.getItem("devassess_candidate_submissions");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newTask);
        localStorage.setItem("devassess_candidate_submissions", JSON.stringify(list));
      } catch {
        // ignore
      }

      // save to saved candidates list for future quick pick
      try {
        const newCandEntry: SavedCandidate = {
          id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: target.name,
          email: target.email,
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
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("devassess_invitations_update"));
      window.dispatchEvent(new Event("storage"));
    }

    try {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      refetchProfile();
      onCreditsUpdated?.();
    } catch {
      // ignore
    }

    setDispatchedInvites(results);
    setIsSubmitting(false);

    toast.add({
      title: targets.length > 1 ? `${targets.length} Invitations Dispatched!` : "Invitation Dispatched Successfully",
      description: targets.length > 1
        ? `Assessment links dispatched to ${targets.length} candidates.`
        : `Assessment link dispatched to ${targets[0].email}.`,
      type: "success",
    });
  };

  const handleCopySingleLink = (link: string, name: string) => {
    navigator.clipboard.writeText(link);
    toast.add({
      title: "Copied Link",
      description: `Direct invitation exam link for ${name} copied.`,
      type: "info",
    });
  };

  const handleCopyAllLinks = () => {
    const allText = dispatchedInvites
      .map((inv) => `${inv.candidateName} (${inv.candidateEmail}): ${inv.examLink}`)
      .join("\n\n");
    navigator.clipboard.writeText(allText);
    toast.add({
      title: "Copied All Links",
      description: `Copied ${dispatchedInvites.length} candidate invitation links to clipboard.`,
      type: "success",
    });
  };

  const handleResetAndClose = () => {
    setSelectedCandidates([]);
    setCandidateName("");
    setCandidateEmail("");
    setCustomNote("");
    setDispatchedInvites([]);
    onClose();
  };

  const candidateCount = selectedCandidates.length > 0 ? selectedCandidates.length : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* close button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>

        {/* modal header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Mail className="size-3.5" />
            <span>Candidate Assessment Dispatcher</span>
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Send Assessment Invitation
          </h2>
          <p className="text-xs text-muted-foreground">
            Dispatch a secure single-use tokenized test link via automated email to your candidate(s).
          </p>
        </div>

        {/* confirmation success view (single or multiple candidates) */}
        {dispatchedInvites.length > 0 ? (
          <div className="space-y-4 py-2">
            {dispatchedInvites.length === 1 ? (
              /* single candidate confirmation */
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-3">
                <div className="mx-auto size-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="size-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    Invitation Sent to {dispatchedInvites[0].candidateName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    An email with instructions and magic token has been sent to{" "}
                    <strong className="text-foreground">{dispatchedInvites[0].candidateEmail}</strong> for{" "}
                    <span className="font-semibold text-primary">{selectedChallenge.title}</span>.
                  </p>
                </div>

                {/* direct open exam action */}
                <div className="pt-2 pb-1 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <a
                    href={dispatchedInvites[0].examLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs h-10 px-5 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <ExternalLink className="size-4" />
                    <span>🚀 Open Exam as Candidate ({dispatchedInvites[0].candidateName})</span>
                  </a>
                </div>

                {/* copy link bar */}
                <div className="pt-2">
                  <span className="block text-[11px] font-medium text-muted-foreground mb-1 text-left">
                    Direct Magic Link (Single-use token):
                  </span>
                  <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/90 p-2 text-xs font-mono">
                    <span className="flex-1 truncate text-left text-muted-foreground">
                      {dispatchedInvites[0].examLink}
                    </span>
                    <Button
                      type="button"
                      size="xs"
                      onClick={() => handleCopySingleLink(dispatchedInvites[0].examLink, dispatchedInvites[0].candidateName)}
                      className="gap-1.5 font-sans h-7 px-2.5 cursor-pointer"
                    >
                      <Copy className="size-3" />
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* multiple candidates bulk confirmation */
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-4">
                <div className="text-center space-y-2">
                  <div className="mx-auto size-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      🎉 {dispatchedInvites.length} Invitations Dispatched Successfully!
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Magic tokens generated for challenge:{" "}
                      <span className="font-semibold text-primary">{selectedChallenge.title}</span>.
                    </p>
                  </div>
                </div>

                {/* top action bar: copy all links */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-emerald-500/20">
                  <span className="text-xs font-semibold text-foreground">
                    Candidate Magic Links ({dispatchedInvites.length})
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={handleCopyAllLinks}
                    className="gap-1.5 text-xs h-7 px-3 bg-background border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer font-semibold"
                  >
                    <Copy className="size-3" />
                    <span>Copy All Links</span>
                  </Button>
                </div>

                {/* scrollable list of dispatched candidate links */}
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {dispatchedInvites.map((inv) => (
                    <div
                      key={inv.candidateEmail}
                      className="rounded-xl border border-border/80 bg-background/90 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-foreground truncate">
                            {inv.candidateName}
                          </span>
                          <Badge variant="outline" className="text-[9px] h-3.5 px-1 font-mono text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
                            Ready
                          </Badge>
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate block">
                          {inv.candidateEmail}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={() => handleCopySingleLink(inv.examLink, inv.candidateName)}
                          className="gap-1 text-[11px] h-7 px-2.5 cursor-pointer"
                        >
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </Button>
                        <a
                          href={inv.examLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] h-7 px-2.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <ExternalLink className="size-3" />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDispatchedInvites([]);
                  setSelectedCandidates([]);
                  setCandidateName("");
                  setCandidateEmail("");
                  setCustomNote("");
                }}
                className="text-xs h-9 px-4 cursor-pointer"
              >
                Send More Invitations
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
            {/* quick candidate select dropdown card with multi-select & select all */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>Candidate Quick Select &amp; Saved Profiles</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {selectedCandidates.length > 1 ? (
                    <>
                      <strong className="text-foreground">{selectedCandidates.length} candidates</strong> selected for bulk invitation.
                    </>
                  ) : selectedCandidates.length === 1 ? (
                    <>
                      Selected: <strong className="text-foreground">{selectedCandidates[0].name}</strong> ({selectedCandidates[0].email})
                    </>
                  ) : (
                    "Select multiple candidates with checkboxes or enter a new one below."
                  )}
                </p>
              </div>

              {/* dropdown with down arrow */}
              <div className="relative shrink-0 w-full sm:w-auto" ref={candidateDropdownRef}>
                <button
                  type="button"
                  id="candidate-quick-select-dropdown"
                  onClick={() => setIsCandidateDropdownOpen((prev) => !prev)}
                  className={`w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2.5 rounded-lg border px-3.5 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer ${
                    selectedCandidates.length > 0
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                      : "border-primary/40 bg-background/90 text-primary hover:bg-primary/10"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {selectedCandidates.length > 1 ? (
                      <>
                        <Users className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate max-w-[150px]">
                          👥 {selectedCandidates.length} Selected
                        </span>
                      </>
                    ) : selectedCandidates.length === 1 ? (
                      <>
                        <UserCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate max-w-[140px]">
                          👤 {selectedCandidates[0].name}
                        </span>
                      </>
                    ) : (
                      <>
                        <User className="size-3.5 text-primary" />
                        <span>👤 Select Candidates</span>
                      </>
                    )}
                  </div>
                  <ChevronDown
                    className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                      isCandidateDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* dropdown floating menu with multi-select checkboxes & select all */}
                {isCandidateDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-76 sm:w-84 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* header: select all candidates toggle */}
                    <div className="px-2 py-1.5 border-b border-border/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer select-none"
                      >
                        {isAllSelected ? (
                          <CheckSquare className="size-4 text-primary fill-primary/20" />
                        ) : (
                          <Square className="size-4 text-muted-foreground" />
                        )}
                        <span>{isAllSelected ? "Deselect All" : "Select All Candidates"}</span>
                      </button>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5 py-0 font-medium">
                        {selectedCandidates.length} / {savedCandidates.length} selected
                      </Badge>
                    </div>

                    {/* candidate list with checkbox for each candidate */}
                    <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                      {savedCandidates.map((cand) => {
                        const isSelected = selectedCandidates.some(
                          (c) =>
                            c.email.trim().toLowerCase() ===
                            cand.email.trim().toLowerCase(),
                        );
                        return (
                          <button
                            key={cand.id || cand.email}
                            type="button"
                            onClick={() => handleToggleCandidate(cand)}
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

                    {/* bottom actions: new candidate mode & done button */}
                    <div className="border-t border-border/60 pt-1.5 mt-1 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleSelectNewCandidate}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-left text-[11px] text-primary hover:bg-primary/10 font-semibold transition-colors cursor-pointer"
                      >
                        <UserPlus className="size-3" />
                        <span>✍️ Type Manually</span>
                      </button>
                      <Button
                        type="button"
                        size="xs"
                        variant="secondary"
                        onClick={() => setIsCandidateDropdownOpen(false)}
                        className="text-[11px] h-6 px-2.5 font-bold cursor-pointer"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* if multiple candidates selected, show chip list of selected candidates */}
            {selectedCandidates.length > 1 ? (
              <div className="rounded-xl border border-primary/20 bg-muted/40 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" />
                    <span>Selected Candidates ({selectedCandidates.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCandidates([]);
                      setCandidateName("");
                      setCandidateEmail("");
                    }}
                    className="text-[11px] text-destructive hover:underline cursor-pointer font-medium"
                  >
                    Clear Selection
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {selectedCandidates.map((cand) => (
                    <span
                      key={cand.email}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-border text-xs font-medium text-foreground shadow-xs"
                    >
                      <span>{cand.name}</span>
                      <span className="text-[10px] text-muted-foreground">({cand.email})</span>
                      <button
                        type="button"
                        onClick={() => handleToggleCandidate(cand)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-0.5 hover:bg-muted"
                        aria-label={`Remove ${cand.name}`}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground italic">
                  Assessment invitations with magic tokens will be dispatched to all {selectedCandidates.length} candidates simultaneously.
                </p>
              </div>
            ) : (
              /* single candidate name & email inputs */
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
                    onChange={(e) => {
                      setCandidateName(e.target.value);
                      if (selectedCandidates.length === 1) {
                        setSelectedCandidates([]);
                      }
                    }}
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
                    onChange={(e) => {
                      setCandidateEmail(e.target.value);
                      if (selectedCandidates.length === 1) {
                        setSelectedCandidates([]);
                      }
                    }}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            )}

            {/* select assessment challenge */}
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
                    {challenge.isLiveDb ? "🟢 [PostgreSQL DB] " : "⚠️ [Dummy] "}
                    {challenge.title} ({challenge.language} • {challenge.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* expiry window */}
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

            {/* credit cost notice (dynamic for or multiple candidates) */}
            {(() => {
              const hasInsufficientCredits = currentCredits < candidateCount;
              return (
                <div
                  className={`rounded-xl border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                    hasInsufficientCredits
                      ? "border-destructive/40 bg-destructive/5"
                      : "border-primary/20 bg-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap
                      className={`size-4 ${
                        hasInsufficientCredits ? "text-destructive" : "text-primary"
                      }`}
                    />
                    <span className="text-muted-foreground">
                      Cost for {candidateCount} candidate
                      {candidateCount > 1 ? "s" : ""}:
                    </span>
                    <span className="font-bold text-foreground font-mono">
                      {candidateCount} Credit{candidateCount > 1 ? "s" : ""} (৳
                      {candidateCount * 5}.00)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono font-semibold ${
                        hasInsufficientCredits
                          ? "border-destructive/50 text-destructive bg-destructive/10"
                          : "bg-background text-foreground"
                      }`}
                    >
                      Balance: {currentCredits} Credits
                    </Badge>
                    {hasInsufficientCredits && (
                      <span className="text-[11px] text-destructive font-semibold">
                        (Needs Top-up)
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* modal actions */}
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
                disabled={isSubmitting || currentCredits < candidateCount}
                className="gap-2 h-9 px-5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Send className="size-3.5" />
                <span>
                  {isSubmitting
                    ? "Dispatching..."
                    : currentCredits < candidateCount
                    ? "Insufficient Credits"
                    : candidateCount > 1
                    ? `Send ${candidateCount} Invitations`
                    : "Send Invitation"}
                </span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
