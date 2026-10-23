// types for recruiter candidate evaluations and review tasks
// console.log("recruiter evaluation types loaded");

export type EvaluationStatus =
  | "PENDING_REVIEW"
  | "IN_REVIEW"
  | "ACCEPTED"
  | "REJECTED";

export type AntiCheatStatus = "CLEAN" | "LOW_RISK" | "FLAGGED";

export interface EvaluationTask {
  id: string;
  candidateName: string;
  candidateEmail: string;
  roleApplied: string;
  challengeTitle: string;
  challengeLanguage: string;
  submittedAt: string;
  score: number;
  testCasesPassed: number;
  totalTestCases: number;
  executionTimeMs: number;
  antiCheatStatus: AntiCheatStatus;
  antiCheatSignals: string[];
  status: EvaluationStatus;
  codeSnippet: string;
  recruiterNotes?: string;
  codeQualityRating?: number;
  architectureRating?: number;
}
