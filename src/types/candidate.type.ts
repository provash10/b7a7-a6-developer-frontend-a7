// candidate profile type definitions

export interface CandidateProfile {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  headline?: string;
  bio?: string;
  location?: string;
  experienceYears?: number;
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  skills: string[];
  preferredRole?: string;
  isAvailableForHire?: boolean;
}

export interface CandidateSkillCategory {
  category: string;
  skills: string[];
}
