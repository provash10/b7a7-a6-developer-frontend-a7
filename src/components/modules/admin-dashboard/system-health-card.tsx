"use client";

import { Cpu, Database, Layers, Server, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SystemHealthCard() {
  // console.log("rendering platform system health card");

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Cpu className="size-4" />
            <span>infrastructure telemetry</span>
          </div>
          <Badge variant="success" className="text-[10px] gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            all clusters operational
          </Badge>
        </div>
        <CardTitle className="text-base font-semibold">
          code execution & system health
        </CardTitle>
        <CardDescription className="text-xs">
          real-time status of micro-isolated judge sandboxes, db pools, and
          anti-cheat agents.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* judge sandbox */}
        <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Server className="size-3.5 text-primary" />
              judge sandboxes
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              16/16 online
            </span>
          </div>
          <p className="font-semibold text-foreground">
            24ms execution latency
          </p>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 w-[96%]" />
          </div>
        </div>

        {/* database pool */}
        <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Database className="size-3.5 text-blue-500" />
              postgresql cluster
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              healthy
            </span>
          </div>
          <p className="font-semibold text-foreground">4ms avg query speed</p>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-blue-500 w-[98%]" />
          </div>
        </div>

        {/* anti-cheat vision */}
        <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              anti-cheat vision
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              active
            </span>
          </div>
          <p className="font-semibold text-foreground">
            0.02% false positive rate
          </p>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 w-[99%]" />
          </div>
        </div>

        {/* evaluation queue */}
        <div className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Layers className="size-3.5 text-amber-500" />
              job queue
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              0 backlog
            </span>
          </div>
          <p className="font-semibold text-foreground">100% throughput</p>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-amber-500 w-[100%]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
