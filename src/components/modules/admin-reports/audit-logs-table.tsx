"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Info,
  RotateCcw,
  Search,
  ShieldAlert,
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

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: "ADMIN" | "SYSTEM" | "RECRUITER";
  action: string;
  category: "AUTH" | "ASSESSMENT" | "SECURITY" | "BILLING" | "SYSTEM";
  target: string;
  ipAddress: string;
  severity: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
  metadata?: string;
}

const mockAuditLogs: AuditLogItem[] = [
  {
    id: "log_9841",
    timestamp: "2026-10-23 23:18:42",
    actor: "sarah.admin@devassess.io",
    actorRole: "ADMIN",
    action: "USER_STATUS_UPDATED",
    category: "AUTH",
    target: "usr_alex_dev (ACTIVE -> BLOCKED)",
    ipAddress: "192.168.1.104",
    severity: "WARNING",
    metadata: "manual security block due to flag threshold",
  },
  {
    id: "log_9840",
    timestamp: "2026-10-23 22:54:10",
    actor: "sandbox-evaluator-03",
    actorRole: "SYSTEM",
    action: "ANTI_CHEAT_SIGNAL_RAISED",
    category: "SECURITY",
    target: "sub_py_concurrency_891",
    ipAddress: "10.240.0.18",
    severity: "CRITICAL",
    metadata: "audio device switched & paste buffer anomaly detected",
  },
  {
    id: "log_9839",
    timestamp: "2026-10-23 22:31:05",
    actor: "stripe_webhook_listener",
    actorRole: "SYSTEM",
    action: "INVOICE_PAYMENT_SUCCEEDED",
    category: "BILLING",
    target: "inv_recruiter_corp_441 ($299.00)",
    ipAddress: "54.187.205.12",
    severity: "SUCCESS",
    metadata: "growth plan renewal via stripe charge ch_3n81x",
  },
  {
    id: "log_9838",
    timestamp: "2026-10-23 21:15:20",
    actor: "david.recruiter@techscale.io",
    actorRole: "RECRUITER",
    action: "ASSESSMENT_INVITE_SENT",
    category: "ASSESSMENT",
    target: "cand_priya_sharma@gmail.com",
    ipAddress: "72.14.201.88",
    severity: "INFO",
    metadata: "distributed systems senior challenge link dispatched",
  },
  {
    id: "log_9837",
    timestamp: "2026-10-23 20:45:11",
    actor: "sarah.admin@devassess.io",
    actorRole: "ADMIN",
    action: "ASSESSMENT_CHALLENGE_PUBLISHED",
    category: "ASSESSMENT",
    target: "asst_k8s_operator_dev",
    ipAddress: "192.168.1.104",
    severity: "SUCCESS",
    metadata: "status updated from draft to published",
  },
  {
    id: "log_9836",
    timestamp: "2026-10-23 19:12:00",
    actor: "security_kernel_daemon",
    actorRole: "SYSTEM",
    action: "RATE_LIMIT_EXCEEDED",
    category: "SECURITY",
    target: "endpoint /api/v1/auth/login",
    ipAddress: "185.220.101.5",
    severity: "WARNING",
    metadata: "ip temporarily banned for 30 minutes after 15 failed logins",
  },
  {
    id: "log_9835",
    timestamp: "2026-10-23 18:02:44",
    actor: "system_cron_worker",
    actorRole: "SYSTEM",
    action: "DATABASE_SNAPSHOT_BACKUP",
    category: "SYSTEM",
    target: "aws_s3_devassess_backups",
    ipAddress: "10.240.0.4",
    severity: "INFO",
    metadata: "database snapshot size 4.2gb uploaded with sha256 checksum",
  },
  {
    id: "log_9834",
    timestamp: "2026-10-23 17:20:19",
    actor: "sarah.admin@devassess.io",
    actorRole: "ADMIN",
    action: "GLOBAL_CONFIG_MUTATED",
    category: "SYSTEM",
    target: "sandbox_execution_timeout (20s -> 25s)",
    ipAddress: "192.168.1.104",
    severity: "WARNING",
    metadata: "extended timeout for memory heavy spring boot challenges",
  },
];

