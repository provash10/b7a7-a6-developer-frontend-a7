"use client";

import { FileCode2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
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

// assessment lifecycle breakdown by domain
const ASSESSMENT_STATUS_DATA = [
  {
    domain: "Full Stack",
    completed: 1420,
    inProgress: 180,
    draft: 95,
    flagged: 12,
  },
  {
    domain: "Frontend",
    completed: 1180,
    inProgress: 140,
    draft: 70,
    flagged: 6,
  },
  {
    domain: "Algorithms",
    completed: 960,
    inProgress: 110,
    draft: 50,
    flagged: 8,
  },
  {
    domain: "Backend & DB",
    completed: 740,
    inProgress: 90,
    draft: 40,
    flagged: 4,
  },
  {
    domain: "DevOps & Cloud",
    completed: 390,
    inProgress: 45,
    draft: 25,
    flagged: 1,
  },
];

export function AssessmentStatusChart() {
  // console.log("rendering assessment status chart module");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            assessment volume & statuses
          </CardTitle>
          <CardDescription className="text-xs">
            lifecycle distribution across technical domains.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center text-xs text-muted-foreground">
          loading assessment chart...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-0.5">
            <FileCode2 className="size-3.5" />
            <span>evaluation throughput</span>
          </div>
          <CardTitle className="text-base font-semibold text-foreground">
            assessment status by domain
          </CardTitle>
          <CardDescription className="text-xs">
            completed tests, active runs, drafts, and anti-cheat flagged
            sessions.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ASSESSMENT_STATUS_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="stroke-border/40"
              />

              <XAxis
                dataKey="domain"
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
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(18, 24, 38, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                formatter={(val: unknown) => [
                  `${Number(val).toLocaleString()} tests`,
                ]}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
              />

              <Bar
                dataKey="completed"
                name="Completed"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="inProgress"
                name="In Progress"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="draft"
                name="Draft"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="flagged"
                name="Flagged"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
