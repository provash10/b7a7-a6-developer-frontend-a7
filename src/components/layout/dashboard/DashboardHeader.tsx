"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMyProfile, useLogout } from "@/hooks";
import { clearActiveSession, getEffectiveRole } from "@/lib/session";

interface DashboardHeaderProps {
  onOpenMobile: () => void;
}

export default function DashboardHeader({
  onOpenMobile,
}: DashboardHeaderProps) {
  // console.log("dashboard header component rendered");

  const router = useRouter();
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: profileData } = useGetMyProfile();
  const user = profileData?.data;
  const [mounted, setMounted] = useState(false);

  const fallbackRole = pathname?.startsWith("/admin")
    ? "ADMIN"
    : pathname?.startsWith("/recruiter")
      ? "RECRUITER"
      : "CANDIDATE";

  const [effectiveRole, setEffectiveRole] = useState<
    "ADMIN" | "RECRUITER" | "CANDIDATE"
  >(fallbackRole);

  useEffect(() => {
    setMounted(true);
    const updateRole = () => {
      setEffectiveRole(getEffectiveRole(user?.email, user?.role));
    };
    updateRole();

    // Keep cookies synchronized with live database role
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

  const isAdmin =
    Boolean(pathname?.startsWith("/admin")) ||
    (Boolean(pathname?.startsWith("/dashboard")) && activeRole === "ADMIN");

  const isRecruiter =
    Boolean(pathname?.startsWith("/recruiter")) ||
    (Boolean(pathname?.startsWith("/dashboard")) && activeRole === "RECRUITER");

  const dashboardLabel = isAdmin
    ? "Admin Console"
    : isRecruiter
      ? "Recruiter Portal"
      : "Candidate Dashboard";

  const defaultUser = {
    name: isAdmin
      ? "System Admin"
      : isRecruiter
        ? "Hiring Manager"
        : "Candidate User",
    email: isAdmin
      ? "admin@100.com"
      : isRecruiter
        ? "recruiter@100.com"
        : "candidate@100.com",
    role: isAdmin ? "Admin" : isRecruiter ? "Recruiter" : "Candidate",
  };

  const displayName = user?.name || defaultUser.name;
  const displayEmail = user?.email || defaultUser.email;

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((word: string) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const queryClient = useQueryClient();

  const handleLogout = () => {
    // 1. Clear all client session storage and cookies
    clearActiveSession();
    try {
      queryClient.clear();
    } catch {}

    toast.add({
      title: "Logging Out...",
      description: "Clearing session credentials.",
      type: "info",
    });

    // 2. Fire backend logout in background
    try {
      logout();
    } catch {}

    // 3. Navigate directly to /login?logout=true which commands middleware to purge all server-side cookies
    window.location.href = "/login?logout=true";
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* left: mobile trigger & breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenMobile}
          className="lg:hidden text-muted-foreground hover:text-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>DevAssess</span>
          <span>/</span>
          <span
            className="font-semibold text-foreground"
            suppressHydrationWarning
          >
            {dashboardLabel}
          </span>
        </div>
      </div>

      {/* right: actions & user info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* notifications icon */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Notifications"
          onClick={() => {
            toast.add({
              title: "Notifications",
              description: isAdmin
                ? "Platform alert: 28 submissions flagged for review."
                : "You have 1 new assessment invitation from TechCorp.",
              type: "info",
            });
          }}
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full ring-2 ring-card animate-pulse" />
        </button>

        <div className="h-4 w-px bg-border/80" />

        {/* user card */}
        <div className="flex items-center gap-2.5">
          <div
            className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase"
            suppressHydrationWarning
          >
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p
              className="text-xs font-semibold leading-tight text-foreground truncate max-w-[130px]"
              suppressHydrationWarning
            >
              {displayName}
            </p>
            <p
              className="text-[11px] text-muted-foreground truncate max-w-[130px]"
              suppressHydrationWarning
            >
              {displayEmail}
            </p>
          </div>
        </div>

        {/* logout button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
