// types for evaluator profile and review availability configuration
// console.log("recruiter profile types loaded");

export interface EvaluatorProfile {
  fullName: string;
  email: string;
  headline: string;
  company: string;
  bio: string;
  experienceYears: number;
  rating: number;
  totalReviewsCompleted: number;
  expertiseDomains: string[];
  tier: string;
  timezone: string;
  isAvailableForReviews: boolean;
  maxReviewsPerDay: number;
  slaHours: number;
  activeDays: string[];
  autoAcceptTests: boolean;
  emailNotifications: boolean;
  urgentSmsNotifications: boolean;
}
