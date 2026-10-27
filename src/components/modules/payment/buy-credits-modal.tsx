"use client";

import { ArrowRight, Loader2, Plus, ShieldCheck, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useInitiatePayment } from "@/hooks/payment.hook";
import type { ApiResponse, InitiatePaymentResponse } from "@/types";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CREDIT_TIERS = [
  {
    credits: 50,
    price: 250,
    tag: "Starter",
    description: "Ideal for 5-10 developer screenings",
    popular: false,
  },
  {
    credits: 100,
    price: 500,
    tag: "Popular",
    description: "Most common package for active hiring",
    popular: true,
  },
  {
    credits: 250,
    price: 1250,
    tag: "Growth",
    description: "Full recruiting drive with bulk invites",
    popular: false,
  },
  {
    credits: 500,
    price: 2500,
    tag: "Bulk Saver",
    description: "Campus drive & continuous hiring",
    popular: false,
  },
];

export function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const [selectedCredits, setSelectedCredits] = useState<number>(100);
  const [customCredits, setCustomCredits] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const initiatePaymentMutation = useInitiatePayment();

  if (!isOpen) return null;

  const currentCredits = isCustom
    ? Math.max(10, Number.parseInt(customCredits || "0", 10))
    : selectedCredits;
  const currentAmount = currentCredits * 5; // ৳5 BDT per credit

  const handlePayWithBkash = () => {
    if (currentCredits < 10) {
      toast.add({
        title: "Minimum Purchase Required",
        description: "Minimum assessment credit purchase is 10 credits (৳50).",
        type: "error",
      });
      return;
    }

    initiatePaymentMutation.mutate(
      { credits: currentCredits },
      {
        onSuccess: (data: unknown) => {
          const response = data as ApiResponse<InitiatePaymentResponse>;
          const paymentUrl = response?.data?.paymentUrl;
          if (paymentUrl) {
            toast.add({
              title: "Redirecting to bKash Gateway...",
              description: "Opening secure bKash Tokenized Checkout.",
              type: "info",
            });
            window.location.href = paymentUrl;
          } else {
            toast.add({
              title: "Checkout Error",
              description:
                "Could not retrieve bKash payment gateway URL from server.",
              type: "error",
            });
          }
        },
        onError: (err: unknown) => {
          const errorObj = err as {
            data?: { message?: string };
            message?: string;
          };
          const errMsg =
            errorObj?.data?.message ||
            errorObj?.message ||
            "Please ensure you are logged in as a recruiter.";
          toast.add({
            title: "Payment Initiation Failed",
            description: errMsg,
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        {/* close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={initiatePaymentMutation.isPending}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* header */}
        <div className="space-y-1.5 pb-4 border-b border-border/50">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-600 dark:text-pink-400">
            <Zap className="size-3.5" />
            <span>Instant bKash Tokenized Checkout</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Purchase Assessment Credits
          </h2>
          <p className="text-xs text-muted-foreground">
            Credits allow recruiters to create new developer assessments,
            dispatch candidate challenge invitations, and access live
            proctoring.
          </p>
        </div>

        {/* tiers grid */}
        <div className="mt-5 space-y-4">
          <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Select Credit Package
          </span>

          <div className="grid grid-cols-2 gap-3">
            {CREDIT_TIERS.map((tier) => {
              const isSelected = !isCustom && selectedCredits === tier.credits;
              return (
                <button
                  type="button"
                  key={tier.credits}
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedCredits(tier.credits);
                  }}
                  className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-pink-500 bg-pink-500/5 ring-2 ring-pink-500/30"
                      : "border-border/80 bg-background hover:border-pink-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">
                      {tier.credits} Credits
                    </span>
                    {tier.popular && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-black text-foreground">
                      ৳{tier.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      BDT
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
                    {tier.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* custom credits option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                isCustom
                  ? "border-pink-500 bg-pink-500/5 ring-2 ring-pink-500/30"
                  : "border-border/70 bg-background hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="size-4 text-pink-600" />
                <span className="font-semibold text-foreground">
                  Custom Credit Amount
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                ৳5.00 BDT per credit
              </span>
            </button>

            {isCustom && (
              <div className="mt-3 flex items-center gap-3 animate-in fade-in duration-200">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="10"
                    step="10"
                    placeholder="Enter credits (min 10)"
                    value={customCredits}
                    onChange={(e) => setCustomCredits(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium">
                    Credits
                  </span>
                </div>
                <div className="rounded-xl border border-border/80 bg-muted/40 px-4 py-2.5 text-xs font-semibold text-foreground">
                  = ৳{currentAmount.toLocaleString()} BDT
                </div>
              </div>
            )}
          </div>

          {/* order summary bar */}
          <div className="mt-4 rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Unit Rate</span>
              <span className="font-mono text-foreground">
                ৳5.00 BDT / Credit
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Selected Balance</span>
              <span className="font-semibold text-foreground">
                +{currentCredits} Assessment Credits
              </span>
            </div>
            <div className="border-t border-border/50 pt-2 flex justify-between items-baseline">
              <span className="font-semibold text-foreground text-sm">
                Total Payable
              </span>
              <span className="text-xl font-extrabold text-foreground tracking-tight">
                ৳{currentAmount.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  BDT
                </span>
              </span>
            </div>
          </div>

          {/* bKash test credentials helper notice */}
          <div className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-3.5 text-xs text-foreground space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-pink-600 dark:text-pink-400">
              <ShieldCheck className="size-4 shrink-0" />
              <span>Real bKash Sandbox Test Mode Info</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Evaluators can checkout without real funds using sandbox credentials (do not use real personal numbers):
            </p>
            <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
              <div className="bg-background/80 rounded-lg p-1.5 border border-pink-500/20">
                <span className="block text-[9px] text-muted-foreground">
                  Wallet No
                </span>
                <span className="font-bold">01770618575</span>
              </div>
              <div className="bg-background/80 rounded-lg p-1.5 border border-pink-500/20">
                <span className="block text-[9px] text-muted-foreground">
                  Test OTP
                </span>
                <span className="font-bold">123456</span>
              </div>
              <div className="bg-background/80 rounded-lg p-1.5 border border-pink-500/20">
                <span className="block text-[9px] text-muted-foreground">
                  Test PIN
                </span>
                <span className="font-bold">12345</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground/80 italic">
              Note: If bKash says &ldquo;wallet is locked&rdquo;, try alternative test numbers: <span className="font-mono font-semibold">01770618576</span> or <span className="font-mono font-semibold">01877722345</span>.
            </p>
          </div>
        </div>

        {/* modal action footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border/50">
          <button
            type="button"
            onClick={onClose}
            disabled={initiatePaymentMutation.isPending}
            className="w-full sm:w-auto rounded-xl border border-border/80 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePayWithBkash}
            disabled={initiatePaymentMutation.isPending}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2.5 text-xs shadow-md shadow-pink-600/20 transition-all disabled:opacity-50"
          >
            {initiatePaymentMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Initiating Gateway...</span>
              </>
            ) : (
              <>
                <span>Pay ৳{currentAmount.toLocaleString()} with bKash</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
