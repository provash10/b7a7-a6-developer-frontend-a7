"use client";

import { PieChart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categoryDistributions, monthlyEarningsHistory } from "./mock-data";

export function EarningsAnalyticsCharts() {
  // console.log("earnings analytics charts component rendered");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCategoryEarnings = categoryDistributions.reduce(
    (acc, curr) => acc + curr.earnings,
    0,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* monthly earnings trajectory chart */}
      <Card className="lg:col-span-2 border-border/60 bg-card/60 backdrop-blur-xs">
        <CardHeader className="pb-2 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-500" />
                <span>monthly earnings trajectory</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  6-month growth
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                monthly compensation ($) earned from candidate code review
                evaluations.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>earnings ($)</span>
              </span>
              <span className="flex items-center gap-1.5 ml-2">
                <span className="size-2 rounded-full bg-primary" />
                <span>evaluations</span>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyEarningsHistory}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="earningsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 255, 255, 0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="rgba(255, 255, 255, 0.4)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.4)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(18, 24, 38, 0.95)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                    formatter={(val, name) => [
                      name === "earnings" ? `$${val}` : `${val} reviews`,
                      String(name),
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    name="earnings"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#earningsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                loading earnings trajectory chart...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* category breakdown progress cards */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs flex flex-col justify-between">
        <CardHeader className="pb-2 border-b border-border/40">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <PieChart className="size-4 text-primary" />
            <span>earnings by tech stack</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            distribution across challenge architectural domains.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-3.5">
          {categoryDistributions.map((cat) => {
            const percentage = Math.round(
              (cat.earnings / totalCategoryEarnings) * 100,
            );
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground truncate max-w-[180px]">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-foreground font-semibold">
                      ${cat.earnings}
                    </span>
                    <span className="text-muted-foreground">
                      ({percentage}%)
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
