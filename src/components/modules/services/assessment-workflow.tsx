import {
  CheckCircle2,
  FileCode2,
  Mail,
  PlaySquare,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const workflowSteps = [
  {
    step: "01",
    icon: FileCode2,
    title: "Curate & Configure Assessment",
    description:
      "Recruiter selects problems from the Question Bank across CODING, MCQ, or DESCRIPTIVE formats, specifying pass marks, total score, and time limits.",
    highlight: "Assessment CRUD & Question Mapping",
  },
  {
    step: "02",
    icon: Mail,
    title: "Dispatch Tokenized Invitations",
    description:
      "Send cryptographically secure, single-use invitation tokens to candidates with customizable expiry dates directly via automated transactional email.",
    highlight: "AssessmentInvitation with inviteToken",
  },
  {
    step: "03",
    icon: PlaySquare,
    title: "Timed Candidate Test Attempt",
    description:
      "Candidate accepts the invitation, enters the browser-based IDE, and the server initiates strict synchronized countdown timer tracking.",
    highlight: "CandidateAttempt (IN_PROGRESS)",
  },
  {
    step: "04",
    icon: ShieldAlert,
    title: "Continuous Proctoring & Test Runner",
    description:
      "Candidate code is executed in isolated containers against hidden test cases while tab switches and window blur events log antiCheatFlags.",
    highlight: "Anti-Cheat Telemetry & Verdict Engine",
  },
  {
    step: "05",
    icon: Trophy,
    title: "Leaderboard & Hiring Decision",
    description:
      "System computes scoreObtained against passMarks, generates candidate rankings, and presents recruiter analytics for interview selection.",
    highlight: "Real-time Leaderboard & Audit Log",
  },
];

export default function AssessmentWorkflow() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-primary border-primary/30 bg-primary/5"
          >
            <CheckCircle2 className="size-3.5" />
            Execution Lifecycle
          </Badge>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How The Assessment Engine Works
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            A frictionless, end-to-end evaluation pipeline engineered for
            enterprise reliability.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-3 lg:grid-cols-5 relative">
          {workflowSteps.map((item, _idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-xl border border-border/70 bg-card p-6 shadow-xs hover:border-primary/50 transition-all duration-300"
              >
                {/* Step Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-primary/40">
                    {item.step}
                  </span>
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                </div>

                <h3 className="font-heading text-base font-bold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-border/50">
                  <span className="text-[11px] font-semibold text-primary/80">
                    {item.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
