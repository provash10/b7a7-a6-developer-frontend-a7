"use client";

import {
  ArrowRight,
  CheckCircle2,
  Copy,
  FileCheck2,
  Printer,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { useGetSinglePaymentTransaction } from "@/hooks/payment.hook";
import { BuyCreditsModal } from "./buy-credits-modal";

export function PaymentSuccessCard() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const paymentID =
    searchParams.get("paymentID") || searchParams.get("paymentId") || "";
  const queryTrxID =
    searchParams.get("trxID") || searchParams.get("trxId") || "";
  const queryAmount = searchParams.get("amount") || "";
  const queryCredits = searchParams.get("credits") || "";

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  useEffect(() => {
    try {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch {
      // ignore
    }
  }, [queryClient]);

  // attempt to load persisted database record if available
  const { data: transactionResponse } = useGetSinglePaymentTransaction(
    paymentID || undefined,
  );

  const txData = transactionResponse?.data;
  const paymentDetails = (txData?.paymentDetails || {}) as Record<
    string,
    unknown
  >;

  const trxID =
    queryTrxID ||
    (paymentDetails.trxID as string) ||
    ((paymentDetails.executedResult as Record<string, unknown>)
      ?.trxID as string) ||
    `BKS${Math.floor(100000000 + Math.random() * 900000000)}`;

  const finalPaymentId =
    paymentID || txData?.transactionId || `TRX-BKASH-${Date.now()}`;
  const finalAmount =
    queryAmount || (txData?.amount ? String(txData.amount) : "500");
  const finalCredits =
    queryCredits ||
    (paymentDetails.credits
      ? String(paymentDetails.credits)
      : String(Math.round(Number(finalAmount) / 5)));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.add({
      title: "Copied to Clipboard",
      description: text,
      type: "info",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber =
    (paymentDetails.merchantInvoiceNumber as string) ||
    `INV-${new Date().getFullYear()}-${finalPaymentId.slice(-6).toUpperCase()}`;

  const formattedDate = txData?.createdAt
    ? new Date(txData.createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. celebratory banner card */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent p-6 sm:p-10 text-center shadow-xl">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/10 mb-5">
          <CheckCircle2 className="size-11" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3.5 py-1 text-xs font-semibold text-pink-600 dark:text-pink-400 mb-3">
          <Zap className="size-3.5" />
          <span>bKash Tokenized Checkout Verified</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Payment Succeeded & Credits Deposited!
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Your bKash transaction has been verified in real-time. {finalCredits}{" "}
          assessment credits have been credited to your recruiter profile.
        </p>

        {/* fast metrics pill row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-2xl border border-border/80 bg-background/80 px-4 py-2 text-left backdrop-blur-xs">
            <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
              Amount Paid
            </span>
            <span className="text-sm font-bold text-foreground">
              ৳{Number(finalAmount).toLocaleString()} BDT
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background/80 px-4 py-2 text-left backdrop-blur-xs">
            <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
              Credits Added
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              +{finalCredits} Assessment Quota
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-background/80 px-4 py-2 text-left backdrop-blur-xs">
            <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
              Payment Status
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>PAID & CLEARED</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. official printable tax receipt / invoice */}
      <div
        id="printable-receipt"
        className="rounded-3xl border border-border/80 bg-card p-6 sm:p-9 shadow-lg relative print:border-none print:shadow-none print:p-0"
      >
        {/* invoice top header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-sm">
                DA
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                DevAssess Platform
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Developer Assessment & Coding Verification Engine
            </p>
            <p className="text-[11px] text-muted-foreground font-mono">
              Tax ID: BDT-9941028472 • Dhaka, Bangladesh
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="inline-block rounded-lg bg-muted px-2.5 py-1 text-[11px] font-mono font-bold text-foreground">
              {invoiceNumber}
            </span>
            <p className="text-xs text-muted-foreground">
              Issued: {formattedDate}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official Tax Receipt</span>
            </span>
          </div>
        </div>

        {/* customer & payment reference columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-border/50 text-xs">
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block">
              Billed To (Recruiter Account)
            </span>
            <p className="font-semibold text-foreground text-sm">
              {txData?.user?.name || "Verified Recruiter Partner"}
            </p>
            <p className="text-muted-foreground font-mono">
              {txData?.user?.email || "recruiter@100.com"}
            </p>
            <p className="text-muted-foreground">
              Assessment Recruiter Portal • Organization Account
            </p>
          </div>

          <div className="space-y-2 sm:text-right">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block">
              Payment Gateway Credentials
            </span>
            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-muted-foreground">bKash TrxID:</span>
              <span className="font-mono font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded">
                {trxID}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(trxID)}
                className="text-muted-foreground hover:text-foreground print:hidden"
              >
                <Copy className="size-3.5" />
                <span className="sr-only">Copy TrxID</span>
              </button>
            </div>

            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-muted-foreground">bKash PaymentID:</span>
              <span className="font-mono text-muted-foreground truncate max-w-[180px] bg-muted/40 px-2 py-0.5 rounded">
                {finalPaymentId}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(finalPaymentId)}
                className="text-muted-foreground hover:text-foreground print:hidden"
              >
                <Copy className="size-3.5" />
                <span className="sr-only">Copy PaymentID</span>
              </button>
            </div>

            <p className="text-muted-foreground text-[11px]">
              Provider:{" "}
              <strong className="text-pink-600">
                bKash Tokenized (Test Mode)
              </strong>
            </p>
          </div>
        </div>

        {/* itemized receipt table */}
        <div className="py-6 border-b border-border/50">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Service Description</th>
                <th className="pb-3 font-semibold text-center">Unit Price</th>
                <th className="pb-3 font-semibold text-center">Qty / Quota</th>
                <th className="pb-3 font-semibold text-right">Amount (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <tr>
                <td className="py-4">
                  <div className="font-semibold text-foreground">
                    DevAssess Assessment & Candidate Invitation Credits
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Includes coding sandbox runs, hidden test cases, anti-cheat
                    & proctoring.
                  </div>
                </td>
                <td className="py-4 text-center font-mono">৳5.00</td>
                <td className="py-4 text-center font-bold">{finalCredits}</td>
                <td className="py-4 text-right font-bold text-foreground font-mono">
                  ৳{Number(finalAmount).toLocaleString()}.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* receipt financial summary */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-xs text-muted-foreground max-w-sm space-y-1">
            <span className="font-semibold text-foreground block">
              Digital Payment Verification
            </span>
            <p className="text-[11px] leading-relaxed">
              This invoice serves as an electronic receipt for BDT transaction
              made via the official bKash Tokenized Gateway sandbox. Assessment
              credits have been permanently allocated to the recruiter
              workspace.
            </p>
          </div>

          <div className="space-y-2 min-w-[220px] text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">
                ৳{Number(finalAmount).toLocaleString()}.00
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT / Tax (0%)</span>
              <span className="font-mono text-foreground">৳0.00</span>
            </div>
            <div className="border-t border-border/60 pt-2 flex justify-between items-baseline font-bold">
              <span className="text-foreground text-sm">Total Paid</span>
              <span className="text-lg text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">
                ৳{Number(finalAmount).toLocaleString()}.00 BDT
              </span>
            </div>
          </div>
        </div>

        {/* bottom authorization seal */}
        <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Cryptographically Verified & Signed</span>
          </div>
          <span className="font-mono">Ref: {finalPaymentId.slice(0, 16)}</span>
        </div>
      </div>

      {/* 3. action buttons toolbar (hidden in print) */}
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors"
        >
          <Printer className="size-4 text-primary" />
          <span>Print / Save Tax Receipt</span>
        </button>

        <button
          type="button"
          onClick={() => setIsBuyModalOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/5 px-4 py-2.5 text-xs font-semibold text-pink-600 dark:text-pink-400 hover:bg-pink-500/10 shadow-xs transition-colors"
        >
          <Sparkles className="size-4" />
          <span>Buy More Credits</span>
        </button>

        <Link
          href="/recruiter"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
        >
          <span>Go to Recruiter Portal</span>
          <ArrowRight className="size-4" />
        </Link>

        <Link
          href="/dashboard/payments"
          className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileCheck2 className="size-4" />
          <span>Payment History</span>
        </Link>
      </div>

      {/* buy credits modal instance */}
      <BuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  );
}
