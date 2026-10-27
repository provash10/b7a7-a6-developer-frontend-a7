import { Suspense } from "react";
import { ChevronRight, Home, LayoutDashboard, Loader2, Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminManageView } from "@/components/modules/admin-manage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "User & Assessment Management | DevAssess Admin",
  description:
    "Manage platform users, roles, statuses, and author coding assessment challenges with live search, filters, pagination, and CRUD controls.",
};

export const instant = false;

export default function AdminManagePage() {
  // console.log("admin manage page rendered");

  return (
    <div className="space-y-8 pb-12">
      {/* breadcrumb navigation */}
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="size-3.5" />
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <Link
          href="/admin"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Shield className="size-3.5 text-primary" />
          <span>Admin Console</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">
          User & Assessment Management
        </span>
      </nav>

      {/* header with quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              User & Assessment Operations
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-primary/30 text-primary uppercase"
            >
              CRUD Console
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Manage platform users, role assignments, security status, and author
            coding assessment challenges with real-time search, filters, and
            pagination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
              <LayoutDashboard className="size-3.5 text-primary" />
              <span>Analytics Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* admin manage view container wrapped in Suspense for searchParams */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="text-xs font-medium">Loading manage console...</span>
          </div>
        }
      >
        <AdminManageView />
      </Suspense>
    </div>
  );
}
