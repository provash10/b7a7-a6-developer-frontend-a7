"use client";

import {
  AlertTriangle,
  Check,
  Copy,
  Home,
  LayoutDashboard,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // console.log("global error boundary captured exception", error?.message);

  const [copied, setCopied] = useState(false);

  const handleCopyError = () => {
    const errorDetails = `devassess runtime error\nmessage: ${error.message || "unknown error"}\ndigest: ${error.digest || "none"}\ntimestamp: ${new Date().toISOString()}`;
    // console.log("copying error stack to clipboard");
    navigator.clipboard.writeText(errorDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden select-none">
      {/* decorative ambient glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl text-center space-y-6 p-8 rounded-2xl border border-rose-500/30 bg-card/70 backdrop-blur-md shadow-2xl">
        {/* status badge */}
        <div className="flex items-center justify-center">
          <Badge
            variant="destructive"
            className="text-xs font-mono py-1 px-3 gap-1.5 bg-rose-500/10 text-rose-500 border-rose-500/30"
          >
            <ShieldAlert className="size-3.5" />
            <span>application runtime exception</span>
          </Badge>
        </div>

        {/* graphic icon */}
        <div className="flex items-center justify-center py-2">
          <div className="size-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-inner">
            <AlertTriangle className="size-10" />
          </div>
        </div>

        {/* headline and descriptive message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            something went unexpectedly wrong
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            an unhandled runtime error was intercepted by the global error
            boundary. you can retry the current operation or return to the
            dashboard.
          </p>
        </div>

        {/* error diagnostic block with copy action */}
        <div className="p-4 rounded-xl border border-border/70 bg-muted/50 font-mono text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              exception telemetry
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyError}
              className="h-6 px-2 text-[10px] gap-1 hover:text-foreground text-muted-foreground"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span>copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>copy error</span>
                </>
              )}
            </Button>
          </div>

          <div className="text-rose-400 font-semibold break-words">
            {error.message || "an unknown client execution fault occurred."}
          </div>

          {error.digest && (
            <div className="text-[10px] text-muted-foreground pt-1 border-t border-border/40 font-mono">
              digest id: {error.digest}
            </div>
          )}
        </div>

        {/* action recovery buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto h-9 text-xs font-semibold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
          >
            <RotateCcw className="size-3.5" />
            <span>try again (recover)</span>
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto h-9 text-xs gap-1.5"
            >
              <LayoutDashboard className="size-3.5 text-primary" />
              <span>dashboard overview</span>
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto h-9 text-xs gap-1.5 hover:text-primary"
            >
              <Home className="size-3.5" />
              <span>homepage</span>
            </Button>
          </Link>
        </div>

        {/* copyright and support footer */}
        <div className="pt-4 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>devassess engineering platform</span>
          <Link
            href="/contact"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >
            contact engineering team
          </Link>
        </div>
      </div>
    </div>
  );
}
