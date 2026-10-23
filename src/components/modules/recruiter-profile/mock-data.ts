// mock evaluator profile and availability preferences
// console.log("recruiter profile mock data loaded");

import type { EvaluatorProfile } from "./types";

export const initialEvaluatorProfile: EvaluatorProfile = {
  fullName: "Provash Kumar",
  email: "provash10@gmail.com",
  headline: "Principal Systems Architect & Technical Assessment Lead",
  company: "DevAssess Certified Evaluator Network",
  bio: "10+ years architecting scalable cloud-native distributed microservices in Go, Rust, and TypeScript. Passionate about code readability, deterministic consensus algorithms, and rigorous technical interview grading.",
  experienceYears: 10,
  rating: 4.98,
  totalReviewsCompleted: 112,
  expertiseDomains: [
    "Go",
    "Distributed Systems",
    "Rust",
    "TypeScript",
    "Kubernetes CRD",
    "Next.js",
    "PostgreSQL",
    "Microservices",
  ],
  tier: "Tier 1 Master Evaluator",
  timezone: "Asia/Dhaka (GMT+6)",
  isAvailableForReviews: true,
  maxReviewsPerDay: 6,
  slaHours: 4,
  activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  autoAcceptTests: true,
  emailNotifications: true,
  urgentSmsNotifications: false,
};
