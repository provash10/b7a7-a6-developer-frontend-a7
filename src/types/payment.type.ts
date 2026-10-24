export type PaymentProvider = "BKASH" | "STRIPE" | "SSLCOMMERZ";

export type PaymentTransactionStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export interface PaymentTransactionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PaymentTransactionDetails {
  credits?: number;
  merchantInvoiceNumber?: string;
  payerReference?: string;
  bkashPaymentId?: string;
  trxID?: string;
  paymentExecuteTime?: string;
  executedResult?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number | string;
  currency: string;
  provider: PaymentProvider;
  transactionId: string;
  status: PaymentTransactionStatus;
  paymentDetails?: PaymentTransactionDetails | null;
  createdAt: string;
  updatedAt: string;
  user?: PaymentTransactionUser;
}

export interface InitiatePaymentPayload {
  credits: number;
}

export interface InitiatePaymentResponse {
  transactionId: string;
  paymentUrl: string;
  amount: number;
  currency: string;
  credits: number;
  status: string;
}

export interface ExecutePaymentResponse {
  transactionId: string;
  status: string;
  message: string;
  creditsPurchased?: number;
  newTotalCredits?: number;
  trxID?: string;
  amount?: number;
}

export interface PaymentFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  provider?: string;
}
