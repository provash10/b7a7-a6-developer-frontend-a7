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
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-muted/70 border border-border/80 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
            activeTab === "users"
              ? "bg-card text-foreground shadow-sm border border-border font-semibold hover:border-primary/50 hover:shadow"
              : "text-muted-foreground border border-transparent hover:text-primary hover:bg-primary/10 hover:border-primary/20 font-medium hover:shadow-xs"
          }`}
        >
          <Users className="size-4.5 text-primary shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-semibold text-sm">Users & Permissions</span>
          <Badge
            variant="outline"
            className="text-xs font-medium py-0.5 px-2 ml-1 bg-background/80 transition-colors duration-200 group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/5"
          >
            Directory
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assessments")}
          className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
            activeTab === "assessments"
              ? "bg-card text-foreground shadow-sm border border-border font-semibold hover:border-emerald-500/50 hover:shadow"
              : "text-muted-foreground border border-transparent hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 font-medium hover:shadow-xs"
          }`}
        >
          <FileCode className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-semibold text-sm">Assessment Challenges</span>
          <Badge
            variant="outline"
            className="text-xs font-medium py-0.5 px-2 ml-1 bg-background/80 transition-colors duration-200 group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-500/5"
          >
            Catalog
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
