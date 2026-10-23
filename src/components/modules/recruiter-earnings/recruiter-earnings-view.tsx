"use client";

import { useState } from "react";
import { EarningsAnalyticsCharts } from "./earnings-analytics-charts";
import { EarningsLedgerTable } from "./earnings-ledger-table";
import { EarningsStatsCards } from "./earnings-stats-cards";
import { initialEarningsTransactions } from "./mock-data";
import { PayoutRequestModal } from "./payout-request-modal";
import type { EarningsTransaction } from "./types";

export function RecruiterEarningsView() {
  // console.log("recruiter earnings view component rendered");

  const [availableBalance, setAvailableBalance] = useState<number>(1240);
  const [transactions, setTransactions] = useState<EarningsTransaction[]>(
    initialEarningsTransactions,
  );
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const totalEarnings = 7970;
  const completedEvaluations = 112;
  const averageFee = 72.5;

  const handlePayoutSubmit = (amount: number, method: string) => {
    // console.log("handling payout request in state", amount, method);
    setAvailableBalance((prev) => Math.max(0, prev - amount));

    const newTx: EarningsTransaction = {
      id: `tx_payout_${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      candidateName: "—",
      challengeTitle: `Earnings Withdrawal Request (${method})`,
      type: "PAYOUT_WITHDRAWAL",
      amount: -amount,
      status: "PROCESSING",
      payoutMethod: method,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* top metric stats cards */}
      <EarningsStatsCards
        availableBalance={availableBalance}
        totalEarnings={totalEarnings}
        completedEvaluations={completedEvaluations}
        averageFee={averageFee}
        onRequestPayout={() => setIsPayoutModalOpen(true)}
      />

      {/* interactive recharts visual analytics */}
      <EarningsAnalyticsCharts />

      {/* itemized transaction history table */}
      <EarningsLedgerTable transactions={transactions} />

      {/* payout withdrawal request modal */}
      <PayoutRequestModal
        isOpen={isPayoutModalOpen}
        availableBalance={availableBalance}
        onClose={() => setIsPayoutModalOpen(false)}
        onSubmitPayout={handlePayoutSubmit}
      />
    </div>
  );
}
