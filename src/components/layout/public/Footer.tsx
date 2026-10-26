"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Code2, Github, Globe, Heart, Shield, Terminal, Twitter } from "lucide-react";
import Logo from "@/assets/svg/logo";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const productLinks = [
    { label: "Interactive Sandbox", href: "/services#code-assessment" },
    { label: "Challenge Catalog", href: "/services" },
    { label: "Pricing & Credits", href: "/pricing" },
    { label: "Anti-Cheat Telemetry", href: "/about-us" },
  ];

  const platformLinks = [
    { label: "About DevAssess", href: "/about-us" },
    { label: "Services & Features", href: "/services" },
    { label: "Contact Support", href: "/contact" },
    { label: "Recruiter Portal", href: "/login" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security & Proctoring", href: "#" },
    { label: "Compliance & GDPR", href: "#" },
  ];

  return (
    <footer className="w-full border-t border-border/80 bg-card text-foreground">
      {/* Upper Footer: Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading font-extrabold text-xl text-foreground hover:opacity-90 transition-opacity"
            >
              <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Logo className="text-primary size-6" />
              </div>
              <span className="tracking-tight">DevAssess</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The next-generation technical hiring and code assessment platform. Evaluate candidates with real-world Docker sandboxes, automated test scoring, and intelligent proctoring telemetry.
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Evaluation Sandboxes Operational</span>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {productLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {platformLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Security Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Footer: Copyright & Attribution */}
      <div className="border-t border-border/60 bg-muted/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} DevAssess. All rights reserved. Technical Evaluation & Certification.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Supported payments: <strong className="font-semibold text-foreground">bKash</strong>, <strong className="font-semibold text-foreground">Cards</strong>
            </span>
            <span>•</span>
            <Link href="/services#code-assessment" className="text-primary hover:underline font-medium">
              Run Sandbox
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
