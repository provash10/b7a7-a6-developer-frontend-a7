"use client";

import { useGetMe } from "@/hooks";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";
import AccessDenied from "./access-denied";
import type { UserRole } from "@/types";

interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole[];
}

export default function RoleGuard({ children, roles }: RoleGuardProps) {
  const router = useRouter();

  // Fetch logged in user profile data
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  const isAuthorized = Boolean(user && roles.includes(user.role));

  useEffect(() => {
    // Wait until profile query finishes loading
    if (isPending) {
      return;
    }

    // Redirect to login if request fails or user does not exist
    if (isError || !user) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting to login..." />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}
