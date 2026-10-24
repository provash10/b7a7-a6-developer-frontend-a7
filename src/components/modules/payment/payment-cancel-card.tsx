"use client";

import {
  AlertTriangle,
  Headphones,
  RefreshCcw,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BuyCreditsModal } from "./buy-credits-modal";

export function PaymentCancelCard() {
  const searchParams = useSearchParams();

  const paymentID =
    searchParams.get("paymentID") || searchParams.get("paymentId") || "";
  const status = searchParams.get("status") || "cancelled";
  const customMessage = searchParams.get("message") || "";

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const isFailed =
    status.toLowerCase() === "failed" || status.toLowerCase() === "failure";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* 1. warning / cancellation banner */}
      <div className="relative overflow-hidden rounded-3xl border border-destructive/30 bg-gradient-to-b from-destructive/10 via-destructive/5 to-transparent p-6 sm:p-10 text-center shadow-xl">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-destructive/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-destructive/20 text-destructive ring-8 ring-destructive/10 mb-5">
          {isFailed ? (
            <XCircle className="size-11" />
          ) : (
            <AlertTriangle className="size-11" />
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-3.5 py-1 text-xs font-semibold text-destructive mb-3">
          <ShieldAlert className="size-3.5" />
          <span>
            {isFailed ? "bKash Payment Failed" : "bKash Payment Cancelled"}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {isFailed
            ? "bKash Payment Processing Failed"
            : "Checkout Was Cancelled by User"}
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {customMessage ||
            (isFailed
              ? "We could not execute the bKash transaction. This could be due to invalid sandbox credentials, a network timeout, or payment rejection."
              : "You closed or cancelled the bKash transaction before verification. No money was deducted from your wallet balance.")}
        </p>

        {paymentID && (
          <div className="mt-5 inline-block rounded-xl border border-border/80 bg-background/80 px-4 py-2 font-mono text-xs text-muted-foreground">
            Reference ID:{" "}
            <span className="font-bold text-foreground">{paymentID}</span>
          </div>
        )}
      </div>

      {/* 2. troubleshooting & next steps card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-lg space-y-5">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span>Troubleshooting & Guidance</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1.5">
            <span className="font-semibold text-foreground block">
              1. Using Sandbox Test Credentials
            </span>
            <p className="text-muted-foreground leading-relaxed">
              When prompted in the bKash checkout popup, use test wallet{" "}
              <strong className="font-mono text-foreground">01770618575</strong>
              , OTP{" "}
              <strong className="font-mono text-foreground">123456</strong>, and
              PIN <strong className="font-mono text-foreground">12345</strong>.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-1.5">
            <span className="font-semibold text-foreground block">
              2. Need Help or Want to Retry?
            </span>
            <p className="text-muted-foreground leading-relaxed">
              You can restart the checkout at any time. Alternatively, check out
              custom enterprise options on our pricing plans.
            </p>
          </div>
        </div>

        {/* action buttons */}
        <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/pricing"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-border/80 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>View Pricing & FAQ</span>
          </Link>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-border/80 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Headphones className="size-3.5 text-primary" />
              <span>Contact Support</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsBuyModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2.5 text-xs shadow-md shadow-pink-600/20 transition-all cursor-pointer"
            >
              <RefreshCcw className="size-3.5" />
              <span>Try Payment Again</span>
            </button>
          </div>
        </div>
      </div>

      {/* buy credits modal instance */}
      <BuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  );
}