export function AuditLogsTable() {
  const { getParam, getNumberParam, updateUrl } = useTableUrlState();

  const [logs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState(() =>
    getParam("log_search", ""),
  );
  const [severityFilter, setSeverityFilter] = useState<string>(() =>
    getParam("log_severity", "ALL"),
  );
  const [categoryFilter, setCategoryFilter] = useState<string>(() =>
    getParam("log_category", "ALL"),
  );
  const [currentPage, setCurrentPage] = useState(() =>
    getNumberParam("log_page", 1),
  );
  const pageSize = 5;

  useEffect(() => {
    setSearchTerm(getParam("log_search", ""));
    setSeverityFilter(getParam("log_severity", "ALL"));
    setCategoryFilter(getParam("log_category", "ALL"));
    setCurrentPage(getNumberParam("log_page", 1));
  }, [getParam, getNumberParam]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
    updateUrl({ log_search: val.trim() ? val : null, log_page: null });
  };

  const handleSeverityChange = (val: string) => {
    setSeverityFilter(val);
    setCurrentPage(1);
    updateUrl({ log_severity: val === "ALL" ? null : val, log_page: null });
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
    updateUrl({ log_category: val === "ALL" ? null : val, log_page: null });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrl({ log_page: newPage > 1 ? newPage : null });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSeverityFilter("ALL");
    setCategoryFilter("ALL");
    setCurrentPage(1);
    updateUrl({
      log_search: null,
      log_severity: null,
      log_category: null,
      log_page: null,
    });
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity =
        severityFilter === "ALL" || item.severity === severityFilter;

      const matchesCategory =
        categoryFilter === "ALL" || item.category === categoryFilter;

      return matchesSearch && matchesSeverity && matchesCategory;
    });
  }, [logs, searchTerm, severityFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage]);

  const getSeverityBadge = (severity: AuditLogItem["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <Badge
            variant="destructive"
            className="text-[10px] gap-1 py-0 px-1.5"
          >
            <ShieldAlert className="size-3" />
            <span>critical</span>
          </Badge>
        );
      case "WARNING":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-amber-500 border-amber-500/30 bg-amber-500/10"
          >
            <AlertTriangle className="size-3" />
            <span>warning</span>
          </Badge>
        );
      case "SUCCESS":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
          >
            <CheckCircle2 className="size-3" />
            <span>success</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-blue-500 border-blue-500/30 bg-blue-500/10"
          >
            <Info className="size-3" />
            <span>info</span>
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <span>immutable audit trail</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {filteredLogs.length} events
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              chronological security events, privileged admin operations, and
              system execution telemetry.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="gap-1.5 text-xs h-8"
          >
            <RotateCcw className="size-3.5" />
            <span>reset filters</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* search & filter bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="search by action, actor, target or ip..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-9 text-xs bg-background/80"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="size-3.5 text-muted-foreground" />
              <select
                value={severityFilter}
                onChange={(e) => handleSeverityChange(e.target.value)}
                className="h-9 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
                <option value="SUCCESS">Success</option>
              </select>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-9 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Categories</option>
              <option value="AUTH">Authentication</option>
              <option value="ASSESSMENT">Assessment</option>
              <option value="SECURITY">Security</option>
              <option value="BILLING">Billing</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>
        </div>

        {/* audit logs table */}
        <div className="border border-border/50 rounded-lg overflow-hidden bg-background/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-3">timestamp</th>
                  <th className="py-2.5 px-3">actor & role</th>
                  <th className="py-2.5 px-3">action & category</th>
                  <th className="py-2.5 px-3">target resource</th>
                  <th className="py-2.5 px-3">ip address</th>
                  <th className="py-2.5 px-3 text-right">severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground"
                    >
                      no audit logs found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* timestamp */}
                      <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* actor */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-foreground">
                          {log.actor}
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          role: {log.actorRole.toLowerCase()}
                        </span>
                      </td>

                      {/* action & category */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-medium text-[11px] text-foreground">
                          {log.action}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-1 mt-0.5"
                        >
                          {log.category.toLowerCase()}
                        </Badge>
                      </td>

                      {/* target & details */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-mono text-[11px] text-foreground truncate">
                          {log.target}
                        </div>
                        {log.metadata && (
                          <div className="text-[10px] text-muted-foreground truncate">
                            {log.metadata}
                          </div>
                        )}
                      </td>

                      {/* ip address */}
                      <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {log.ipAddress}
                      </td>

                      {/* severity */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {getSeverityBadge(log.severity)}
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
              {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}{" "}
              to {Math.min(currentPage * pageSize, filteredLogs.length)} of{" "}
              {filteredLogs.length} events
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
  );
}
