"use client";

import {
  ChevronRight,
  ClipboardCheck,
  Code2,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  LayoutDashboard,
  Shield,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export default function DashboardSidebar({
  onCloseMobile,
}: DashboardSidebarProps) {
  // console.log("dashboard sidebar component rendered");

  const pathname = usePathname();
  const isAdmin = Boolean(pathname?.startsWith("/admin"));
  const isRecruiter = Boolean(pathname?.startsWith("/recruiter"));

  const navigation = [
    {
      title: "Main Menu",
      items: [
        {
          name: "Dashboard Overview",
          href: "/dashboard",
          icon: LayoutDashboard,
          badge: "Active",
        },
        {
          name: "My Assessments",
          href: "/dashboard",
          icon: FileCheck2,
        },
      ],
    },
    {
      title: "Recruiter Portal",
      items: [
        {
          name: "Candidate Evaluations",
          href: "/recruiter",
          icon: ClipboardCheck,
          badge: "Review",
        },
        {
          name: "Earnings & Payouts",
          href: "/recruiter/earnings",
          icon: DollarSign,
          badge: "Income",
        },
      ],
    },
    {
      title: "Account & Billing",
      items: [
        {
          name: "Profile & Settings",
          href: "/dashboard/profile",
          icon: User,
        },
        {
          name: "Payment History",
          href: "/dashboard/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          name: "Admin Analytics",
          href: "/admin",
          icon: Shield,
          badge: "Console",
        },
        {
          name: "User & Assessments",
          href: "/admin/manage",
          icon: Users,
          badge: "CRUD",
        },
        {
          name: "Reports & Logs",
          href: "/admin/reports",
          icon: FileSpreadsheet,
          badge: "Audit",
        },
      ],
    },
  ];

  return (
    <aside
      className="flex flex-col h-full w-64 bg-card border-r border-border select-none"
      suppressHydrationWarning
    >
      {/* brand header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border/80">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 font-heading font-bold text-lg text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Code2 className="size-5" />
          </div>
          <span className="tracking-tight">
            Dev<span className="text-primary">Assess</span>
          </span>
        </Link>
        <Badge
          variant={isAdmin || isRecruiter ? "default" : "outline"}
          className="text-[10px] font-mono uppercase tracking-wider py-0 px-1.5"
          suppressHydrationWarning
        >
          {isAdmin ? "Admin" : isRecruiter ? "Recruiter" : "Candidate"}
        </Badge>
      </div>

      {/* role switcher preview banner */}
      <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-primary/5 border border-primary/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-foreground" suppressHydrationWarning>
              {isAdmin
                ? "Admin Console"
                : isRecruiter
                  ? "Recruiter Portal"
                  : "Candidate Portal"}
            </p>
            <p
              className="text-[11px] text-muted-foreground"
              suppressHydrationWarning
            >
              {isAdmin
                ? "Platform Intelligence"
                : isRecruiter
                  ? "Review & Evaluation Queue"
                  : "User Dashboard"}
            </p>
          </div>
        </div>
      </div>

      {/* nav list */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2 space-y-6"
        suppressHydrationWarning
      >
        {navigation.map((group) => (
          <div key={group.title} className="space-y-1">
            <p
              className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
              suppressHydrationWarning
            >
              {group.title}
            </p>
            <div className="space-y-1 pt-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onCloseMobile}
                    suppressHydrationWarning
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && !isActive && (
                      <span className="text-[10px] bg-primary/10 text-primary font-medium px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="size-3.5 opacity-80" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* bottom footer actions */}
      <div className="p-3 border-t border-border/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="size-3.5" />
            Public Website
          </span>
          <span className="text-[10px] opacity-70">↗</span>
        </Link>
      </div>
    </aside>
  );
}
