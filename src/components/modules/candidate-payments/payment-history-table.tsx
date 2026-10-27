"use client";

import { CreditCard, Download, Receipt, Search } from "lucide-react";
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

interface PaymentInvoice {
  id: string;
  invoiceNumber: string;
  description: string;
  category: string;
  paymentMethod: "bKash" | "Stripe Card";
  paymentAccount: string;
  date: string;
  amount: string;
  currency: string;
  status: "paid" | "pending" | "refunded";
  receiptUrl: string;
}

const INVOICE_HISTORY: PaymentInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-0924",
    description:
      "Candidate Pro Plan — 1 Month Unlimited Assessments & Evaluation Reports",
    category: "Subscription Membership",
    paymentMethod: "bKash",
    paymentAccount: "017••••5678",
    date: "Oct 19, 2026 • 04:30 PM",
    amount: "৳ 1,499",
    currency: "BDT",
    status: "paid",
    receiptUrl: "/invoices/INV-2026-0924.pdf",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-0810",
    description: "Official Verified Skill Credential & Tamper-Proof Badge Fee",
    category: "Certification Issuance",
    paymentMethod: "bKash",
    paymentAccount: "017••••5678",
    date: "Oct 12, 2026 • 11:15 AM",
    amount: "৳ 499",
    currency: "BDT",
    status: "paid",
    receiptUrl: "/invoices/INV-2026-0810.pdf",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-0701",
    description: "Candidate Profile Spotlight & Priority Recruiter Review Pass",
    category: "Profile Spotlight",
    paymentMethod: "Stripe Card",
    paymentAccount: "Visa •••• 4242",
    date: "Sep 15, 2026 • 08:20 PM",
    amount: "৳ 499",
    currency: "BDT",
    status: "paid",
    receiptUrl: "/invoices/INV-2026-0701.pdf",
  },
];

export function PaymentHistoryTable() {
  const { getParam, updateUrl } = useTableUrlState();

  const [searchQuery, setSearchQuery] = useState(() =>
    getParam("pay_search", ""),
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "refunded">(
    () => {
      const val = getParam("pay_status", "all");
      return val === "paid" || val === "refunded" ? val : "all";
    },
  );

  useEffect(() => {
    setSearchQuery(getParam("pay_search", ""));
    const val = getParam("pay_status", "all");
    setStatusFilter(val === "paid" || val === "refunded" ? val : "all");
  }, [getParam]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrl({ pay_search: val.trim() ? val : null });
  };

  const handleStatusChange = (val: "all" | "paid" | "refunded") => {
    setStatusFilter(val);
    updateUrl({ pay_status: val === "all" ? null : val });
  };

  // filter invoices based on search and status tab
  const filteredInvoices = useMemo(() => {
    return INVOICE_HISTORY.filter((inv) => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleDownloadInvoice = (inv: PaymentInvoice) => {
    // console.log("downloading invoice pdf");
    toast.add({
      title: "Invoice PDF Downloaded",
      description: `Official tax receipt for ${inv.invoiceNumber} (${inv.amount} ${inv.currency}) downloaded.`,
      type: "success",
    });
  };

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
              <Receipt className="size-4" />
              <span>billing records</span>
            </div>
            <CardTitle className="text-lg">payment & invoice history</CardTitle>
            <CardDescription className="text-xs">
              view transaction records, tax receipts, and download official pdf
              invoices.
            </CardDescription>
          </div>

          {/* filter status tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border border-border/60 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => handleStatusChange("all")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              all ({INVOICE_HISTORY.length})
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("paid")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "paid"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              paid (3)
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("refunded")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "refunded"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              refunded (0)
            </button>
          </div>
        </div>

        {/* search bar */}
        <div className="relative mt-4">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="search by invoice id (#INV-...), description, or payment method..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground">
              <tr>
                <th className="py-3 px-4 font-medium">invoice id</th>
                <th className="py-3 px-4 font-medium">plan & description</th>
                <th className="py-3 px-4 font-medium">payment method</th>
                <th className="py-3 px-4 font-medium">date</th>
                <th className="py-3 px-4 font-medium">amount</th>
                <th className="py-3 px-4 font-medium">status</th>
                <th className="py-3 px-4 font-medium text-right">receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    no invoice records found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* invoice number */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                      #{inv.invoiceNumber}
                    </td>

                    {/* description */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-medium text-foreground truncate">
                        {inv.description}
                      </p>
                      <span className="text-[11px] text-muted-foreground">
                        {inv.category}
                      </span>
                    </td>

                    {/* payment method */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {inv.paymentMethod === "bKash" ? (
                          <span className="flex size-5 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 font-bold text-[10px]">
                            ৳
                          </span>
                        ) : (
                          <CreditCard className="size-4 text-blue-500" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {inv.paymentMethod}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {inv.paymentAccount}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* date */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {inv.date}
                    </td>

                    {/* amount */}
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {inv.amount}
                      <span className="text-[10px] font-normal text-muted-foreground ml-1">
                        {inv.currency}
                      </span>
                    </td>

                    {/* status */}
                    <td className="py-3.5 px-4">
                      <Badge variant="success" className="text-[10px]">
                        {inv.status}
                      </Badge>
                    </td>

                    {/* action */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleDownloadInvoice(inv)}
                        className="gap-1.5 text-xs"
                      >
                        <Download className="size-3 text-primary" />
                        <span>pdf</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
