import { ChevronRight, Home, LayoutDashboard, Shield } from "lucide-react";
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
          <span>dashboard</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <Link
          href="/admin"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Shield className="size-3.5 text-primary" />
          <span>admin console</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="text-foreground font-medium">
          user & assessment management
        </span>
      </nav>

      {/* header with quick controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              user & assessment operations
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-primary/30 text-primary"
            >
              crud console
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            manage platform users, role assignments, security status, and author
            coding assessment challenges with real-time search, filters, and
            pagination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <LayoutDashboard className="size-3.5 text-primary" />
              <span>analytics dashboard</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* admin manage view container */}
      <AdminManageView />
    </div>
  );
}
