import { useMutation, useQuery } from "@tanstack/react-query";
import {
  executePaymentCallback,
  getAllPaymentTransactions,
  getMyPaymentTransactions,
  getSinglePaymentTransaction,
  initiatePayment,
} from "@/api/payment.api";
import type { InitiatePaymentPayload, PaymentFilterParams } from "@/types";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (payload: InitiatePaymentPayload) => initiatePayment(payload),
  });
}

export function useExecutePaymentCallback() {
  return useMutation({
    mutationFn: (params: { paymentID: string; status: string }) =>
      executePaymentCallback(params),
  });
}

export function useGetSinglePaymentTransaction(id: string | null | undefined) {
  return useQuery({
    queryKey: ["payment-transaction", id],
    queryFn: () => getSinglePaymentTransaction(id as string),
    enabled: Boolean(id),
  });
}

export function useGetMyPaymentTransactions(params?: PaymentFilterParams) {
  return useQuery({
    queryKey: ["my-payment-transactions", params],
    queryFn: () => getMyPaymentTransactions(params),
  });
}

export function useGetAllPaymentTransactions(params?: PaymentFilterParams) {
  return useQuery({
    queryKey: ["all-payment-transactions", params],
    queryFn: () => getAllPaymentTransactions(params),
  });
}
