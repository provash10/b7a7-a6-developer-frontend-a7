"use client";

import { FileCode, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ManageAssessmentsTable } from "./manage-assessments-table";
import { ManageUsersTable } from "./manage-users-table";

export function AdminManageView() {
  // console.log("admin manage view component rendered");

  const [activeTab, setActiveTab] = useState<"users" | "assessments">("users");

  return (
    <div className="space-y-6">
      {/* tab navigation switcher */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/60 border border-border/60 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "users"
              ? "bg-card text-foreground shadow-xs border border-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Users className="size-4 text-primary" />
          <span>users & permissions</span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1">
            directory
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assessments")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "assessments"
              ? "bg-card text-foreground shadow-xs border border-border/80"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <FileCode className="size-4 text-emerald-500" />
          <span>assessment challenges</span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 ml-1">
            catalog
          </Badge>
        </button>
      </div>

      {/* active tab content */}
      {activeTab === "users" ? (
        <ManageUsersTable />
      ) : (
        <ManageAssessmentsTable />
      )}
    </div>
  );
}
