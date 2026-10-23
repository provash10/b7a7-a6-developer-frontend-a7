"use client";

import { ArrowUpRight, DollarSign, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

interface PayoutRequestModalProps {
  isOpen: boolean;
  availableBalance: number;
  onClose: () => void;
  onSubmitPayout: (amount: number, method: string) => void;
}

export function PayoutRequestModal({
  isOpen,
  availableBalance,
  onClose,
  onSubmitPayout,
}: PayoutRequestModalProps) {
  // console.log("payout request modal component rendered");

  const [amount, setAmount] = useState<string>(
    availableBalance > 0 ? String(availableBalance) : "0",
  );
  const [method, setMethod] = useState<string>("Stripe Connect");
  const [destinationAccount, setDestinationAccount] = useState<string>(
    "acct_stripe_us_918274",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  const isInvalid = numericAmount <= 0 || numericAmount > availableBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return;

    // console.log("submitting payout request", numericamount, method);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitPayout(numericAmount, method);
      toast.add({
        title: "Payout Request Dispatched",
        description: `$${numericAmount.toFixed(2)} transfer initiated via ${method}.`,
        type: "success",
      });
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl p-6 space-y-5">
        {/* modal header */}
        <div className="flex items-start justify-between border-b border-border/50 pb-3">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <ArrowUpRight className="size-4 text-primary" />
              <span>request earnings withdrawal</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              transfer your cleared evaluation compensation to your preferred
              payout account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* available balance banner */}
        <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">
              available cleared balance
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              $
              {availableBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] border-emerald-500/30 text-emerald-500 font-mono"
          >
            ready to transfer
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* withdrawal amount */}
          <div className="space-y-1.5">
            <label
              htmlFor="payout-amount"
              className="text-xs font-medium text-foreground block"
            >
              withdrawal amount ($ usd)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="payout-amount"
                type="number"
                step="0.01"
                min="10"
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-xs font-mono font-semibold h-9"
              />
            </div>

            {/* quick percentage triggers */}
            <div className="flex items-center gap-1.5 pt-1">
              {[0.25, 0.5, 0.75, 1].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setAmount((availableBalance * pct).toFixed(2))}
                  className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/80 bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>
            {numericAmount > availableBalance && (
              <span className="text-[11px] text-rose-500 block pt-0.5">
                amount cannot exceed available balance of $
                {availableBalance.toFixed(2)}.
              </span>
            )}
          </div>

          {/* payout method */}
          <div className="space-y-1.5">
            <label
              htmlFor="payout-method"
              className="text-xs font-medium text-foreground block"
            >
              destination payout rail
            </label>
            <select
              id="payout-method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full h-9 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Stripe Connect">
                Stripe Express Direct (1-2 business days)
              </option>
              <option value="Bank Wire Transfer">
                Bank ACH Wire Transfer (2-3 business days)
              </option>
              <option value="PayPal Business">
                PayPal Instant Commercial Transfer
              </option>
            </select>
          </div>

          {/* destination identifier */}
          <div className="space-y-1.5">
            <label
              htmlFor="destination-account"
              className="text-xs font-medium text-foreground block"
            >
              destination account / email identifier
            </label>
            <Input
              id="destination-account"
              type="text"
              value={destinationAccount}
              onChange={(e) => setDestinationAccount(e.target.value)}
              className="text-xs font-mono h-9"
              required
            />
            <span className="text-[10px] text-muted-foreground block">
              payout confirmation will be dispatched to your registered email.
            </span>
          </div>

          {/* actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs"
            >
              cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isInvalid || isSubmitting}
              className="h-8 text-xs font-semibold gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>processing...</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="size-3.5" />
                  <span>confirm withdrawal</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
