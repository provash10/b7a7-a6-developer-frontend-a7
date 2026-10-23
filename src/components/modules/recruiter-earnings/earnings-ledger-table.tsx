"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  Filter,
  RotateCcw,
  Search,
  Sparkles,
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
import type {
  EarningsTransaction,
  TransactionStatus,
  TransactionType,
} from "./types";

interface EarningsLedgerTableProps {
  transactions: EarningsTransaction[];
}

export function EarningsLedgerTable({
  transactions,
}: EarningsLedgerTableProps) {
  // console.log("earnings ledger table component rendered");

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        searchTerm === "" ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.payoutMethod.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "ALL" || tx.type === typeFilter;
      const matchesStatus =
        statusFilter === "ALL" || tx.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize),
  );
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  const handleDownloadReceipt = (tx: EarningsTransaction) => {
    // console.log("downloading transaction receipt", tx.id);
    const filename = `receipt_${tx.id}.txt`;
    const receiptContent = `devassess reviewer payout receipt\ntransaction id: ${tx.id}\ndate: ${tx.date}\ntype: ${tx.type}\namount: $${tx.amount}\npayout method: ${tx.payoutMethod}\nstatus: ${tx.status}\n`;
    const blob = new Blob([receiptContent], {
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
      title: "Receipt Downloaded",
      description: `Receipt for ${tx.id} exported successfully.`,
      type: "success",
    });
  };

  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case "EVALUATION_FEE":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-blue-500 border-blue-500/30 bg-blue-500/10 font-mono"
          >
            <ArrowDownLeft className="size-2.5" />
            <span>evaluation</span>
          </Badge>
        );
      case "BONUS_REWARD":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-purple-500 border-purple-500/30 bg-purple-500/10 font-mono"
          >
            <Sparkles className="size-2.5" />
            <span>bonus</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-amber-500 border-amber-500/30 bg-amber-500/10 font-mono"
          >
            <ArrowUpRight className="size-2.5" />
            <span>payout</span>
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-emerald-500 border-emerald-500/30 bg-emerald-500/10 font-medium"
          >
            <CheckCircle2 className="size-2.5" />
            <span>completed</span>
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-blue-500 border-blue-500/30 bg-blue-500/10 font-medium"
          >
            <Clock className="size-2.5" />
            <span>processing</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 py-0 px-1.5 text-muted-foreground font-medium"
          >
            <span>pending</span>
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
              <FileSpreadsheet className="size-4 text-primary" />
              <span>earnings & payout transaction ledger</span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {filteredTransactions.length} records
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              itemized audit trail of evaluation fee compensations, bonuses, and
              bank withdrawals.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("ALL");
              setStatusFilter("ALL");
              setCurrentPage(1);
            }}
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
              placeholder="search by tx id, candidate, challenge or method..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 text-xs bg-background/80"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Filter className="size-3.5 text-muted-foreground" />
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Types</option>
                <option value="EVALUATION_FEE">Evaluation Fees</option>
                <option value="BONUS_REWARD">Quality Bonuses</option>
                <option value="PAYOUT_WITHDRAWAL">Payout Withdrawals</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-2.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* transactions ledger table */}
        <div className="border border-border/50 rounded-lg overflow-hidden bg-background/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-3">tx id & timestamp</th>
                  <th className="py-2.5 px-3">type</th>
                  <th className="py-2.5 px-3">
                    assessment details / beneficiary
                  </th>
                  <th className="py-2.5 px-3">payout rail</th>
                  <th className="py-2.5 px-3">amount</th>
                  <th className="py-2.5 px-3">status</th>
                  <th className="py-2.5 px-3 text-right">receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-muted-foreground"
                    >
                      no earnings transactions found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* tx id & date */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono font-medium text-foreground text-[11px]">
                          {tx.id}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {tx.date}
                        </div>
                      </td>

                      {/* type badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getTypeBadge(tx.type)}
                      </td>

                      {/* context & details */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-medium text-foreground truncate">
                          {tx.challengeTitle}
                        </div>
                        {tx.candidateName !== "—" && (
                          <div className="text-[10px] text-muted-foreground">
                            candidate: {tx.candidateName}
                          </div>
                        )}
                      </td>

                      {/* payout rail */}
                      <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {tx.payoutMethod}
                      </td>

                      {/* amount */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono font-bold">
                        <span
                          className={
                            tx.amount >= 0
                              ? "text-emerald-500"
                              : "text-amber-500"
                          }
                        >
                          {tx.amount >= 0
                            ? `+$${tx.amount.toFixed(2)}`
                            : `-$${Math.abs(tx.amount).toFixed(2)}`}
                        </span>
                      </td>

                      {/* status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getStatusBadge(tx.status)}
                      </td>

                      {/* receipt download */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDownloadReceipt(tx)}
                          title="download receipt"
                          className="hover:text-primary"
                        >
                          <Download className="size-3.5" />
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
              {filteredTransactions.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}{" "}
              to {Math.min(currentPage * pageSize, filteredTransactions.length)}{" "}
              of {filteredTransactions.length} entries
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon-xs"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
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
                onClick={() => setCurrentPage((p) => p + 1)}
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
