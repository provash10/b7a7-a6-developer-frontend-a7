"use client";

import { Clock, Download, Settings } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AuditLogsTable } from "./audit-logs-table";
import { ExportReportsCard } from "./export-reports-card";
import { SystemSettingsCard } from "./system-settings-card";

export function AdminReportsView() {
  // console.log("admin reports view component rendered");

  const [activeTab, setActiveTab] = useState<"logs" | "exports" | "settings">(
    "logs",
  );

  return (
    <div className="space-y-6">
      {/* tab navigation switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-muted/60 border border-border/60 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "logs"
              ? "bg-card text-foreground shadow-xs border border-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Clock className="size-4 text-primary" />
          <span>audit trail & events</span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1">
            live
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("exports")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "exports"
              ? "bg-card text-foreground shadow-xs border border-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Download className="size-4 text-emerald-500" />
          <span>report downloads</span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1">
            exports
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "settings"
              ? "bg-card text-foreground shadow-xs border border-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Settings className="size-4 text-purple-500" />
          <span>system configuration</span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1">
            security
          </Badge>
        </button>
      </div>

      {/* tab content panel */}
      {activeTab === "logs" && <AuditLogsTable />}
      {activeTab === "exports" && <ExportReportsCard />}
      {activeTab === "settings" && <SystemSettingsCard />}
    </div>
  );
}
