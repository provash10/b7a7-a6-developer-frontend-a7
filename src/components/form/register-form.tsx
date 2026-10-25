"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  Code2,
  Eye,
  EyeClosed,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRegistration } from "@/hooks";
import { registerSchema } from "@/validation";

interface DemoAccount {
  role: "Candidate" | "Evaluator";
  title: string;
  badge: string;
  name: string;
  email: string;
  contactNumber: string;
  pass: string;
  icon: typeof Code2;
  colorClass: string;
  buttonClass: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "Candidate",
    title: "👤 Candidate",
    badge: "User Account",
    name: "Alex Johnson",
    email: "new.candidate@devassess.com",
    contactNumber: "01712345678",
    pass: "Candidate@123",
    icon: Code2,
    colorClass: "border-primary/30 bg-primary/5 hover:border-primary/60",
    buttonClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  {
    role: "Evaluator",
    title: "🛠️ Evaluator",
    badge: "Provider Account",
    name: "Sarah Miller",
    email: "new.evaluator@devassess.com",
    contactNumber: "01812345678",
    pass: "Evaluator@123",
    icon: Briefcase,
    colorClass:
      "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
];

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: register, isPending: registerPending } = useRegistration();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema as any,
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password,
        phone: value.contactNumber?.trim() || undefined,
        role: "CANDIDATE",
      };

      register(payload, {
        onSuccess: (_res) => {
          // Persist user so admin dashboard immediately reflects this new account
          try {
            const stored = JSON.parse(
              localStorage.getItem("devassess_custom_users") || "[]",
            );
            const newUser = {
              id: `usr-${Date.now().toString().slice(-4)}`,
              name: value.name.trim(),
              email: value.email.trim(),
              role: "CANDIDATE",
              status: "ACTIVE",
              createdAt: "Today",
              assessmentsCount: 0,
            };
            localStorage.setItem(
              "devassess_custom_users",
              JSON.stringify([
                newUser,
                ...stored.filter((u: any) => u.email !== newUser.email),
              ]),
            );
          } catch {}

          toast.add({
            title: "Registration Successful",
            description:
              "Your account has been created. Redirecting to login...",
            type: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["user"] });
          setTimeout(() => {
            router.push("/login");
          }, 800);
        },
        onError: (err: any) => {
          console.error("Registration API Error:", err);
          const errorMessage =
            err?.data?.message ||
            err?.message ||
            "Could not complete registration. Please try again.";
          toast.add({
            title: "Registration Failed",
            description: errorMessage,
            type: "error",
          });
        },
      });
    },
  });

  const handleFillDemo = (demo: DemoAccount) => {
    form.setFieldValue("name", demo.name);
    form.setFieldValue("email", demo.email);
    form.setFieldValue("contactNumber", demo.contactNumber);
    form.setFieldValue("password", demo.pass);
    form.setFieldValue("confirmPassword", demo.pass);

    toast.add({
      title: "Demo Data Loaded",
      description: `Filled with demo ${demo.role} credentials`,
      type: "success",
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header matching login form aesthetics */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="size-3.5 animate-pulse" />
          <span>Developer Assessment Platform</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
          Create an Account <span>🚀</span>
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>

      {/* Main Registration Form with @tanstack/react-form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <FieldGroup>
          {/* Full Name Field */}
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      placeholder="John Doe"
                      autoComplete="name"
                      className="pl-9"
                      aria-invalid={isInvalid}
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Email Field */}
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="pl-9"
                      aria-invalid={isInvalid}
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Phone Number Field */}
          <form.Field name="contactNumber">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Phone Number{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      placeholder="01712345678"
                      autoComplete="tel"
                      className="pl-9"
                      aria-invalid={isInvalid}
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Password Field */}
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="pl-9 pr-10"
                      aria-invalid={isInvalid}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeClosed className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Confirm Password Field */}
          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="pl-9 pr-10"
                      aria-invalid={isInvalid}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeClosed className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Password Helper Guidelines */}
          <div className="rounded-lg bg-muted/50 p-2.5 text-[11px] text-muted-foreground space-y-1 border border-border/50">
            <span className="font-semibold text-foreground block">
              Password Requirements:
            </span>
            <ul className="list-disc list-inside space-y-0.5">
              <li>At least 8 characters long</li>
              <li>Include uppercase, lowercase, number & special character</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            disabled={registerPending}
            type="submit"
            className="w-full h-10 font-semibold flex items-center justify-center gap-2 mt-1"
          >
            {registerPending ? (
              <>
                <Spinner />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="size-4" />
                <span>Create Account</span>
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      {/* Divider */}
      <div className="relative my-1 text-center text-xs uppercase after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-3 font-semibold text-muted-foreground tracking-wider">
          ─── OR ───
        </span>
      </div>

      {/* Quick Fill Demo Data Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">⚡</span>
            <span className="text-sm font-bold text-foreground">
              Quick Fill Demo Data
            </span>
          </div>
          <Badge variant="secondary" className="text-[10px] font-semibold">
            One-Click Fill
          </Badge>
        </div>

        {/* Demo Fill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEMO_ACCOUNTS.map((demo) => (
            <div
              key={demo.role}
              className={`rounded-xl border p-2.5 flex flex-col justify-between gap-2.5 transition-all shadow-xs ${demo.colorClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-xs text-foreground">
                    {demo.title}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                    {demo.badge}
                  </Badge>
                </div>
                <p className="text-[10px] font-mono text-muted-foreground truncate pt-0.5">
                  {demo.email}
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={registerPending}
                onClick={() => handleFillDemo(demo)}
                className={`w-full text-xs h-7.5 font-medium flex items-center justify-center gap-1 ${demo.buttonClass}`}
              >
                <span>Fill Form</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Login Redirect */}
      <div className="pt-1 text-center text-xs text-muted-foreground border-t border-border/40 flex items-center justify-center gap-1">
        <span>Already have an account?</span>
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline underline-offset-4"
        >
          Login here
        </Link>
      </div>
    </div>
  );
}
