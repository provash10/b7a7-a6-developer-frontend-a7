"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Terminal,
  User,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Logo from "@/assets/svg/logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMyProfile, useLogout } from "@/hooks";
import {
  clearActiveSession,
  getActiveUserEmail,
  getEffectiveRole,
} from "@/lib/session";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeEmail, setActiveEmail] = useState("");
  const [effectiveRole, setEffectiveRole] = useState<
    "ADMIN" | "RECRUITER" | "CANDIDATE"
  >("CANDIDATE");

  const { data: profileData } = useGetMyProfile();
  const user = profileData?.data;
  const { mutate: logout } = useLogout();

  useEffect(() => {
    setMounted(true);
    const syncSession = () => {
      const email = user?.email || getActiveUserEmail();
      setActiveEmail(email);
      setEffectiveRole(getEffectiveRole(email, user?.role));
    };

    syncSession();
    window.addEventListener("devassess_role_change", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("devassess_role_change", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isLoggedIn = mounted && Boolean(activeEmail);

  const dashboardHref =
    effectiveRole === "ADMIN"
      ? "/admin"
      : effectiveRole === "RECRUITER"
        ? "/recruiter"
        : "/dashboard";

  const dashboardLabel =
    effectiveRole === "ADMIN"
      ? "Admin Console"
      : effectiveRole === "RECRUITER"
        ? "Recruiter Portal"
        : "Candidate Portal";

  const roleBadge =
    effectiveRole === "ADMIN"
      ? "Admin"
      : effectiveRole === "RECRUITER"
        ? "Recruiter"
        : "Candidate";

  const userName =
    user?.name ||
    (typeof window !== "undefined"
      ? localStorage.getItem("devassess_active_name")
      : null) ||
    (activeEmail.includes("@")
      ? activeEmail
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
      : "Developer");

  const userInitials = userName
    .trim()
    .split(/\s+/)
    .map((word: string) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    clearActiveSession();
    try {
      queryClient.clear();
    } catch {}

    toast.add({
      title: "Logged Out Successfully",
      description: "Your session credentials have been cleared.",
      type: "info",
    });

    try {
      logout();
    } catch {}

    window.location.href = "/login?logout=true";
  };

  const routes = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Services",
      url: "/services",
    },
    {
      name: "Pricing",
      url: "/pricing",
    },
    {
      name: "About Us",
      url: "/about-us",
    },
    {
      name: "Contact",
      url: "/contact",
    },
  ];

  return (
    <header className="w-full h-18 border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading font-extrabold text-xl text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Logo className="text-primary size-7" />
          </div>
          <span className="tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text">
            DevAssess
          </span>
        </Link>

        {/* Desktop Navigation (>= 768px) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/40">
          {routes.map((route) => {
            const isActive =
              route.url === "/"
                ? pathname === "/"
                : pathname === route.url || pathname.startsWith(`${route.url}/`);

            return (
              <Link
                key={route.url}
                href={route.url}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-background text-primary shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons (>= 768px) */}
        {isLoggedIn ? (
          <div className="hidden md:flex items-center gap-2.5">
            {/* Dashboard Link */}
            <Link href={dashboardHref}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-semibold text-xs border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary cursor-pointer shadow-xs"
              >
                <LayoutDashboard className="size-3.5 text-primary" />
                <span>{dashboardLabel}</span>
              </Button>
            </Link>

            {/* User Mini Avatar & Name */}
            <Link
              href={dashboardHref}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/60 hover:bg-muted/80 transition-colors"
              title={`Logged in as ${activeEmail}`}
            >
              <div className="size-6 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center">
                {userInitials}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold leading-tight text-foreground truncate max-w-[110px]">
                  {userName}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none">
                  {roleBadge}
                </span>
              </div>
            </Link>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 font-semibold text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
              title="Sign Out of Session"
            >
              <LogOut className="size-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold text-sm hover:bg-muted cursor-pointer"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="sm"
                className="font-semibold text-xs border-border/80 hover:bg-muted cursor-pointer"
              >
                Register
              </Button>
            </Link>
            <Link href="/services#code-assessment">
              <Button
                size="sm"
                className="gap-2 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 rounded-lg cursor-pointer"
              >
                <Terminal className="size-3.5" />
                <span>Try Sandbox</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile & Tablet Quick Bar + Menu Toggle (< 768px) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick mobile portal button when logged in */}
          {isLoggedIn ? (
            <Link href={dashboardHref}>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2.5 text-xs gap-1.5 font-semibold border-primary/30 bg-primary/5 text-primary"
              >
                <LayoutDashboard className="size-3.5" />
                <span className="hidden sm:inline">{dashboardLabel}</span>
                <span className="sm:hidden">Portal</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2.5 text-xs font-semibold"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Hamburger toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-6 text-foreground" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu (< 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-200 shadow-xl">
          {/* Navigation Links */}
          <div className="space-y-1">
            {routes.map((route) => {
              const isActive =
                route.url === "/"
                  ? pathname === "/"
                  : pathname === route.url || pathname.startsWith(`${route.url}/`);

              return (
                <Link
                  key={route.url}
                  href={route.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {route.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="pt-3 border-t border-border flex flex-col gap-2.5">
              {/* User Profile Card */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 border border-border/60">
                <div className="size-9 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {userInitials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {userName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {activeEmail} • <strong className="text-primary">{roleBadge}</strong>
                  </span>
                </div>
              </div>

              {/* Go to Dashboard CTA */}
              <Link
                href={dashboardHref}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-10 shadow-sm cursor-pointer">
                  <LayoutDashboard className="size-4" />
                  <span>Go to {dashboardLabel}</span>
                </Button>
              </Link>

              {/* Logout Button */}
              <Button
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/30 gap-2 h-10 cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Sign Out / Logout</span>
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full font-semibold h-10">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="ghost" className="w-full font-semibold h-10 hover:bg-muted">
                    Register
                  </Button>
                </Link>
              </div>
              <Link
                href="/services#code-assessment"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-10 shadow-sm">
                  <Terminal className="size-4" />
                  <span>Try Sandbox</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
