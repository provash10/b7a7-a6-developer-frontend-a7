import { ChevronRight, Home, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CandidateProfileView } from "@/components/modules/candidate-profile";
import type { CandidateProfile } from "@/types";

export const metadata: Metadata = {
  title: "Candidate Profile & Skills | DevAssess",
  description:
    "Candidate profile settings, github, portfolio links, and technical skills editor.",
};

// candidate initial profile data
const INITIAL_CANDIDATE_PROFILE: CandidateProfile = {
  userId: "cand-9021",
  name: "Provash Kumar",
  email: "provash10@gmail.com",
  phone: "+880 1712 345678",
  headline: "Senior Full-Stack Engineer (Next.js, TypeScript & Python)",
  location: "Dhaka, Bangladesh (UTC+6)",
  experienceYears: 4,
  githubUrl: "https://github.com/provash10",
  portfolioUrl: "https://provash10.github.io",
  linkedinUrl: "https://linkedin.com/in/provash10",
  resumeUrl: "https://cloud.devassess.io/resumes/provash-kumar-resume.pdf",
  skills: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Tailwind CSS",
    "Docker",
    "Git",
  ],
  preferredRole: "Full Stack Developer",
  bio: "Passionate software engineer focused on building performant web applications, modern frontends with Next.js, and reliable microservices. Experienced in algorithmic optimization, automated testing, and developer platform tooling.",
  isAvailableForHire: true,
};

export default function CandidateProfilePage() {
  // console.log("candidate profile page rendered");

  return (
    <div className="space-y-6 pb-12">
      {/* breadcrumb navigation */}
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="size-3.5" />
          <span>dashboard</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="flex items-center gap-1 font-medium text-foreground">
          <User className="size-3.5 text-primary" />
          <span>profile & settings</span>
        </span>
      </nav>

      {/* main interactive profile module */}
      <CandidateProfileView initialProfile={INITIAL_CANDIDATE_PROFILE} />
    </div>
  );
}
