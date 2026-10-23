// types for evaluator earnings, payout requests, and analytics
// console.log("recruiter earnings types loaded");

export type TransactionType =
  | "EVALUATION_FEE"
  | "BONUS_REWARD"
  | "PAYOUT_WITHDRAWAL";

export type TransactionStatus = "COMPLETED" | "PROCESSING" | "PENDING";

export interface EarningsTransaction {
  id: string;
  date: string;
  candidateName: string;
  challengeTitle: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  payoutMethod: string;
  invoiceUrl?: string;
}

export interface MonthlyEarningData {
  month: string;
  earnings: number;
  evaluations: number;
}

export interface CategoryDistribution {
  name: string;
  earnings: number;
  color: string;
}
