import { Code2, ExternalLink, Globe, Layers, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const TEAM = [
  {
    name: "Provash Kumar",
    role: "Lead Platform Architect & Full Stack Engineer",
    bio: "Passionate about high-performance web systems, Next.js architecture, and isolated sandboxed code execution.",
    skills: ["Next.js", "TypeScript", "PostgreSQL", "Docker", "Algorithms"],
    avatarText: "PK",
    github: "https://github.com/provash10",
  },
  {
    name: "Sarah Lin, Ph.D.",
    role: "Head of Algorithmic Benchmarks",
    bio: "Former competitive programmer and algorithmic research specialist. Curates our 1,200+ multi-difficulty question banks.",
    skills: ["Data Structures", "Dynamic Programming", "Python", "Go"],
    avatarText: "SL",
  },
  {
    name: "Tariqul Islam",
    role: "Principal Infrastructure & Security Engineer",
    bio: "Focuses on container sandboxing, anti-cheat heuristic proctoring, and low-latency test execution runners.",
    skills: ["Docker", "Linux Kernel Sandboxing", "Node.js", "DevOps"],
    avatarText: "TI",
  },
  {
    name: "Elena Rostova",
    role: "Director of Technical Talent Acquisition",
    bio: "10+ years leading technical recruiting at global tech enterprises. Designed our recruiter analytics & candidate scorecard UI.",
    skills: ["Technical Sourcing", "Evaluation SLAs", "Talent Intelligence"],
    avatarText: "ER",
  },
];

export function AboutTeam() {
  return (
    <section className="py-16 md:py-24 bg-card/40 border-t border-border/40">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <User className="size-3.5" />
            <span>Meet The Builders</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Built by Engineers, for Engineers
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Our multidisciplinary team combines software engineering, competitive programming, and technical recruiting expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-border/70 bg-background/80 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              <div>
                {/* avatar circle */}
                <div className="size-14 rounded-full bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-primary-foreground font-black text-lg mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  {member.avatarText}
                </div>

                <h3 className="text-base font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="text-xs font-medium text-primary mt-1">
                  {member.role}
                </p>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-semibold bg-primary/5 text-primary/80 border border-primary/20 rounded px-1.5 py-0.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
