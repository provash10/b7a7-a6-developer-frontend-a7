import { type NextRequest, NextResponse } from "next/server";

function decodeJwtRole(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.role ? String(parsed.role).toUpperCase() : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/recruiter");

  const userRole = accessToken ? decodeJwtRole(accessToken) : null;

  // 1. If already authenticated and visiting login/register, redirect to appropriate role portal
  if (accessToken && isAuthRoute && userRole) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (userRole === "RECRUITER") {
      return NextResponse.redirect(new URL("/recruiter", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Strict Role Enforcement for Protected Dashboards
  if (isDashboardRoute && userRole) {
    // Admin only routes
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      const fallbackUrl =
        userRole === "RECRUITER" ? "/recruiter" : "/dashboard";
      return NextResponse.redirect(new URL(fallbackUrl, request.url));
    }

    // Recruiter only routes
    if (
      pathname.startsWith("/recruiter") &&
      userRole !== "RECRUITER" &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/recruiter/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
