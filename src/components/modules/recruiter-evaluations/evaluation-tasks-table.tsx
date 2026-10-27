"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Filter,
  Mail,
  RotateCcw,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTableUrlState } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { EvaluationReviewModal } from "./evaluation-review-modal";
import type { EvaluationStatus, EvaluationTask } from "./types";

interface EvaluationTasksTableProps {
  tasks: EvaluationTask[];
  onTasksChange: (tasks: EvaluationTask[]) => void;
  onOpenInvite?: () => void;
}

export function EvaluationTasksTable({
  tasks,
  onTasksChange,
  onOpenInvite,
}: EvaluationTasksTableProps) {
  // console.log("evaluation tasks table component rendered");

  const { getParam, getNumberParam, updateUrl } = useTableUrlState();

  const [searchTerm, setSearchTerm] = useState(() =>
    getParam("task_search", ""),
  );
  const [statusFilter, setStatusFilter] = useState<string>(() =>
    getParam("task_status", "ALL"),
  );
  const [antiCheatFilter, setAntiCheatFilter] = useState<string>(() =>
    getParam("task_integrity", "ALL"),
  );
  const [currentPage, setCurrentPage] = useState(() =>
    getNumberParam("task_page", 1),
  );
  const [selectedTask, setSelectedTask] = useState<EvaluationTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageSize = 5;

  useEffect(() => {
    setSearchTerm(getParam("task_search", ""));
    setStatusFilter(getParam("task_status", "ALL"));
    setAntiCheatFilter(getParam("task_integrity", "ALL"));
    setCurrentPage(getNumberParam("task_page", 1));
  }, [getParam, getNumberParam]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
    updateUrl({ task_search: val.trim() ? val : null, task_page: null });
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
    updateUrl({ task_status: val === "ALL" ? null : val, task_page: null });
  };

  const handleAntiCheatChange = (val: string) => {
    setAntiCheatFilter(val);
    setCurrentPage(1);
    updateUrl({ task_integrity: val === "ALL" ? null : val, task_page: null });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrl({ task_page: newPage > 1 ? newPage : null });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setAntiCheatFilter("ALL");
    setCurrentPage(1);
    updateUrl({
      task_search: null,
      task_status: null,
      task_integrity: null,
      task_page: null,
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        searchTerm === "" ||
        t.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.roleApplied.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.challengeLanguage.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;

      const matchesAntiCheat =
        antiCheatFilter === "ALL" || t.antiCheatStatus === antiCheatFilter;

      return matchesSearch && matchesStatus && matchesAntiCheat;
    });
  }, [tasks, searchTerm, statusFilter, antiCheatFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTasks.slice(start, start + pageSize);
  }, [filteredTasks, currentPage]);

  const handleOpenReview = (task: EvaluationTask) => {
    // console.log("opening evaluation review modal", task.id);
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveReview = (updated: EvaluationTask) => {
    const updatedTasks = tasks.map((t) => (t.id === updated.id ? updated : t));
    onTasksChange(updatedTasks);

    try {
      localStorage.setItem("devassess_candidate_submissions", JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("devassess_submission_update", { detail: updated }));
    } catch {
      // ignore
    }

    toast.add({
      title: "Verdict Updated",
      description: `${updated.candidateName}'s status set to ${updated.status.toLowerCase().replace("_", " ")}.`,
      type: updated.status === "ACCEPTED" ? "success" : "info",
    });
  };

  const handleQuickStatusChange = (
    task: EvaluationTask,
    newStatus: EvaluationStatus,
  ) => {
    const updated = { ...task, status: newStatus };
    const updatedTasks = tasks.map((t) => (t.id === task.id ? updated : t));
    onTasksChange(updatedTasks);

    try {
      localStorage.setItem("devassess_candidate_submissions", JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("devassess_submission_update", { detail: updated }));
    } catch {
      // ignore
    }

    toast.add({
      title: "Status Changed",
      description: `${task.candidateName} marked as ${newStatus.toLowerCase().replace("_", " ")}.`,
      type: "info",
    });
  };

  const getStatusBadge = (status: EvaluationStatus) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-emerald-500 border-emerald-500/30 bg-emerald-500/10 font-semibold"
          >
            <CheckCircle2 className="size-3" />
            <span>accepted</span>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="destructive"
            className="text-[10px] gap-1 py-0 px-1.5 font-semibold"
          >
            <XCircle className="size-3" />
            <span>rejected</span>
          </Badge>
        );
      case "IN_REVIEW":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-blue-500 border-blue-500/30 bg-blue-500/10 font-semibold"
          >
            <Clock className="size-3" />
            <span>in review</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-amber-500 border-amber-500/30 bg-amber-500/10 font-semibold"
          >
            <Clock className="size-3" />
            <span>pending</span>
          </Badge>
        );
    }
  };

  const getAntiCheatBadge = (status: EvaluationTask["antiCheatStatus"]) => {
    switch (status) {
      case "FLAGGED":
        return (
          <Badge
            variant="destructive"
            className="text-[9px] gap-1 py-0 px-1.5 uppercase font-mono"
          >
            <ShieldAlert className="size-2.5" />
            <span>flagged</span>
          </Badge>
        );
      case "LOW_RISK":
        return (
          <Badge
            variant="outline"
            className="text-[9px] gap-1 py-0 px-1.5 text-amber-500 border-amber-500/30 bg-amber-500/10 font-mono"
          >
            <AlertTriangle className="size-2.5" />
            <span>low risk</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[9px] gap-1 py-0 px-1.5 text-emerald-500 border-emerald-500/30 bg-emerald-500/10 font-mono"
          >
            <CheckCircle2 className="size-2.5" />
            <span>clean</span>
          </Badge>
        );
    }
  };

  return (
    <>
      <Card className="rounded-2xl border-2 border-border/80 bg-gradient-to-b from-card via-card to-card/80 shadow-md backdrop-blur-md overflow-hidden">
        {/* Top accent gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-500 to-amber-500" />

        <CardHeader className="p-5 sm:p-6 pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2.5 tracking-tight">
                <Edit3 className="size-5 text-primary" />
                <span>Candidate Evaluation Task Queue</span>
                <Badge variant="outline" className="text-xs font-mono font-bold bg-primary/10 text-primary border-primary/30 px-2.5 py-0.5">
                  {filteredTasks.length} submissions
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Inspect candidate code quality, test case metrics, and update hiring decision verdicts.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {onOpenInvite && (
                <Button
                  size="sm"
                  onClick={onOpenInvite}
                  className="gap-2 text-xs font-bold h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all cursor-pointer"
                >
                  <Mail className="size-3.5" />
                  <span>Invite Candidate</span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="gap-1.5 text-xs font-semibold h-9 px-3.5 rounded-xl border-border/80 hover:bg-muted/60 transition-all cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Filters</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* search & filter bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="search by candidate, challenge title, role, or language..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/80"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter className="size-3.5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="h-9 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <select
                value={antiCheatFilter}
                onChange={(e) => handleAntiCheatChange(e.target.value)}
                className="h-9 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Integrity Signals</option>
                <option value="CLEAN">Clean Proctoring</option>
                <option value="LOW_RISK">Low Risk</option>
                <option value="FLAGGED">Flagged Telemetry</option>
              </select>
            </div>
          </div>

          {/* tasks queue table */}
          <div className="border border-border/50 rounded-lg overflow-hidden bg-background/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">candidate & role</th>
                    <th className="py-2.5 px-3">assessment challenge</th>
                    <th className="py-2.5 px-3">auto score & tests</th>
                    <th className="py-2.5 px-3">integrity</th>
                    <th className="py-2.5 px-3">review verdict</th>
                    <th className="py-2.5 px-3 text-right">actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedTasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-muted-foreground"
                      >
                        no candidate evaluations found matching the search
                        criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* candidate info */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-foreground">
                            {task.candidateName}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {task.candidateEmail}
                          </div>
                          <div className="text-[10px] text-primary font-medium mt-0.5">
                            {task.roleApplied}
                          </div>
                        </td>

                        {/* challenge */}
                        <td className="py-3 px-3 max-w-xs">
                          <div className="font-medium text-foreground truncate">
                            {task.challengeTitle}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                            <span className="font-mono bg-muted px-1.5 py-0.2 rounded text-foreground">
                              {task.challengeLanguage}
                            </span>
                            <span>•</span>
                            <span>{task.submittedAt}</span>
                          </div>
                        </td>

                        {/* score and test cases */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold font-mono text-sm ${
                                task.score >= 80
                                  ? "text-emerald-500"
                                  : task.score >= 60
                                    ? "text-amber-500"
                                    : "text-rose-500"
                              }`}
                            >
                              {task.score}%
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({task.testCasesPassed}/{task.totalTestCases}{" "}
                              passed)
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            latency: {task.executionTimeMs}ms
                          </span>
                        </td>

                        {/* anti cheat */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {getAntiCheatBadge(task.antiCheatStatus)}
                        </td>

                        {/* review status */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="space-y-1">
                            {getStatusBadge(task.status)}
                            <div className="pt-0.5">
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    handleQuickStatusChange(
                                      task,
                                      e.target.value as EvaluationStatus,
                                    )
                                  }
                                  className="h-7 px-2 rounded-lg border border-border/80 bg-background/90 text-[11px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs cursor-pointer hover:border-primary/40 transition-colors"
                                >
                                  <option value="PENDING_REVIEW">Pending</option>
                                  <option value="IN_REVIEW">In Review</option>
                                  <option value="ACCEPTED">Accept</option>
                                  <option value="REJECTED">Reject</option>
                                </select>
                              </div>
                            </div>
                          </td>

                          {/* action button */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleOpenReview(task)}
                              className="h-8 px-3 text-xs gap-1.5 font-bold rounded-xl shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <Edit3 className="size-3.5" />
                              <span>Score &amp; Review</span>
                            </Button>
                          </td>
                        </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination bar */}
            <div className="flex items-center justify-between px-3 py-2.5 border-t border-border/50 text-xs text-muted-foreground bg-muted/20">
              <span>
                showing{" "}
                {filteredTasks.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}{" "}
                to {Math.min(currentPage * pageSize, filteredTasks.length)} of{" "}
                {filteredTasks.length} tasks
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="px-2 text-xs font-mono">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* review modal dialog */}
      <EvaluationReviewModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReview}
      />
    </>
  );
}
