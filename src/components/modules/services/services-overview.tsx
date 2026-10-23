import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Sparkles,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const allServices = [
  {
    id: "code-assessment",
    title: "Code Assessment Engine",
    subtitle: "Core Assessment Platform",
    badge: "Core Service",
    badgeVariant: "default" as const,
    icon: Code2,
    description:
      "Comprehensive, timed coding evaluations with multi-language testcase sandboxing, algorithmic problem banks, anti-cheat telemetry, and instant recruiter leaderboards.",
    features: [
      "Tri-format: CODING, MCQ, and DESCRIPTIVE",
      "Public & hidden automated test cases",
      "Anti-cheat window blur & tab switch logging",
      "Tokenized invitation links with expiry dates",
      "Custom pass marks & real-time leaderboards",
    ],
    ctaText: "Explore Assessment Features",
    ctaLink: "#code-assessment",
  },
  {
    id: "live-interview",
    title: "Live Technical Interview",
    subtitle: "Real-time Pair Programming",
    badge: "Interactive Suite",
    badgeVariant: "secondary" as const,
    icon: Video,
    description:
      "Conduct seamless 1-on-1 collaborative coding interviews with synchronized dual cursors, high-definition video/audio, whiteboard support, and interviewer private scoring rubrics.",
    features: [
      "Real-time bidirectional collaborative code editor",
      "Integrated audio/video with low-latency WebRTC",
      "Interviewer private scorepad & rubric notes",
      "Interactive code compilation & terminal console",
      "Session replay with chronological keystroke logs",
    ],
    ctaText: "Learn About Live Interviews",
    ctaLink: "/contact",
  },
  {
    id: "ai-scoring",
    title: "AI Scoring & Proctoring",
    subtitle: "Automated Evaluation & Anti-Cheat",
    badge: "Intelligent Analytics",
    badgeVariant: "outline" as const,
    icon: Bot,
    description:
      "Deep static analysis engine that computes time & space complexity, flags code plagiarism across submissions, and generates comprehensive candidate competency summaries.",
    features: [
      "Static code quality & cleanliness analysis",
      "Algorithmic time & space complexity estimation",
      "Plagiarism & cross-candidate code similarity check",
      "Aggregated anti-cheat event threat indexing",
      "Executive summary reports for hiring managers",
    ],
    ctaText: "Explore AI Proctoring",
    ctaLink: "/contact",
  },
];

export default function ServicesOverview() {
  // console.log("services overview rendered");
  return (
    <section className="py-20 border-t border-border/60 bg-muted/10">
      <div className="container mx-auto px-4">
        {/* title */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-primary border-primary/30 bg-primary/5"
          >
            <Sparkles className="size-3.5" />
            Complete Feature Ecosystem
          </Badge>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Three Pillar Services for Tech Hiring
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Everything your recruitment and engineering teams need to source,
            assess, and hire top software developers.
          </p>
        </div>

        {/* services 3-column grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {allServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={service.id}
                className="flex flex-col rounded-2xl border border-border/80 bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <Badge variant={service.badgeVariant}>{service.badge}</Badge>
                </div>

                <div className="mt-6">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {service.subtitle}
                  </span>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* features list */}
                <div className="mt-6 flex-1 space-y-2.5 pt-4 border-t border-border/60">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Key Highlights:
                  </span>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* card cta */}
                <div className="mt-8 pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    className="w-full justify-between rounded-lg font-medium group"
                    render={<Link href={service.ctaLink} />}
                    nativeButton={false}
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
