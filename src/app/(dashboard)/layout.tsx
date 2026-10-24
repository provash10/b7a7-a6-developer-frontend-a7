"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/layout/dashboard/DashboardSidebar";
import AuthGuard from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log("dashboard layout rendered");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <DashboardSidebar />
      </div>

      {/* mobile sidebar backdrop & drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* drawer */}
          <div className="fixed inset-y-0 left-0 z-50 flex shadow-2xl">
            <DashboardSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* main content area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardHeader onOpenMobile={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl w-full">{children}</div>
        </main>
      </div>
    </div>
  </AuthGuard>
);
}
