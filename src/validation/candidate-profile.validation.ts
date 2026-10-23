import { z } from "zod";

// candidate profile validation schema
export const candidateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "full name must be at least 2 characters." })
    .max(60, { message: "full name cannot exceed 60 characters." }),
  email: z.string().email({ message: "please provide a valid email address." }),
  phone: z
    .string()
    .max(20, { message: "phone number cannot exceed 20 characters." })
    .optional()
    .or(z.literal("")),
  headline: z
    .string()
    .min(2, { message: "headline must be at least 2 characters." })
    .max(100, { message: "headline cannot exceed 100 characters." }),
  location: z
    .string()
    .max(80, { message: "location cannot exceed 80 characters." })
    .optional()
    .or(z.literal("")),
  experienceYears: z.coerce
    .number({ message: "experience years must be a valid number." })
    .min(0, { message: "experience years cannot be negative." })
    .max(50, { message: "experience years cannot exceed 50." }),
  githubUrl: z
    .string()
    .refine(
      (val) =>
        !val ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("github.com/"),
      { message: "please enter a valid github url." },
    )
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .refine(
      (val) =>
        !val ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("www."),
      { message: "please enter a valid portfolio website url." },
    )
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .refine(
      (val) =>
        !val ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("linkedin.com/"),
      { message: "please enter a valid linkedin profile url." },
    )
    .optional()
    .or(z.literal("")),
  resumeUrl: z
    .string()
    .refine(
      (val) =>
        !val ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.endsWith(".pdf") ||
        val.includes("drive.google.com"),
      {
        message:
          "please enter a valid resume or document url (pdf or cloud drive).",
      },
    )
    .optional()
    .or(z.literal("")),
  skills: z
    .array(z.string().min(1))
    .min(1, { message: "please specify at least 1 technical skill." }),
  preferredRole: z
    .string()
    .max(60, { message: "preferred role cannot exceed 60 characters." })
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(1200, { message: "bio summary cannot exceed 1200 characters." })
    .optional()
    .or(z.literal("")),
  isAvailableForHire: z.boolean().default(true),
});

export type CandidateProfileFormData = z.infer<typeof candidateProfileSchema>;
