import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Assessment,
  AssessmentParams,
  CandidateAttempt,
  Question,
  Submission,
} from "@/types";

export async function getAllAssessments(params?: AssessmentParams) {
  try {
    return await apiClient<ApiResponse<Assessment[]>>("/assessments", {
      params,
    });
  } catch (err: any) {
    if (err?.status === 404 || err?.statusCode === 404) {
      return await apiClient<ApiResponse<Assessment[]>>("/assessment", {
        params,
      });
    }
    throw err;
  }
}

export async function getSingleAssessment(id: string) {
  try {
    return await apiClient<ApiResponse<Assessment>>(`/assessments/${id}`);
  } catch (err: any) {
    if (err?.status === 404 || err?.statusCode === 404) {
      return await apiClient<ApiResponse<Assessment>>(`/assessment/${id}`);
    }
    throw err;
  }
}

export function getAssessmentLeaderboard(id: string) {
  return apiClient<ApiResponse<CandidateAttempt[]>>(
    `/assessments/${id}/leaderboard`,
  );
}

export function getAssessmentAnalytics(id: string) {
  return apiClient<ApiResponse<Record<string, unknown>>>(
    `/assessments/${id}/analytics`,
  );
}

export async function getMyAttempts() {
  try {
    return await apiClient<ApiResponse<CandidateAttempt[]>>("/attempts/my");
  } catch (err: any) {
    return await apiClient<ApiResponse<CandidateAttempt[]>>(
      "/attempts/my-attempts",
    );
  }
}

export async function startAttempt(assessmentId: string) {
  try {
    return await apiClient<ApiResponse<CandidateAttempt>>(
      `/attempts/${assessmentId}/start`,
      {
        method: "POST",
      },
    );
  } catch (err: any) {
    if (err?.status === 404 || err?.statusCode === 404) {
      return await apiClient<ApiResponse<CandidateAttempt>>(
        `/attempt/${assessmentId}/start`,
        {
          method: "POST",
        },
      );
    }
    throw err;
  }
}

export async function getAttemptQuestions(attemptId: string) {
  try {
    return await apiClient<ApiResponse<Question[]>>(
      `/attempts/${attemptId}/questions`,
    );
  } catch (err: any) {
    return await apiClient<ApiResponse<Question[]>>(
      `/attempt/${attemptId}/questions`,
    );
  }
}

export async function submitAnswer(
  attemptId: string,
  payload: {
    questionId: string;
    submittedCode?: string;
    selectedOption?: string;
  },
) {
  try {
    return await apiClient<ApiResponse<Submission>>(
      `/attempts/${attemptId}/submit-answer`,
      {
        method: "POST",
        body: payload,
      },
    );
  } catch (err: any) {
    return await apiClient<ApiResponse<Submission>>(
      `/attempt/${attemptId}/submit-answer`,
      {
        method: "POST",
        body: payload,
      },
    );
  }
}

export async function recordAntiCheatFlag(
  attemptId: string,
  payload: {
    eventType: "TAB_SWITCH" | "WINDOW_BLUR" | "FULLSCREEN_EXIT";
    timestamp?: string;
  },
) {
  try {
    return await apiClient<ApiResponse<{ flagsCount: number }>>(
      `/attempts/${attemptId}/anti-cheat`,
      {
        method: "POST",
        body: payload,
      },
    );
  } catch (err: any) {
    return await apiClient<ApiResponse<{ flagsCount: number }>>(
      `/attempt/${attemptId}/anti-cheat`,
      {
        method: "POST",
        body: payload,
      },
    );
  }
}

export async function finishAttempt(attemptId: string) {
  try {
    return await apiClient<ApiResponse<CandidateAttempt>>(
      `/attempts/${attemptId}/finish`,
      {
        method: "POST",
      },
    );
  } catch (err: any) {
    return await apiClient<ApiResponse<CandidateAttempt>>(
      `/attempt/${attemptId}/finish`,
      {
        method: "POST",
      },
    );
  }
}

export async function getAttemptResult(attemptId: string) {
  try {
    return await apiClient<ApiResponse<CandidateAttempt>>(
      `/attempts/${attemptId}/result`,
    );
  } catch (err: any) {
    return await apiClient<ApiResponse<CandidateAttempt>>(
      `/attempt/${attemptId}/result`,
    );
  }
}

export async function createQuestion(payload: {
  title: string;
  description: string;
  type?: "CODING" | "MCQ" | "DESCRIPTIVE";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  marks: number;
  testCases?: any;
  options?: any;
}) {
  try {
    return await apiClient<ApiResponse<Question>>("/questions", {
      method: "POST",
      body: payload,
    });
  } catch (err: any) {
    return await apiClient<ApiResponse<Question>>("/question", {
      method: "POST",
      body: payload,
    });
  }
}

export async function getAllQuestions() {
  try {
    return await apiClient<ApiResponse<Question[]>>("/questions", {
      method: "GET",
    });
  } catch (err: any) {
    return await apiClient<ApiResponse<Question[]>>("/question", {
      method: "GET",
    });
  }
}

export async function createAssessment(payload: {
  title: string;
  description: string;
  durationMinutes: number;
  passMarks: number;
  totalMarks: number;
  status?: string;
  difficulty?: string;
  skills?: string[];
  questionIds?: string[];
}) {
  try {
    return await apiClient<ApiResponse<Assessment>>("/assessments", {
      method: "POST",
      body: payload,
    });
  } catch (err: any) {
    return await apiClient<ApiResponse<Assessment>>("/assessment", {
      method: "POST",
      body: payload,
    });
  }
}

export async function sendAssessmentInvitation(payload: {
  candidateEmail: string;
  candidateName?: string;
  assessmentId: string;
  expiresInDays?: number;
}) {
  try {
    // Backend expects { assessmentId, candidateEmail, expiresInDays } at POST /invitations
    return await apiClient<ApiResponse<any>>("/invitations", {
      method: "POST",
      body: {
        assessmentId: payload.assessmentId,
        candidateEmail: payload.candidateEmail,
        expiresInDays: payload.expiresInDays || 3,
      },
    });
  } catch (err: any) {
    if (err?.status === 404 || err?.statusCode === 404) {
      return await apiClient<ApiResponse<any>>("/invitation", {
        method: "POST",
        body: payload,
      });
    }
    throw err;
  }
}

export async function getCandidateInvitations() {
  try {
    return await apiClient<ApiResponse<any>>("/invitations/my");
  } catch (err: any) {
    return null;
  }
}

export async function acceptAssessmentInvitation(invitationId: string) {
  return apiClient<ApiResponse<{ invitation: any; attempt: CandidateAttempt }>>(
    `/invitations/${invitationId}/accept`,
    {
      method: "PATCH",
    },
  );
}

