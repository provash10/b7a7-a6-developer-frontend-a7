"use client";

import { CheckCircle2, FileCode, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ManageAssessmentsTable } from "./manage-assessments-table";
import { ManageUsersTable } from "./manage-users-table";

export function AdminManageView() {
  const [activeTab, setActiveTab] = useState<"users" | "assessments">("users");

  return (
    <div className="space-y-6">
      {/* Large, prominent tab switcher cards with rich background & hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {/* Tab 1: Users & Permissions */}
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`group relative text-left p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
            activeTab === "users"
              ? "bg-gradient-to-br from-primary/20 via-primary/10 to-card border-primary shadow-xl shadow-primary/15 ring-2 ring-primary/25 scale-[1.01]"
              : "bg-card/80 border-border/80 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/10 hover:to-card hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
          }`}
        >
          {/* ambient background glow */}
          <div
            className={`pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/25 blur-2xl transition-opacity duration-300 ${
              activeTab === "users" ? "opacity-100" : "opacity-0 group-hover:opacity-75"
            }`}
          />

          <div className="relative flex items-start gap-4">
            <div
              className={`size-12 sm:size-14 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                activeTab === "users"
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30 scale-105"
                  : "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110"
              }`}
            >
              <Users className="size-6 sm:size-7" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                  Users & Permissions
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs font-mono px-2.5 py-0.5 uppercase transition-colors ${
                    activeTab === "users"
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                      : "bg-muted text-muted-foreground border-border group-hover:border-primary/40 group-hover:text-primary"
                  }`}
                >
                  Directory
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Manage candidate & recruiter accounts, security roles, permissions, and directory search.
              </p>

              {activeTab === "users" && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary animate-in fade-in">
                  <CheckCircle2 className="size-3.5" />
                  <span>Currently Active View</span>
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Tab 2: Assessment Challenges & Questions */}
        <button
          type="button"
          onClick={() => setActiveTab("assessments")}
          className={`group relative text-left p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
            activeTab === "assessments"
              ? "bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-card border-emerald-500 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/25 scale-[1.01]"
              : "bg-card/80 border-border/80 hover:border-emerald-500/60 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-card hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
          }`}
        >
          {/* ambient background glow */}
          <div
            className={`pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-500/25 blur-2xl transition-opacity duration-300 ${
              activeTab === "assessments" ? "opacity-100" : "opacity-0 group-hover:opacity-75"
            }`}
          />

          <div className="relative flex items-start gap-4">
            <div
              className={`size-12 sm:size-14 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                activeTab === "assessments"
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/30 scale-105"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 group-hover:scale-110"
              }`}
            >
              <FileCode className="size-6 sm:size-7" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-emerald-500 transition-colors">
                  Assessment Challenges
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs font-mono px-2.5 py-0.5 uppercase transition-colors ${
                    activeTab === "assessments"
                      ? "bg-emerald-600 text-white border-emerald-500 font-bold shadow-xs"
                      : "bg-muted text-muted-foreground border-border group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  }`}
                >
                  Catalog
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Create coding challenges, author test cases, assign questions, and manage evaluation pass marks.
              </p>

              {activeTab === "assessments" && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                  <CheckCircle2 className="size-3.5" />
                  <span>Currently Active View</span>
                </div>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === "users" ? (
          <ManageUsersTable />
        ) : (
          <ManageAssessmentsTable />
        )}
      </div>
    </div>
  );
}
