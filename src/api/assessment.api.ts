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
  // console.log("fetching all assessments");
  return apiClient<ApiResponse<Assessment[]>>("/assessment", {
    params,
  });
}

export function getSingleAssessment(id: string) {
  // console.log("fetching single assessment details");
  return apiClient<ApiResponse<Assessment>>(`/assessment/${id}`);
}

export function getAssessmentLeaderboard(id: string) {
  // console.log("fetching assessment leaderboard rankings");
  return apiClient<ApiResponse<CandidateAttempt[]>>(
    `/assessment/${id}/leaderboard`,
  );
}

export function getAssessmentAnalytics(id: string) {
  // console.log("fetching assessment analytics");
  return apiClient<ApiResponse<Record<string, unknown>>>(
    `/assessment/${id}/analytics`,
  );
}

export function getMyAttempts() {
  // console.log("fetching my candidate attempts");
  return apiClient<ApiResponse<CandidateAttempt[]>>("/attempt/my-attempts");
}

export function startAttempt(assessmentId: string) {
  // console.log("starting new assessment attempt");
  return apiClient<ApiResponse<CandidateAttempt>>(
    `/attempt/${assessmentId}/start`,
    {
      method: "POST",
    },
  );
}

export function getAttemptQuestions(attemptId: string) {
  // console.log("fetching attempt questions");
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
  // console.log("submitting answer for attempt question");
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
  // console.log("recording anti-cheat telemetry flag");
  return apiClient<ApiResponse<{ flagsCount: number }>>(
    `/attempt/${attemptId}/anti-cheat`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function finishAttempt(attemptId: string) {
  // console.log("finishing candidate assessment attempt");
  return apiClient<ApiResponse<CandidateAttempt>>(
    `/attempt/${attemptId}/finish`,
    {
      method: "POST",
    },
  );
}

export function getAttemptResult(attemptId: string) {
  // console.log("fetching attempt evaluation result");
  return apiClient<ApiResponse<CandidateAttempt>>(
    `/attempt/${attemptId}/result`,
  );
}
