import { z } from "zod";

/**
 * Shared contact enquiry schema — the single source of truth used by both the
 * client form (react-hook-form) and the server API route, so validation cannot
 * drift between them.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell me your name.")
    .max(120, "That name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "I need an email to reply to.")
    .email("That email does not look right."),
  company: z
    .string()
    .trim()
    .max(160, "That company name is too long.")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .max(300, "That URL is too long.")
    .optional()
    .or(z.literal("")),
  projectType: z
    .string()
    .trim()
    .max(120, "That project type is too long.")
    .optional()
    .or(z.literal("")),
  budget: z
    .string()
    .trim()
    .max(80, "That budget range is too long.")
    .optional()
    .or(z.literal("")),
  timeline: z
    .string()
    .trim()
    .max(80, "That timeline is too long.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a little more about what is not working.")
    .max(4000, "That message is too long — please keep it under 4000 characters."),
  // Honeypot — must be empty. Bots fill it; humans never see it.
  company_website: z
    .string()
    .max(0, "Spam detected.")
    .optional()
    .or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const projectTypeOptions = [
  "Corporate / business website",
  "Ecommerce / buying system",
  "SaaS / operational product",
  "Brand experience / creative",
  "Something else",
] as const;

export const budgetOptions = [
  "Under ₹1,50,000",
  "₹1,50,000 – ₹4,00,000",
  "₹4,00,000 – ₹10,00,000",
  "Above ₹10,00,000",
  "Not sure yet",
] as const;

export const timelineOptions = [
  "ASAP",
  "Next 1–2 months",
  "Next quarter",
  "Just exploring",
] as const;
