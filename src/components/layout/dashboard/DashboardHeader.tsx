"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMyProfile, useLogout } from "@/hooks";

interface DashboardHeaderProps {
  onOpenMobile: () => void;
}

export default function DashboardHeader({
  onOpenMobile,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: profileData } = useGetMyProfile();

  const user = profileData?.data || {
    name: "Provash Kumar",
    email: "provash10@gmail.com",
    role: "Candidate",
  };

  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        toast.add({
          title: "Logged Out",
          description: "You have been logged out successfully.",
          type: "success",
        });
        router.push("/login");
      },
    });
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
          <span className="font-semibold text-foreground">
            Candidate Dashboard
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
              description:
                "You have 1 new assessment invitation from TechCorp.",
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
            {user?.name ? user.name.slice(0, 2) : "PK"}
          </div>
          <div className="hidden md:block text-left">
            <p
              className="text-xs font-semibold leading-tight text-foreground truncate max-w-[130px]"
              suppressHydrationWarning
            >
              {user?.name || "Provash Kumar"}
            </p>
            <p
              className="text-[11px] text-muted-foreground truncate max-w-[130px]"
              suppressHydrationWarning
            >
              {user?.email || "provash10@gmail.com"}
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
