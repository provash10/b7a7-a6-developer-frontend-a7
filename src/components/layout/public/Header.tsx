"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Sparkles, Terminal, X } from "lucide-react";
import Logo from "@/assets/svg/logo";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routes = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Services",
      url: "/services",
    },
    {
      name: "Pricing",
      url: "/pricing",
    },
    {
      name: "About Us",
      url: "/about-us",
    },
    {
      name: "Contact",
      url: "/contact",
    },
  ];

  return (
    <header className="w-full h-18 border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading font-extrabold text-xl text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="p-1.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Logo className="text-primary size-7" />
          </div>
          <span className="tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text">
            DevAssess
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/40">
          {routes.map((route) => {
            const isActive =
              route.url === "/"
                ? pathname === "/"
                : pathname === route.url || pathname.startsWith(`${route.url}/`);

            return (
              <Link
                key={route.url}
                href={route.url}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-background text-primary shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {route.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="font-semibold text-sm hover:bg-muted cursor-pointer"
            >
              Login
            </Button>
          </Link>
          <Link href="/services#code-assessment">
            <Button
              size="sm"
              className="gap-2 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 rounded-lg cursor-pointer"
            >
              <Terminal className="size-3.5" />
              <span>Try Sandbox</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-2">
          {routes.map((route) => {
            const isActive =
              route.url === "/"
                ? pathname === "/"
                : pathname === route.url || pathname.startsWith(`${route.url}/`);

            return (
              <Link
                key={route.url}
                href={route.url}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {route.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="outline" className="w-full font-semibold">
                Login
              </Button>
            </Link>
            <Link
              href="/services#code-assessment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button className="w-full font-bold bg-primary text-primary-foreground gap-2">
                <Terminal className="size-4" />
                <span>Try Sandbox</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
