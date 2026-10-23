export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuestionType = "CODING" | "MCQ" | "DESCRIPTIVE";
export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED";
export type AttemptStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED";

export interface TestCase {
  id?: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  marks: number;
  testCases?: TestCase[] | string;
  options?: string[] | Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionId: string;
  orderIndex: number;
  question?: Question;
}

export interface Assessment {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  durationMinutes: number;
  passMarks: number;
  totalMarks: number;
  status: AssessmentStatus;
  startTime?: string | null;
  endTime?: string | null;
  createdAt: string;
  updatedAt: string;
  assessmentQuestions?: AssessmentQuestion[];
  recruiter?: {
    id: string;
    companyName?: string;
    designation?: string;
  };
}

export interface CandidateAttempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatus;
  startedAt?: string | null;
  submittedAt?: string | null;
  totalScore: number;
  isPassed: boolean;
  antiCheatFlags: number;
  createdAt: string;
  submissions?: Submission[];
  assessment?: Assessment;
}

export interface Submission {
  id: string;
  attemptId: string;
  questionId: string;
  submittedCode?: string | null;
  selectedOption?: string | null;
  verdict?:
    | "ACCEPTED"
    | "WRONG_ANSWER"
    | "TIME_LIMIT_EXCEEDED"
    | "RUNTIME_ERROR"
    | string
    | null;
  scoreObtained: number;
  executionTime?: number | null;
  createdAt: string;
  question?: Question;
}

export interface AssessmentParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AssessmentStatus;
}

export interface ServiceFeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
}
