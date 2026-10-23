"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// monthly candidate and recruiter growth trajectory
const USER_GROWTH_DATA = [
  { month: "May", candidates: 3200, recruiters: 780, total: 3980 },
  { month: "Jun", candidates: 4600, recruiters: 1150, total: 5750 },
  { month: "Jul", candidates: 6100, recruiters: 1620, total: 7720 },
  { month: "Aug", candidates: 8300, recruiters: 2180, total: 10480 },
  { month: "Sep", candidates: 10100, recruiters: 2840, total: 12940 },
  { month: "Oct", candidates: 11400, recruiters: 3420, total: 14820 },
];

export function UserGrowthChart() {
  // console.log("rendering user growth chart module");

  const [mounted, setMounted] = useState(false);
  const [activeRange, setActiveRange] = useState<"6m" | "ytd">("6m");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            user registration trends
          </CardTitle>
          <CardDescription className="text-xs">
            monthly breakdown of candidates and recruiters.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center text-xs text-muted-foreground">
          loading analytics chart...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-0.5">
            <Users className="size-3.5" />
            <span>acquisition trends</span>
          </div>
          <CardTitle className="text-base font-semibold text-foreground">
            candidate vs recruiter growth
          </CardTitle>
          <CardDescription className="text-xs">
            cumulative platform user registrations over the last 6 months.
          </CardDescription>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border border-border/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveRange("6m")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeRange === "6m"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            last 6 months
          </button>
          <button
            type="button"
            onClick={() => setActiveRange("ytd")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeRange === "ytd"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            year to date
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={USER_GROWTH_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {/* gradient for candidates */}
                <linearGradient id="candidateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>

                {/* gradient for recruiters */}
                <linearGradient id="recruiterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="stroke-border/40"
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor", fontSize: 11 }}
                className="fill-muted-foreground"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor", fontSize: 11 }}
                className="fill-muted-foreground"
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(18, 24, 38, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                formatter={(val: unknown, name: unknown) => [
                  `${Number(val).toLocaleString()} users`,
                  name === "candidates" ? "Candidates" : "Recruiters",
                ]}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
              />

              <Area
                type="monotone"
                dataKey="candidates"
                name="Candidates"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#candidateGrad)"
              />

              <Area
                type="monotone"
                dataKey="recruiters"
                name="Recruiters"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#recruiterGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
