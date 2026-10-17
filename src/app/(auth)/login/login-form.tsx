"use client";

import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import apiClient from "@/lib/apiClient";

// Schema validation for login input fields
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Demo accounts credentials for quick testing across all 3 roles
const DEMO_ACCOUNTS = [
  {
    role: "Admin",
    targetRole: "ADMIN",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin@100.com",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "Password@100",
    icon: ShieldCheck,
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-50 hover:bg-rose-100/80 border-rose-200 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 dark:border-rose-900/50",
  },
  {
    role: "Recruiter",
    targetRole: "RECRUITER",
    email: process.env.NEXT_PUBLIC_DEMO_RECRUITER_EMAIL ?? "recruiter@100.com",
    password: process.env.NEXT_PUBLIC_DEMO_RECRUITER_PASSWORD ?? "Password@100",
    icon: Briefcase,
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50 hover:bg-blue-100/80 border-blue-200 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 dark:border-blue-900/50",
  },
  {
    role: "Candidate",
    targetRole: "CANDIDATE",
    email: process.env.NEXT_PUBLIC_DEMO_CANDIDATE_EMAIL ?? "candidate@100.com",
    password: process.env.NEXT_PUBLIC_DEMO_CANDIDATE_PASSWORD ?? "Password@100",
    icon: User,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:border-emerald-900/50",
  },
];

// Helper function to redirect user to corresponding dashboard based on user role
function getDashboardRoute(role?: string) {
  const normalized = role?.toUpperCase();
  if (normalized === "ADMIN") return "/admin";
  if (normalized === "RECRUITER") return "/recruiter";
  return "/candidate";
}

export default function LoginForm() {
  const router = useRouter();

  // Controlled input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Password visibility toggle state
  const [showPassword, setShowPassword] = useState(false);

  // Form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track which demo login button is currently loading
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  // Validation error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inline feedback alert state (success / error)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Common function to perform login API request and extract role
  const performLogin = async (
    loginEmail: string,
    loginPass: string,
    fallbackRole?: string,
  ) => {
    // Send POST request to backend auth endpoint
    const res = (await apiClient("/auth/login", {
      method: "POST",
      body: { email: loginEmail, password: loginPass },
    })) as { data?: { user?: { role?: string }; role?: string } };

    // Extract logged in user information
    const user = res?.data?.user ?? res?.data;
    const role = user?.role || fallbackRole || "CANDIDATE";
    return role;
  };

  // Form submission handler for manual login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validate form inputs with Zod schema
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          errMap[issue.path[0] as string] = issue.message;
        }
      }
      setErrors(errMap);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Execute login API call
      const role = await performLogin(email, password);

      // Show success notification
      setStatusMessage({
        type: "success",
        text: "Logged in successfully! Redirecting...",
      });

      // Redirect to designated dashboard after slight delay
      setTimeout(() => {
        router.replace(getDashboardRoute(role));
      }, 500);
    } catch (err: unknown) {
      // Display error message from server response or fallback
      const errorObj = err as { data?: { message?: string }; message?: string };
      const msg =
        errorObj?.data?.message ||
        errorObj?.message ||
        "Invalid email or password.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click demo login handler for quick access
  const handleDemoLogin = async (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setStatusMessage(null);
    setErrors({});
    setEmail(account.email);
    setPassword(account.password);
    setDemoLoading(account.role);

    try {
      // Execute demo login with predefined credentials
      const role = await performLogin(
        account.email,
        account.password,
        account.targetRole,
      );

      // Show success message with role name
      setStatusMessage({
        type: "success",
        text: `Logged in as ${account.role}! Redirecting...`,
      });

      // Redirect to respective role dashboard
      setTimeout(() => {
        router.replace(getDashboardRoute(role));
      }, 500);
    } catch (err: unknown) {
      // Handle demo login failure gracefully
      const errorObj = err as { data?: { message?: string } };
      const msg =
        errorObj?.data?.message ||
        "Demo login failed. Please ensure the backend server is running on http://localhost:5000";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Inline status alert message */}
      {statusMessage && (
        <div
          className={`flex items-start gap-2.5 p-3 rounded-lg text-sm border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Login input form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email input field */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium mb-1.5 text-foreground"
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password input field with show/hide toggle */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Submit button with loading state */}
        <button
          id="login-submit"
          type="submit"
          disabled={isSubmitting || demoLoading !== null}
          className="w-full rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>Sign In</span>
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-medium">
            Or Quick Login
          </span>
        </div>
      </div>

      {/* One-Click Demo Login (Requirement 22 & 27) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            🚀 1-Click Demo Access
          </p>
          <span className="text-[11px] text-muted-foreground">
            Click to auto-fill & login
          </span>
        </div>
        {/* Demo accounts button grid */}
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((account) => {
            const isLoading = demoLoading === account.role;
            const Icon = account.icon;
            return (
              <button
                key={account.role}
                id={`demo-login-${account.role.toLowerCase()}`}
                type="button"
                disabled={isSubmitting || demoLoading !== null}
                onClick={() => handleDemoLogin(account)}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all disabled:opacity-60 cursor-pointer ${account.bg}`}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className={`h-5 w-5 ${account.color}`} />
                )}
                <span className="font-semibold text-foreground">
                  {account.role}
                </span>
                <span className="text-[10px] text-muted-foreground">Demo</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
