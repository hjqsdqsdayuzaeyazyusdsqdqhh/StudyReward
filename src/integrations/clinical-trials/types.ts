import { z } from "zod"

export const ClinicalTrialLocationSchema = z.object({
  facility: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().optional(),
})

export type NormalizedLocation = z.infer<typeof ClinicalTrialLocationSchema>

export const InterventionSchema = z.object({
  type: z.string(),
  name: z.string(),
})

export const NormalizedClinicalTrialSchema = z.object({
  nctId: z.string().min(5).max(15),
  title: z.string().min(1).max(500),
  summary: z.string().min(1).max(10000),
  description: z.string().max(100000).optional(),
  status: z.enum(["Active", "Upcoming", "Filled"]),
  conditions: z.array(z.string().min(1)).min(1),
  interventions: z.array(InterventionSchema).optional(),
  studyType: z.string().min(1),
  phases: z.array(z.string()),
  eligibility: z.string().optional(),
  gender: z.string().optional(),
  minAge: z.string().optional(),
  maxAge: z.string().optional(),
  healthyVolunteers: z.string().optional(),
  sponsor: z.string().min(1),
  locations: z.array(ClinicalTrialLocationSchema).min(1),
  lastUpdated: z.string().optional(),
  studyUrl: z.string().optional(),
})

export type NormalizedClinicalTrial = z.infer<typeof NormalizedClinicalTrialSchema>
