import { Code2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/form/login-form";

export const metadata: Metadata = {
  title: "Login | Developer Assessment Platform",
  description:
    "Sign in to your account with email/password or use One-Click Demo Login for Admin, Candidate, and Evaluator.",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-foreground hover:opacity-90 transition-opacity"
          >
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
              <Code2 className="size-4.5" />
            </div>
            <span>DevAssess</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/login.jpg"
          alt="Login illustration"
          fill
          priority
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
