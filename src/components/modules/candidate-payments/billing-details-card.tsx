"use client";

import {
  CreditCard,
  FileCheck2,
  Mail,
  Plus,
  ShieldCheck,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { BuyCreditsModal } from "@/components/modules/payment";
import { useState } from "react";

export function BillingDetailsCard() {
  // console.log("rendering billing details card component");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const handleAddPaymentMethod = () => {
    setIsBuyModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. payment methods on file */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <CreditCard className="size-4" />
              <span>payment channels</span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleAddPaymentMethod}
              className="gap-1 text-xs"
            >
              <Plus className="size-3" />
              <span>add method</span>
            </Button>
          </div>
          <CardTitle className="text-base font-semibold">
            saved payment methods
          </CardTitle>
          <CardDescription className="text-xs">
            primary payment method used for monthly subscriptions and certified
            badges.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-xs">
          {/* primary bkash method */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-600 font-bold text-sm">
                ৳
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">
                    bKash Personal / Merchant
                  </span>
                  <Badge variant="success" className="text-[10px]">
                    primary
                  </Badge>
                </div>
                <p className="text-muted-foreground font-mono text-[11px]">
                  wallet: +880 17••••5678
                </p>
              </div>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
              verified
            </span>
          </div>

          {/* backup stripe card method */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <CreditCard className="size-4" />
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  Visa Debit / Credit
                </span>
                <p className="text-muted-foreground font-mono text-[11px]">
                  ending in •••• 4242 (exp 11/28)
                </p>
              </div>
            </div>
            <span className="text-muted-foreground text-[11px]">backup</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. invoice & tax receipt recipient */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <FileCheck2 className="size-4" />
            <span>invoice metadata</span>
          </div>
          <CardTitle className="text-base font-semibold">
            billing details & tax receipt
          </CardTitle>
          <CardDescription className="text-xs">
            these candidate credentials appear on all downloaded pdf tax
            invoices.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-foreground" />
              <span>invoiced candidate</span>
            </span>
            <span className="font-semibold text-foreground">Provash Kumar</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-foreground" />
              <span>billing email</span>
            </span>
            <span className="font-mono text-foreground">
              provash10@gmail.com
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span>country / tax residence</span>
            <span className="text-foreground">Bangladesh (UTC+6)</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>digital signature</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              sha-256 authenticated
            </span>
          </div>
        </CardContent>
      </Card>

      <BuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </div>
  );
}
