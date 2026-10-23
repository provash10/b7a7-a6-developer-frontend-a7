"use client";

import {
  Award,
  CheckCircle2,
  Copy,
  Download,
  FileDown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

interface CertifiedBadge {
  id: string;
  title: string;
  category: string;
  credentialId: string;
  issueDate: string;
  score: number;
  percentile: string;
  level: "Advanced" | "Intermediate" | "Foundational";
  skills: string[];
  gradient: string;
  badgeAccent: string;
}

const BADGES_DATA: CertifiedBadge[] = [
  {
    id: "badge-1",
    title: "Next.js 15 & TypeScript Specialist",
    category: "Full Stack Engineering",
    credentialId: "DEV-CERT-9402-NX",
    issueDate: "Oct 19, 2026",
    score: 95,
    percentile: "Top 5%",
    level: "Advanced",
    skills: ["Next.js 15", "TypeScript", "App Router", "Server Actions"],
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    badgeAccent: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  {
    id: "badge-2",
    title: "Algorithms & Data Structures Mastery",
    category: "Computer Science Core",
    credentialId: "DEV-CERT-8210-ALG",
    issueDate: "Oct 12, 2026",
    score: 91,
    percentile: "Top 8%",
    level: "Advanced",
    skills: ["Dynamic Programming", "Trees & Graphs", "Complexity Analysis"],
    gradient: "from-amber-600 via-orange-600 to-red-600",
    badgeAccent: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  },
  {
    id: "badge-3",
    title: "Frontend & Reactive Component Architecture",
    category: "User Interface Design",
    credentialId: "DEV-CERT-7840-FE",
    issueDate: "Sep 28, 2026",
    score: 88,
    percentile: "Top 12%",
    level: "Intermediate",
    skills: ["React 19", "State Machines", "Accessibility", "Design Tokens"],
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    badgeAccent: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
];

export function CertifiedBadgesGrid() {
  // console.log("rendering certified badges grid");

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // simulate svg badge download
  const handleDownloadBadge = (badge: CertifiedBadge) => {
    // console.log("initiating badge svg download");
    setDownloadingId(badge.id);

    setTimeout(() => {
      setDownloadingId(null);
      toast.add({
        title: "Badge Downloaded",
        description: `Verified SVG badge for "${badge.title}" has been saved to your downloads.`,
        type: "success",
      });
    }, 600);
  };

  // simulate official pdf certificate download
  const handleDownloadCertificate = (badge: CertifiedBadge) => {
    // console.log("initiating pdf certificate download");
    toast.add({
      title: "Certificate Generated",
      description: `Cryptographically signed PDF certificate (${badge.credentialId}) generated.`,
      type: "success",
    });
  };

  // copy markdown badge embed snippet for github readme
  const handleCopyMarkdown = (badge: CertifiedBadge) => {
    // console.log("copying markdown embed snippet");
    const markdownSnippet = `[![DevAssess Certified: ${badge.title}](https://img.shields.io/badge/DevAssess-${encodeURIComponent(badge.title)}-emerald?logo=checkmarx&style=for-the-badge)](https://devassess.io/verify/${badge.credentialId})`;

    navigator.clipboard.writeText(markdownSnippet);

    toast.add({
      title: "Markdown Embed Copied",
      description:
        "GitHub README badge code copied to your clipboard. Paste it into your repo profile!",
      type: "info",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="size-5 text-amber-500" />
            <span>earned skill certifications & badges</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            download verifiable svg badges for github, linkedin, or export
            official pdf certificates.
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-xs gap-1">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>all badges tamper-proof</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES_DATA.map((badge) => (
          <Card
            key={badge.id}
            className="flex flex-col justify-between border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/40 transition-all duration-200"
          >
            {/* badge decorative visual seal */}
            <div
              className={`relative h-32 bg-linear-to-r ${badge.gradient} p-4 flex items-center justify-between text-white overflow-hidden`}
            >
              {/* background patterned grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] opacity-15" />

              <div className="relative z-10 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/80">
                  {badge.category}
                </span>
                <h3 className="text-sm font-bold leading-tight max-w-[190px]">
                  {badge.title}
                </h3>
                <span className="inline-block text-[11px] font-mono text-white/90">
                  id: {badge.credentialId}
                </span>
              </div>

              {/* holographic badge seal medallion */}
              <div className="relative z-10 flex flex-col items-center justify-center size-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-inner">
                <Sparkles className="size-5 text-yellow-300" />
                <span className="text-[11px] font-extrabold text-white">
                  {badge.score}%
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-wider text-white/80">
                  {badge.percentile}
                </span>
              </div>
            </div>

            <CardHeader className="pt-4 pb-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  issued on {badge.issueDate}
                </span>
                <Badge variant="success" className="text-[10px] gap-1">
                  <CheckCircle2 className="size-3" />
                  <span>verified</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-4 text-xs">
              {/* competencies tested */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  verified competencies:
                </span>
                <div className="flex flex-wrap gap-1">
                  {badge.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-foreground border border-border/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-border/50 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleDownloadBadge(badge)}
                  disabled={downloadingId === badge.id}
                  className="gap-1.5 text-xs w-full"
                >
                  <Download className="size-3.5 text-primary" />
                  <span>svg badge</span>
                </Button>

                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleDownloadCertificate(badge)}
                  className="gap-1.5 text-xs w-full"
                >
                  <FileDown className="size-3.5 text-amber-500" />
                  <span>pdf cert</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleCopyMarkdown(badge)}
                className="w-full text-muted-foreground hover:text-foreground gap-1.5 text-[11px]"
              >
                <Copy className="size-3" />
                <span>copy github readme embed</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
