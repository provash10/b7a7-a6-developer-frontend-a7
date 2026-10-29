import {
  Code2,
  Compass,
  FileQuestion,
  Home,
  LayoutDashboard,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 - Page Not Found | DevAssess",
  description:
    "The requested developer assessment or dashboard page could not be located.",
};

export default function NotFound() {
  // console.log("global not found page rendered");

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden select-none">
      {/* decorative ambient glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 size-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl text-center space-y-6 p-8 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-2xl">
        {/* status badge */}
        <div className="flex items-center justify-center">
          <Badge
            variant="outline"
            className="text-xs font-mono py-1 px-3 border-primary/30 text-primary gap-1.5 bg-primary/5"
          >
            <FileQuestion className="size-3.5" />
            <span>error 404 • resource not found</span>
          </Badge>
        </div>

        {/* graphic display */}
        <div className="relative py-4">
          <div className="text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/70 to-foreground/20 font-mono">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <Code2 className="size-36 text-primary" />
          </div>
        </div>

        {/* headline and descriptive message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            assessment or page not found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            the coding challenge, dashboard link, or candidate scorecard you are
            trying to access does not exist, has expired, or was relocated.
          </p>
        </div>

        {/* diagnostic terminal block */}
        <div className="p-3 rounded-xl border border-border/60 bg-muted/40 font-mono text-left text-[11px] text-muted-foreground space-y-1">
          <div className="flex items-center gap-2 text-foreground/80 font-medium">
            <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
            <span>http status: 404 not_found</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            hint: verify the requested url or return to the platform navigation
            roots below.
          </p>
        </div>

        {/* navigation action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="default"
              size="sm"
              className="w-full sm:w-auto h-9 text-xs font-semibold gap-1.5"
            >
              <Home className="size-3.5" />
              <span>return to home</span>
            </Button>
          </Link>

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

          <Link href="/services" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto h-9 text-xs gap-1.5 hover:text-primary"
            >
              <Compass className="size-3.5" />
              <span>browse tests</span>
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
            report broken link
          </Link>
        </div>
      </div>
    </div>
  );
}
