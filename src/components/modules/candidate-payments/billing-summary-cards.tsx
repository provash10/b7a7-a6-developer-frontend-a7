"use client";

import { Award, Receipt, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingSummaryCards() {
  // console.log("billing summary cards component rendered");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* active membership card */}
      <Card className="border-border/80 bg-card shadow-xs relative overflow-hidden">
        <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full bg-primary/10 blur-xl" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            active plan
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Candidate Pro
            </span>
            <Badge variant="success" className="text-[10px]">
              active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            renews nov 19, 2026 • ৳ 1,499/mo
          </p>
        </CardContent>
      </Card>

      {/* total invoiced card */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            total invoiced
          </CardTitle>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Receipt className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <span className="text-xl font-bold tracking-tight text-foreground">
            ৳ 2,497 BDT
          </span>
          <p className="text-xs text-muted-foreground">
            3 paid invoices • 0 pending
          </p>
        </CardContent>
      </Card>

      {/* certified badges card */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            certified credentials
          </CardTitle>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <Award className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">
              3 Badges
            </span>
            <Badge variant="amber" className="text-[10px]">
              verified
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            available for svg & pdf download
          </p>
        </CardContent>
      </Card>

      {/* candidate benchmark percentile */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            skill benchmark
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <TrendingUp className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Top 8%
          </span>
          <p className="text-xs text-muted-foreground">
            average test score: 91.3%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
