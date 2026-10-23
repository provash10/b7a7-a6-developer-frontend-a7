"use client";

import { useState } from "react";
import { EvaluationTasksTable } from "./evaluation-tasks-table";
import { initialEvaluationTasks } from "./mock-data";
import { RecruiterQuickStats } from "./recruiter-quick-stats";
import type { EvaluationTask } from "./types";

export function RecruiterEvaluationsView() {
  // console.log("recruiter evaluations view component rendered");

  const [tasks, setTasks] = useState<EvaluationTask[]>(initialEvaluationTasks);

  return (
    <div className="space-y-6">
      {/* quick metrics overview */}
      <RecruiterQuickStats tasks={tasks} />

      {/* evaluations task queue table */}
      <EvaluationTasksTable tasks={tasks} onTasksChange={setTasks} />
    </div>
  );
}
