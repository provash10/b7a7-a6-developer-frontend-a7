import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Assessment,
  AssessmentParams,
  CandidateAttempt,
  Question,
  Submission,
} from "@/types";

export function getAllAssessments(params?: AssessmentParams) {
  return apiClient<ApiResponse<Assessment[]>>("/assessment", {
    params,
  });
}

export function getSingleAssessment(id: string) {
  return apiClient<ApiResponse<Assessment>>(`/assessment/${id}`);
}

export function getAssessmentLeaderboard(id: string) {
  return apiClient<ApiResponse<CandidateAttempt[]>>(
    `/assessment/${id}/leaderboard`,
  );
}

export function getAssessmentAnalytics(id: string) {
  return apiClient<ApiResponse<Record<string, unknown>>>(
    `/assessment/${id}/analytics`,
  );
}

export function getMyAttempts() {
  return apiClient<ApiResponse<CandidateAttempt[]>>("/attempt/my-attempts");
}

export function startAttempt(assessmentId: string) {
  return apiClient<ApiResponse<CandidateAttempt>>(
    `/attempt/${assessmentId}/start`,
    {
      method: "POST",
    },
  );
}

export function getAttemptQuestions(attemptId: string) {
  return apiClient<ApiResponse<Question[]>>(`/attempt/${attemptId}/questions`);
}

export function submitAnswer(
  attemptId: string,
  payload: {
    questionId: string;
    submittedCode?: string;
    selectedOption?: string;
  },
) {
  return apiClient<ApiResponse<Submission>>(
    `/attempt/${attemptId}/submit-answer`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function recordAntiCheatFlag(
  attemptId: string,
  payload: {
    eventType: "TAB_SWITCH" | "WINDOW_BLUR" | "FULLSCREEN_EXIT";
    timestamp?: string;
  },
) {
  return apiClient<ApiResponse<{ flagsCount: number }>>(
    `/attempt/${attemptId}/anti-cheat`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function finishAttempt(attemptId: string) {
  return apiClient<ApiResponse<CandidateAttempt>>(
    `/attempt/${attemptId}/finish`,
    {
      method: "POST",
    },
  );
}

export function getAttemptResult(attemptId: string) {
  return apiClient<ApiResponse<CandidateAttempt>>(
    `/attempt/${attemptId}/result`,
  );
}
