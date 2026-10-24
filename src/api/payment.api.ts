import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ExecutePaymentResponse,
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  PaymentFilterParams,
  PaymentTransaction,
} from "@/types";

export function initiatePayment(payload: InitiatePaymentPayload) {
  return apiClient<ApiResponse<InitiatePaymentResponse>>("/payments/initiate", {
    method: "POST",
    body: payload,
  });
}

export function executePaymentCallback(params: {
  paymentID: string;
  status: string;
}) {
  return apiClient<ApiResponse<ExecutePaymentResponse>>("/payments/callback", {
    method: "GET",
    params,
  });
}

export function getSinglePaymentTransaction(id: string) {
  return apiClient<ApiResponse<PaymentTransaction>>(`/payments/${id}`, {
    method: "GET",
  });
}

export function getMyPaymentTransactions(params?: PaymentFilterParams) {
  return apiClient<ApiResponse<PaymentTransaction[]>>(
    "/payments/my-transactions",
    {
      method: "GET",
      params,
    },
  );
}

export function getAllPaymentTransactions(params?: PaymentFilterParams) {
  return apiClient<ApiResponse<PaymentTransaction[]>>(
    "/payments/all-transactions",
    {
      method: "GET",
      params,
    },
  );
}
