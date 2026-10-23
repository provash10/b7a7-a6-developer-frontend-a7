"use client";

import {
  Download,
  FileCheck2,
  FileSpreadsheet,
  Loader2,
  Receipt,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: typeof FileSpreadsheet;
  accentColor: string;
  badge: string;
  supportedFormats: Array<"CSV" | "PDF" | "JSON">;
  estimatedSize: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "candidate-performance",
    title: "Candidate Performance & Skill Benchmark",
    description:
      "aggregated candidate scores, percentile distributions, test completion timings, and pass/fail rates across all active challenges.",
    icon: FileCheck2,
    accentColor: "text-blue-500",
    badge: "analytics",
    supportedFormats: ["CSV", "PDF", "JSON"],
    estimatedSize: "2.4 MB",
  },
  {
    id: "anti-cheat-audit",
    title: "Anti-Cheat Audit & Plagiarism Telemetry",
    description:
      "flagged candidate submissions, code similarity index logs, tab-switch counts, audio/paste anomaly logs, and camera proctoring verifications.",
    icon: ShieldAlert,
    accentColor: "text-amber-500",
    badge: "security",
    supportedFormats: ["CSV", "PDF"],
    estimatedSize: "1.1 MB",
  },
  {
    id: "billing-revenue",
    title: "Platform Billing & Recruiter Revenue",
    description:
      "recruiter subscription plan charges, pay-per-test candidate assessment fees, stripe invoice transaction ids, and tax breakdown.",
    icon: Receipt,
    accentColor: "text-emerald-500",
    badge: "finance",
    supportedFormats: ["CSV", "PDF"],
    estimatedSize: "850 KB",
  },
  {
    id: "sandbox-execution",
    title: "Sandbox Telemetry & Execution Reliability",
    description:
      "docker container spin-up latencies, memory and cpu consumption metrics, timeout terminations, and language compiler error rates.",
    icon: FileSpreadsheet,
    accentColor: "text-purple-500",
    badge: "infrastructure",
    supportedFormats: ["JSON", "CSV"],
    estimatedSize: "3.7 MB",
  },
];

export function ExportReportsCard() {
  // console.log("export reports card component rendered");

  const [dateRange, setDateRange] = useState<string>("30d");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<
    Record<string, "CSV" | "PDF" | "JSON">
  >({
    "candidate-performance": "CSV",
    "anti-cheat-audit": "PDF",
    "billing-revenue": "CSV",
    "sandbox-execution": "JSON",
  });

  const handleDownload = (report: ReportTemplate) => {
    const format = selectedFormat[report.id] || report.supportedFormats[0];
    // console.log("triggering report export download", report.id);

    setDownloadingId(report.id);

    // simulate backend report synthesis and stream download
    setTimeout(() => {
      setDownloadingId(null);

      // trigger simulated browser file download
      const filename = `devassess_${report.id}_${dateRange}_${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`;
      const dummyContent = `devassess export report\ntitle: ${report.title}\ndate-range: ${dateRange}\ngenerated-at: ${new Date().toISOString()}\nformat: ${format}\n`;
      const blob = new Blob([dummyContent], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.add({
        title: "Report Generated & Downloaded",
        description: `Exported ${filename} successfully (${format}).`,
        type: "success",
      });
    }, 1200);
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Download className="size-4 text-primary" />
              <span>data exports & automated reports</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                on-demand
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              generate compliant audit logs, candidate scorecards, and financial
              ledgers in your preferred file format.
            </CardDescription>
          </div>

          {/* date range filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              export window:
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="h-8 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last 365 Days</option>
              <option value="all">All-Time Cumulative</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates.map((report) => {
            const Icon = report.icon;
            const currentFormat =
              selectedFormat[report.id] || report.supportedFormats[0];
            const isDownloading = downloadingId === report.id;

            return (
              <div
                key={report.id}
                className="p-4 rounded-xl border border-border/60 bg-background/60 hover:border-primary/40 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Icon className={`size-4 ${report.accentColor}`} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground leading-tight">
                          {report.title}
                        </h4>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          approx. {report.estimatedSize}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[9px] py-0 px-1.5 uppercase font-mono"
                    >
                      {report.badge}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {report.description}
                  </p>
                </div>

                {/* format options and download button */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground mr-1">
                      format:
                    </span>
                    {report.supportedFormats.map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() =>
                          setSelectedFormat((prev) => ({
                            ...prev,
                            [report.id]: fmt,
                          }))
                        }
                        className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                          currentFormat === fmt
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant={isDownloading ? "secondary" : "default"}
                    disabled={isDownloading}
                    onClick={() => handleDownload(report)}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="size-3.5" />
                        <span>download {currentFormat}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* banner with scheduled report note */}
        <div className="mt-5 p-3 rounded-lg border border-border/50 bg-muted/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="size-4 text-primary shrink-0" />
            <span>
              automated weekly compliance reports are dispatched to platform
              administrators on mondays at 00:00 utc.
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] py-0 px-1.5 font-mono text-emerald-500 border-emerald-500/30"
          >
            cron active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
