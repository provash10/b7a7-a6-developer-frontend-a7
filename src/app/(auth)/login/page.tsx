import { Code2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./login-form";

// Page metadata for SEO
export const metadata: Metadata = {
  title: "Login | DevAssess",
  description: "Sign in to your DevAssess account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-bold text-2xl tracking-tight mb-3 hover:opacity-90 transition-opacity"
          >
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Code2 className="h-6 w-6" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              DevAssess
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm backdrop-blur-sm">
          <LoginForm />
        </div>

        {/* Link to Registration */}
        <p className="text-center text-sm text-muted-foreground mt-5">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
