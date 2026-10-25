import { type NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string): any {
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
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Handle explicit logout: /logout or /login?logout=true - ALWAYS purge server cookies!
  if (
    pathname === "/logout" ||
    (pathname.startsWith("/login") && request.nextUrl.searchParams.get("logout") === "true")
  ) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    const expireOptions = { path: "/", maxAge: 0, expires: new Date(0) };

    response.cookies.delete("accessToken");
    response.cookies.delete("token");
    response.cookies.delete("refreshToken");
    response.cookies.delete("userRole");
    response.cookies.delete("role");
    response.cookies.delete("userEmail");

    response.cookies.set("accessToken", "", expireOptions);
    response.cookies.set("token", "", expireOptions);
    response.cookies.set("refreshToken", "", expireOptions);
    response.cookies.set("userRole", "", expireOptions);
    response.cookies.set("role", "", expireOptions);
    response.cookies.set("userEmail", "", expireOptions);

    for (const cookie of request.cookies.getAll()) {
      if (cookie.name.startsWith("role_")) {
        response.cookies.delete(cookie.name);
        response.cookies.set(cookie.name, "", expireOptions);
      }
    }

    return response;
  }

  const accessToken =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/recruiter");

  const jwtPayload = accessToken ? decodeJwtPayload(accessToken) : null;
  const emailCookie = request.cookies.get("userEmail")?.value;
  const decodedEmail = emailCookie
    ? decodeURIComponent(emailCookie).toLowerCase().trim()
    : null;
  const email = jwtPayload?.email?.toLowerCase().trim() || decodedEmail;
  const cleanEmail = email ? email.replace(/[@.]/g, "_") : null;

  // Check email-specific role set by admin, or general userRole cookie
  const emailAssignedRole = cleanEmail
    ? request.cookies.get(`role_${cleanEmail}`)?.value?.toUpperCase()
    : null;

  const cookieRole =
    emailAssignedRole ||
    request.cookies.get("userRole")?.value?.toUpperCase() ||
    request.cookies.get("role")?.value?.toUpperCase();

  let userRole = "CANDIDATE";
  if (emailAssignedRole) {
    userRole = emailAssignedRole;
  } else if (email === "admin@100.com" || jwtPayload?.role?.toUpperCase() === "ADMIN") {
    userRole = "ADMIN";
  } else if (email === "recruiter@100.com") {
    userRole = cookieRole || "RECRUITER";
  } else if (cookieRole) {
    userRole = cookieRole;
  } else if (jwtPayload?.role) {
    userRole = String(jwtPayload.role).toUpperCase();
  }

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

  // 1.5. If completely unauthenticated visitor tries to access protected dashboard routes, redirect to login
  if (!accessToken && !cookieRole && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
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

    // Candidate routes restriction (cannot access admin or recruiter)
    if (
      userRole === "CANDIDATE" &&
      (pathname.startsWith("/recruiter") || pathname.startsWith("/admin"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Keep userRole cookie synced on responses
    if (cleanEmail && emailAssignedRole) {
      const response = NextResponse.next();
      response.cookies.set("userRole", emailAssignedRole, { path: "/", maxAge: 31536000 });
      return response;
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
    "/logout",
  ],
};
