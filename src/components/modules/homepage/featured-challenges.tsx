"use client";

import { ArrowRight, Code2, Play, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FeaturedChallenges() {
  const challenges = [
    {
      title: "Asynchronous Token Bucket Rate Limiter",
      language: "TypeScript",
      difficulty: "Hard",
      category: "Backend Systems",
      timeLimit: "45 mins",
      testsCount: 16,
      difficultyClass: "bg-red-500/10 text-red-500 border-red-500/20",
      description:
        "Implement a thread-safe token bucket rate limiter in Node.js supporting burst capacity, sliding intervals, and automatic refill.",
    },
    {
      title: "Optimized LRU Cache with TTL Eviction",
      language: "TypeScript",
      difficulty: "Medium",
      category: "Data Structures",
      timeLimit: "35 mins",
      testsCount: 12,
      difficultyClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      description:
        "Build an O(1) Least Recently Used cache with doubly-linked lists and timestamp-based TTL cleanup guarantees.",
    },
    {
      title: "React 19 Custom Form Hook with Debounce",
      language: "React",
      difficulty: "Medium",
      category: "Frontend Architecture",
      timeLimit: "30 mins",
      testsCount: 10,
      difficultyClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      description:
        "Create a type-safe form validation hook with schema parsing, dirty state tracking, and asynchronous server validation.",
    },
    {
      title: "Balanced Binary Search Tree Rotations",
      language: "Python",
      difficulty: "Easy",
      category: "Algorithms",
      timeLimit: "25 mins",
      testsCount: 8,
      difficultyClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      description:
        "Implement self-balancing AVL tree left and right rotations with complete invariant checks and node height recalculation.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Terminal className="size-3.5" />
              <span>Assessment Catalog Preview</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Battle-Tested Challenges for Every Level
            </h2>
            <p className="text-muted-foreground text-base max-w-xl">
              Real code puzzles designed to evaluate architecture, performance, edge cases, and algorithmic rigor.
            </p>
          </div>
          <Link href="/services#code-assessment">
            <Button variant="outline" className="gap-2 font-semibold cursor-pointer">
              <span>View All Challenges</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-muted text-foreground">
                      {c.language}
                    </span>
                    <span className="text-xs text-muted-foreground">• {c.category}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${c.difficultyClass}`}
                  >
                    {c.difficulty}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {c.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span>⏱ {c.timeLimit}</span>
                  <span>•</span>
                  <span>✓ {c.testsCount} Test Cases</span>
                </div>
                <Link href="/services#code-assessment">
                  <Button size="sm" variant="ghost" className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10 text-xs font-semibold cursor-pointer">
                    <Play className="size-3.5 fill-current" />
                    <span>Run in Sandbox</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
