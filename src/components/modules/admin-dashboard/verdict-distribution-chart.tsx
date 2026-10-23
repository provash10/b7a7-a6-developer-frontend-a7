"use client";

import { Award } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VERDICT_DATA = [
  { name: "Passed (>= 70%)", value: 74.8, count: 3508, color: "#10b981" },
  { name: "Borderline (50-69%)", value: 14.2, count: 666, color: "#f59e0b" },
  { name: "Failed (< 50%)", value: 9.8, count: 460, color: "#ef4444" },
  { name: "Manual Review", value: 1.2, count: 56, color: "#8b5cf6" },
];

export function VerdictDistributionChart() {
  // console.log("rendering verdict distribution chart module");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            verdict breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            candidate pass rate and score distribution.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center text-xs text-muted-foreground">
          loading verdict chart...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-0.5">
          <Award className="size-3.5" />
          <span>evaluation outcomes</span>
        </div>
        <CardTitle className="text-base font-semibold text-foreground">
          verdict & pass rate distribution
        </CardTitle>
        <CardDescription className="text-xs">
          aggregated candidate performance across 4,690 completed assessments.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-72 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(18, 24, 38, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                formatter={(
                  val: unknown,
                  name: unknown,
                  item: { payload?: { count?: number } },
                ) => [
                  `${val}% (${item.payload?.count?.toLocaleString() ?? 0} submissions)`,
                  String(name),
                ]}
              />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
              />

              <Pie
                data={VERDICT_DATA}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                stroke="none"
              >
                {VERDICT_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* centered donut callout */}
          <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">
              74.8%
            </span>
            <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
              pass rate
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
