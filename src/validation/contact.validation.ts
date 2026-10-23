import { z } from "zod";

// contact message form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "name must be at least 2 characters." })
    .max(60, { message: "name cannot exceed 60 characters." }),
  email: z.string().email({ message: "please enter a valid email address." }),
  subject: z
    .string()
    .min(3, { message: "subject must be at least 3 characters." })
    .max(120, { message: "subject cannot exceed 120 characters." }),
  category: z
    .enum(
      ["TECHNICAL_SUPPORT", "ASSESSMENT_INQUIRY", "BILLING", "ENTERPRISE_DEMO"],
      {
        message: "please select a valid inquiry category.",
      },
    )
    .default("TECHNICAL_SUPPORT"),
  message: z
    .string()
    .min(10, { message: "message must be at least 10 characters." })
    .max(2000, { message: "message cannot exceed 2000 characters." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
