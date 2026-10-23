import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password Must Minimum 8 Characters Long.")
    .regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
    .regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
    .regex(/[0-9]/, "Password must contain at least 1 Number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 Special Character",
    ),
});

export const LoginSchema = loginSchema;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must not exceed 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    contactNumber: z
      .string()
      .refine((val) => !val || val === "" || /^(?:\+?880|0)1[3-9]\d{8}$/.test(val), {
        message: "Please provide valid Bangladeshi number (e.g. 017xxxxxxxx)",
      })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least 1 special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const RegisterSchema = registerSchema;
export const patientRegistrationSchema = registerSchema;
export const PatientRegistrationZodSchema = registerSchema;

//* GP - 017, 013
//* BL - 019, 014
//* Airtel - 016
//* Robi - 018
//* TeleTalk - 01512345678
//! City Cell - 011 (Already dead)
//! there is no 012
//todo we need to confirm from [3-9]

//? Either +880, 880, 0

export const verifyAccountSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  otp: z.string().min(1, "OTP is required"),
});

export const VerifyAccountSchema = verifyAccountSchema;

export const doctorApplySchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().optional(),
  specialization: z.string().min(1, "Specialization is required"),
  licenseNumber: z.string().min(1, "BMDC registration number is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  experienceYears: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && !isNaN(Number(val)), {
      message: "Years of experience is required",
    }),
  consultationFee: z.union([z.string(), z.number()]).optional(),
  bio: z.string().max(1000, "Bio cannot exceed 1000 characters").optional(),
  resume: z.any().optional(),
});

export const DoctorApplyZodSchema = doctorApplySchema;
