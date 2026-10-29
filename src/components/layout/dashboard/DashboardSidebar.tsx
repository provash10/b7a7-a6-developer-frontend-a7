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
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMyProfile } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getEffectiveRole, setActiveSession } from "@/lib/session";
import apiClient from "@/lib/apiClient";

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export default function DashboardSidebar({
  onCloseMobile,
}: DashboardSidebarProps) {
  // console.log("dashboard sidebar component rendered");

  const pathname = usePathname();
  const { data: profileData } = useGetMyProfile();
  const user = profileData?.data;
  const [mounted, setMounted] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);

  const fallbackRole = pathname?.startsWith("/admin")
    ? "ADMIN"
    : pathname?.startsWith("/recruiter")
      ? "RECRUITER"
      : "CANDIDATE";

  const [effectiveRole, setEffectiveRole] = useState<
    "ADMIN" | "RECRUITER" | "CANDIDATE"
  >(fallbackRole);

  const handleSwitchPortal = async (
    targetRole: "ADMIN" | "RECRUITER" | "CANDIDATE",
    destination: string,
  ) => {
    setSwitchingRole(targetRole);

    const demoCredentials: Record<
      "ADMIN" | "RECRUITER" | "CANDIDATE",
      { email: string; pass: string; name: string }
    > = {
      ADMIN: {
        email: "admin@100.com",
        pass: "Password@100",
        name: "System Admin",
      },
      RECRUITER: {
        email: "recruiter@100.com",
        pass: "Password@100",
        name: "Jane Recruiter",
      },
      CANDIDATE: {
        email: "candidate@100.com",
        pass: "Password@100",
        name: "John Developer",
      },
    };

    const target = demoCredentials[targetRole];

    try {
      const res = await apiClient<any>("/auth/login", {
        method: "POST",
        body: {
          email: target.email,
          password: target.pass,
        },
      });

      const token = res?.data?.accessToken || res?.accessToken;
      const userName = res?.data?.user?.name || target.name;

      if (token) {
        setActiveSession(target.email, targetRole, userName, token);
        window.location.href = destination;
        return;
      }
    } catch (err) {
      console.warn("Portal switch login fallback:", err);
    }

    setActiveSession(target.email, targetRole, target.name);
    window.location.href = destination;
  };

  useEffect(() => {
    setMounted(true);
    const updateRole = () => {
      setEffectiveRole(getEffectiveRole(user?.email, user?.role));
    };
    updateRole();

    // keep cookies synchronized with live database role
    if (user?.role) {
      const normalizedRole = user.role.toUpperCase();
      document.cookie = `userRole=${normalizedRole}; path=/; max-age=31536000;`;
      if (user.email) {
        const clean = user.email.toLowerCase().trim().replace(/[@.]/g, "_");
        document.cookie = `role_${clean}=${normalizedRole}; path=/; max-age=31536000;`;
      }
    }

    window.addEventListener("devassess_role_change", updateRole);
    window.addEventListener("storage", updateRole);
    return () => {
      window.removeEventListener("devassess_role_change", updateRole);
      window.removeEventListener("storage", updateRole);
    };
  }, [user]);

  const activeRole = mounted ? effectiveRole : fallbackRole;

  // auto-redirect to appropriate portal if role changed from candidate
  useEffect(() => {
    if (mounted && pathname === "/dashboard") {
      if (activeRole === "RECRUITER") {
        window.location.replace("/recruiter");
      } else if (activeRole === "ADMIN") {
        window.location.replace("/admin");
      }
    }
  }, [mounted, pathname, activeRole]);

  const isAdmin =
    Boolean(pathname?.startsWith("/admin")) ||
    (Boolean(pathname?.startsWith("/dashboard")) && activeRole === "ADMIN");

  const isRecruiter =
    Boolean(pathname?.startsWith("/recruiter")) ||
    (Boolean(pathname?.startsWith("/dashboard")) && activeRole === "RECRUITER");

  const navigation = [
    ...(isAdmin
      ? [
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
        ]
      : isRecruiter
        ? [
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
                {
                  name: "Profile & Availability",
                  href: "/recruiter/profile",
                  icon: UserCheck,
                  badge: "Settings",
                },
              ],
            },
            {
              title: "Billing & Credits",
              items: [
                {
                  name: "Payment History",
                  href: "/dashboard/payments",
                  icon: CreditCard,
                },
              ],
            },
          ]
        : [
            {
              title: "Candidate Menu",
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
              title: "Account & Credentials",
              items: [
                {
                  name: "Profile & Settings",
                  href: "/dashboard/profile",
                  icon: User,
                },
                {
                  name: "Payment & Badges",
                  href: "/dashboard/payments",
                  icon: CreditCard,
                },
              ],
            },
          ]),
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

      {/* bottom footer role switcher & public link */}
      <div className="p-3 border-t border-border/80 space-y-2">
        <div className="rounded-lg bg-muted/40 p-2 border border-border/50">
          <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Switch Portal View:
          </span>
          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => handleSwitchPortal("ADMIN", "/admin")}
              disabled={switchingRole !== null}
              className={cn(
                "text-center py-1 rounded font-medium transition-colors cursor-pointer",
                isAdmin
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                switchingRole === "ADMIN" && "opacity-50 cursor-wait",
              )}
            >
              {switchingRole === "ADMIN" ? "..." : "Admin"}
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPortal("RECRUITER", "/recruiter")}
              disabled={switchingRole !== null}
              className={cn(
                "text-center py-1 rounded font-medium transition-colors cursor-pointer",
                isRecruiter
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                switchingRole === "RECRUITER" && "opacity-50 cursor-wait",
              )}
            >
              {switchingRole === "RECRUITER" ? "..." : "Recruiter"}
            </button>
            <button
              type="button"
              onClick={() => handleSwitchPortal("CANDIDATE", "/dashboard")}
              disabled={switchingRole !== null}
              className={cn(
                "text-center py-1 rounded font-medium transition-colors cursor-pointer",
                !isAdmin && !isRecruiter
                  ? "bg-primary/20 text-primary font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                switchingRole === "CANDIDATE" && "opacity-50 cursor-wait",
              )}
            >
              {switchingRole === "CANDIDATE" ? "..." : "Candidate"}
            </button>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
