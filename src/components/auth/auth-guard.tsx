"use client";

import { useGetMe } from "@/hooks";
import { type ReactNode, useEffect } from "react";
import { getActiveUserEmail, getEffectiveRole } from "@/lib/session";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { data } = useGetMe();
  const user = data?.data;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const activeEmail =
      getActiveUserEmail() || user?.email?.toLowerCase().trim();

    if (activeEmail && user?.role) {
      const role = getEffectiveRole(activeEmail, user.role);
      // Sync cookie without triggering page reload loops
      document.cookie = `userRole=${role}; path=/; max-age=31536000;`;
    }
  }, [user]);

  // Route protection is securely handled by Next.js middleware.ts.
  // Rendering children directly prevents infinite reload loops and eliminates UI freezing.
  return <>{children}</>;
}
