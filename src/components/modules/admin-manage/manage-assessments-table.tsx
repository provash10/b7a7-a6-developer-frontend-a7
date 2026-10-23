"use client";

import {
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  FileCode,
  FilePlus,
  Play,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
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
import {
  AssessmentEditModal,
  type ManagedAssessment,
} from "./assessment-edit-modal";

const INITIAL_ASSESSMENTS: ManagedAssessment[] = [
  {
    id: "asst-01",
    title: "Full Stack Next.js 15 & TypeScript Challenge",
    description:
      "Build a reactive board with Server Actions, optimistic state, and zod validation.",
    company: "TechCorp Labs",
    durationMinutes: 90,
    passMarks: 70,
    totalMarks: 100,
    status: "PUBLISHED",
    difficulty: "MEDIUM",
    skills: ["Next.js 15", "TypeScript", "Tailwind CSS"],
    submissionsCount: 142,
    passRate: 78,
  },
  {
    id: "asst-02",
    title: "Algorithmic Problem Solving & Data Structures",
    description:
      "Advanced tree traversals, dynamic programming algorithms, and graph shortest path.",
    company: "Algorithmix Systems",
    durationMinutes: 120,
    passMarks: 75,
    totalMarks: 100,
    status: "PUBLISHED",
    difficulty: "HARD",
    skills: ["Python", "Dynamic Programming", "Trees"],
    submissionsCount: 96,
    passRate: 64,
  },
  {
    id: "asst-03",
    title: "React Component Architecture & Accessibility",
    description:
      "Design design system tokens, keyboard navigation, and ARIA compliant dialogs.",
    company: "PixelCraft Studio",
    durationMinutes: 60,
    passMarks: 70,
    totalMarks: 100,
    status: "PUBLISHED",
    difficulty: "MEDIUM",
    skills: ["React 19", "A11y", "State Machines"],
    submissionsCount: 88,
    passRate: 82,
  },
  {
    id: "asst-04",
    title: "PostgreSQL Indexing & Optimization",
    description:
      "Analyze query execution plans, configure multi-column indexes, and minimize lock contention.",
    company: "FinScale Technologies",
    durationMinutes: 75,
    passMarks: 65,
    totalMarks: 100,
    status: "DRAFT",
    difficulty: "MEDIUM",
    skills: ["PostgreSQL", "Query Plans", "Indexes"],
    submissionsCount: 0,
    passRate: 0,
  },
  {
    id: "asst-05",
    title: "Go Microservices & Docker Concurrency",
    description:
      "Implement worker pool concurrency patterns, mutex locks, and containerized runtime.",
    company: "CloudNative Labs",
    durationMinutes: 90,
    passMarks: 80,
    totalMarks: 100,
    status: "ARCHIVED",
    difficulty: "HARD",
    skills: ["Go", "Docker", "Goroutines"],
    submissionsCount: 45,
    passRate: 55,
  },
  {
    id: "asst-06",
    title: "Python Data Processing & ETL Pipelines",
    description:
      "Ingest high-throughput JSON stream data, perform vector sanitization, and output parquet.",
    company: "DataWave Corp",
    durationMinutes: 60,
    passMarks: 70,
    totalMarks: 100,
    status: "PUBLISHED",
    difficulty: "EASY",
    skills: ["Python", "Pandas", "ETL"],
    submissionsCount: 110,
    passRate: 89,
  },
];

export function ManageAssessmentsTable() {
  // console.log("rendering manage assessments table component");

  const [assessments, setAssessments] =
    useState<ManagedAssessment[]>(INITIAL_ASSESSMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] =
    useState<ManagedAssessment | null>(null);

  // filter assessments
  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.skills.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
      const matchesDifficulty =
        difficultyFilter === "ALL" || a.difficulty === difficultyFilter;

      return matchesSearch && matchesStatus && matchesDifficulty;
    });
  }, [assessments, searchQuery, statusFilter, difficultyFilter]);

  // pagination
  const totalPages = Math.ceil(filteredAssessments.length / pageSize) || 1;
  const paginatedAssessments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAssessments.slice(start, start + pageSize);
  }, [filteredAssessments, currentPage]);

  // toggle archive / publish
  const handleToggleStatus = (asst: ManagedAssessment) => {
    const newStatus = asst.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    // console.log("toggling assessment status", asst.id, newstatus);

    setAssessments((prev) =>
      prev.map((a) => (a.id === asst.id ? { ...a, status: newStatus } : a)),
    );

    toast.add({
      title:
        newStatus === "PUBLISHED"
          ? "Challenge Published"
          : "Challenge Archived",
      description: `"${asst.title}" is now ${newStatus.toLowerCase()}.`,
      type: "success",
    });
  };

  // delete assessment
  const handleDelete = (asst: ManagedAssessment) => {
    // console.log("deleting assessment challenge", asst.id);
    setAssessments((prev) => prev.filter((a) => a.id !== asst.id));

    toast.add({
      title: "Challenge Deleted",
      description: `"${asst.title}" has been deleted.`,
      type: "success",
    });
  };

  // save / create assessment
  const handleSaveAssessment = (updated: ManagedAssessment) => {
    // console.log("saving assessment data", updated.id);
    if (editingAssessment) {
      setAssessments((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a)),
      );
      toast.add({
        title: "Challenge Updated",
        description: `Changes to "${updated.title}" have been saved.`,
        type: "success",
      });
    } else {
      setAssessments((prev) => [updated, ...prev]);
      toast.add({
        title: "Challenge Created",
        description: `"${updated.title}" has been added to the catalog.`,
        type: "success",
      });
    }
  };

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-0.5">
              <FileCode className="size-3.5" />
              <span>curriculum & evaluation catalog</span>
            </div>
            <CardTitle className="text-base font-semibold text-foreground">
              assessment challenges & benchmarks
            </CardTitle>
            <CardDescription className="text-xs">
              create, review pass criteria, update test cases, and manage active
              tests.
            </CardDescription>
          </div>

          <Button
            size="xs"
            onClick={() => {
              setEditingAssessment(null);
              setIsModalOpen(true);
            }}
            className="gap-1.5 self-start sm:self-auto"
          >
            <FilePlus className="size-3.5" />
            <span>create challenge</span>
          </Button>
        </div>

        {/* filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
          {/* search */}
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="search title, company, or skills..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 px-2.5 rounded-none border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">
              All Statuses (Published, Draft, Archived)
            </option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
            <option value="ARCHIVED">Archived Only</option>
          </select>

          {/* difficulty filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 px-2.5 rounded-none border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Difficulties (Easy, Medium, Hard)</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Intermediate</option>
            <option value="HARD">Advanced / Hard</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground">
              <tr>
                <th className="py-3 px-4 font-medium">challenge</th>
                <th className="py-3 px-4 font-medium">organizer</th>
                <th className="py-3 px-4 font-medium">difficulty</th>
                <th className="py-3 px-4 font-medium">pass criteria</th>
                <th className="py-3 px-4 font-medium">status</th>
                <th className="py-3 px-4 font-medium">throughput</th>
                <th className="py-3 px-4 font-medium text-right">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedAssessments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    no assessment challenges found matching your filter
                    criteria.
                  </td>
                </tr>
              ) : (
                paginatedAssessments.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* title and skills */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-foreground truncate">
                        {a.title}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {a.skills.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* company */}
                    <td className="py-3 px-4 font-medium text-muted-foreground">
                      {a.company}
                    </td>

                    {/* difficulty */}
                    <td className="py-3 px-4">
                      {a.difficulty === "EASY" && (
                        <Badge variant="success" className="text-[10px]">
                          easy
                        </Badge>
                      )}
                      {a.difficulty === "MEDIUM" && (
                        <Badge variant="amber" className="text-[10px]">
                          intermediate
                        </Badge>
                      )}
                      {a.difficulty === "HARD" && (
                        <Badge variant="destructive" className="text-[10px]">
                          advanced
                        </Badge>
                      )}
                    </td>

                    {/* pass criteria & duration */}
                    <td className="py-3 px-4 text-muted-foreground">
                      <p className="font-semibold text-foreground">
                        {a.passMarks} / {a.totalMarks} marks
                      </p>
                      <span className="text-[10px] flex items-center gap-1">
                        <Clock className="size-3" />
                        {a.durationMinutes} mins
                      </span>
                    </td>

                    {/* status */}
                    <td className="py-3 px-4">
                      {a.status === "PUBLISHED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="size-3" />
                          published
                        </span>
                      )}
                      {a.status === "DRAFT" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          draft
                        </span>
                      )}
                      {a.status === "ARCHIVED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                          <Archive className="size-3" />
                          archived
                        </span>
                      )}
                    </td>

                    {/* submissions count */}
                    <td className="py-3 px-4 text-muted-foreground">
                      <p className="font-semibold text-foreground font-mono">
                        {a.submissionsCount} runs
                      </p>
                      {a.submissionsCount > 0 && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          {a.passRate}% pass
                        </span>
                      )}
                    </td>

                    {/* actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            setEditingAssessment(a);
                            setIsModalOpen(true);
                          }}
                          title="edit challenge"
                        >
                          <Edit2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleToggleStatus(a)}
                          title={
                            a.status === "PUBLISHED"
                              ? "archive challenge"
                              : "publish challenge"
                          }
                        >
                          {a.status === "PUBLISHED" ? (
                            <Archive className="size-3.5 text-amber-500" />
                          ) : (
                            <Play className="size-3.5 text-emerald-500" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDelete(a)}
                          title="delete challenge"
                        >
                          <Trash2 className="size-3.5 text-rose-500 hover:text-rose-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 text-xs text-muted-foreground">
          <span>
            showing{" "}
            {filteredAssessments.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}{" "}
            to {Math.min(currentPage * pageSize, filteredAssessments.length)} of{" "}
            {filteredAssessments.length} challenges
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-xs"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="px-2 text-foreground font-medium">
              page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* modal */}
      <AssessmentEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assessment={editingAssessment}
        onSave={handleSaveAssessment}
      />
    </Card>
  );
}
