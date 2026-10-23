"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EarningsStatsCardsProps {
  availableBalance: number;
  totalEarnings: number;
  completedEvaluations: number;
  averageFee: number;
  onRequestPayout: () => void;
}

export function EarningsStatsCards({
  availableBalance,
  totalEarnings,
  completedEvaluations,
  averageFee,
  onRequestPayout,
}: EarningsStatsCardsProps) {
  // console.log("earnings stats cards component rendered");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* available balance for payout */}
      <Card className="border-primary/40 bg-primary/5 relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-primary uppercase tracking-wider">
            available for withdrawal
          </CardTitle>
          <div className="size-8 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center text-primary">
            <Wallet className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
              $
              {availableBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              cleared funds ready for instant transfer
            </p>
          </div>
          <Button
            size="sm"
            onClick={onRequestPayout}
            disabled={availableBalance <= 0}
            className="w-full h-8 text-xs font-semibold gap-1.5"
          >
            <ArrowUpRight className="size-3.5" />
            <span>withdraw earnings</span>
          </Button>
        </CardContent>
      </Card>

      {/* total gross earnings */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            total net earnings
          </CardTitle>
          <div className="size-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <DollarSign className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
              $
              {totalEarnings.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1.5 text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
            >
              +20.8% this month
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            cumulative reviewer compensation across all tests
          </p>
        </CardContent>
      </Card>

      {/* completed evaluations */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            completed reviews
          </CardTitle>
          <div className="size-8 rounded-lg border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-blue-500">
            <CheckCircle2 className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {completedEvaluations}
            </div>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5">
              100% verified
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            median turnaround time: 3.2 hours
          </p>
        </CardContent>
      </Card>

      {/* average fee per review */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            avg fee per assessment
          </CardTitle>
          <div className="size-8 rounded-lg border border-purple-500/20 bg-purple-500/10 flex items-center justify-center text-purple-500">
            <TrendingUp className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
              ${averageFee.toFixed(2)}
            </div>
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1.5 text-purple-500 border-purple-500/30 font-mono"
            >
              tier 1 reviewer
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            includes base review fee + quality bonus rewards
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
