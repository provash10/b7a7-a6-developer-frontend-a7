// mock earnings history and analytics datasets for evaluators
// console.log("recruiter earnings mock data loaded");

import type {
  CategoryDistribution,
  EarningsTransaction,
  MonthlyEarningData,
} from "./types";

export const initialEarningsTransactions: EarningsTransaction[] = [
  {
    id: "tx_eval_910",
    date: "2026-10-23 21:45",
    candidateName: "Tariqul Islam",
    challengeTitle: "High-Throughput Raft Consensus Engine",
    type: "EVALUATION_FEE",
    amount: 75,
    status: "COMPLETED",
    payoutMethod: "Stripe Connect",
  },
  {
    id: "tx_eval_909",
    date: "2026-10-23 20:20",
    candidateName: "Nusrat Jahan",
    challengeTitle: "Optimistic Multi-Tab State Synchronization",
    type: "EVALUATION_FEE",
    amount: 65,
    status: "COMPLETED",
    payoutMethod: "Stripe Connect",
  },
  {
    id: "tx_payout_882",
    date: "2026-10-22 15:00",
    candidateName: "—",
    challengeTitle: "Weekly Earnings Withdrawal (Transfer to Bank)",
    type: "PAYOUT_WITHDRAWAL",
    amount: -650,
    status: "COMPLETED",
    payoutMethod: "Bank Wire (Chase •••• 4410)",
  },
  {
    id: "tx_eval_908",
    date: "2026-10-22 11:30",
    candidateName: "Farhana Akter",
    challengeTitle: "Real-time Vector Embedding Indexer",
    type: "EVALUATION_FEE",
    amount: 80,
    status: "COMPLETED",
    payoutMethod: "Stripe Connect",
  },
  {
    id: "tx_bonus_104",
    date: "2026-10-21 18:40",
    candidateName: "—",
    challengeTitle: "Top Reviewer Quality Bonus (Q3 Benchmark)",
    type: "BONUS_REWARD",
    amount: 150,
    status: "COMPLETED",
    payoutMethod: "Platform Credit",
  },
  {
    id: "tx_eval_907",
    date: "2026-10-20 14:15",
    candidateName: "Zubair Rahman",
    challengeTitle: "Lock-Free Ring Buffer for IPC",
    type: "EVALUATION_FEE",
    amount: 85,
    status: "COMPLETED",
    payoutMethod: "Stripe Connect",
  },
  {
    id: "tx_eval_906",
    date: "2026-10-19 16:50",
    candidateName: "Anik Chowdhury",
    challengeTitle: "Custom CRD Operator Controller",
    type: "EVALUATION_FEE",
    amount: 70,
    status: "PROCESSING",
    payoutMethod: "Stripe Connect",
  },
  {
    id: "tx_eval_905",
    date: "2026-10-18 10:20",
    candidateName: "Mahmudul Hasan",
    challengeTitle: "Zero-Downtime Blue-Green Envoy Gateway",
    type: "EVALUATION_FEE",
    amount: 60,
    status: "PENDING",
    payoutMethod: "Stripe Connect",
  },
];

export const monthlyEarningsHistory: MonthlyEarningData[] = [
  { month: "May", earnings: 620, evaluations: 9 },
  { month: "Jun", earnings: 850, evaluations: 12 },
  { month: "Jul", earnings: 1120, evaluations: 16 },
  { month: "Aug", earnings: 1450, evaluations: 21 },
  { month: "Sep", earnings: 1780, evaluations: 25 },
  { month: "Oct", earnings: 2150, evaluations: 29 },
];

export const categoryDistributions: CategoryDistribution[] = [
  { name: "Distributed Systems & Go", earnings: 1450, color: "#3b82f6" },
  { name: "Frontend & Next.js", earnings: 1120, color: "#10b981" },
  { name: "AI / Vector Embeddings", earnings: 980, color: "#8b5cf6" },
  { name: "Cloud & Kubernetes CRD", earnings: 740, color: "#f59e0b" },
  { name: "Rust Systems & IPC", earnings: 530, color: "#ec4899" },
];
