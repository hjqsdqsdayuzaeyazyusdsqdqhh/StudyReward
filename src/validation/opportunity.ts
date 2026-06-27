import { z } from "zod"
import { VALIDATION, SLUG_REGEX, UUID_REGEX } from "../constants"
import { CompensationTypeEnum, OpportunityStatusEnum } from "./enums"

export const CreateOpportunitySchema = z.object({
  title: z
    .string()
    .min(VALIDATION.TITLE_MIN_LENGTH, `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`)
    .max(VALIDATION.TITLE_MAX_LENGTH, `Title must be at most ${VALIDATION.TITLE_MAX_LENGTH} characters`),
  slug: z
    .string()
    .min(VALIDATION.SLUG_MIN_LENGTH, `Slug must be at least ${VALIDATION.SLUG_MIN_LENGTH} characters`)
    .max(VALIDATION.SLUG_MAX_LENGTH, `Slug must be at most ${VALIDATION.SLUG_MAX_LENGTH} characters`)
    .regex(SLUG_REGEX, "Slug must be lowercase alphanumeric with hyphens"),
  shortDescription: z
    .string()
    .min(VALIDATION.DESCRIPTION_MIN_LENGTH, `Description must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters`)
    .max(VALIDATION.DESCRIPTION_MAX_LENGTH, `Description must be at most ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`),
  description: z
    .string()
    .max(VALIDATION.DESCRIPTION_MAX_LENGTH)
    .optional(),
  companyId: z
    .string()
    .regex(UUID_REGEX, "Company ID must be a valid UUID"),
  categoryId: z
    .string()
    .regex(UUID_REGEX, "Category ID must be a valid UUID"),
  studyTypeId: z
    .string()
    .regex(UUID_REGEX, "Study type ID must be a valid UUID"),
  stateId: z
    .string()
    .regex(UUID_REGEX, "State ID must be a valid UUID"),
  cityId: z
    .string()
    .regex(UUID_REGEX, "City ID must be a valid UUID"),
  compensation: z
    .string()
    .min(VALIDATION.COMPENSATION_MIN_LENGTH)
    .max(VALIDATION.COMPENSATION_MAX_LENGTH),
  compensationType: CompensationTypeEnum.optional(),
  online: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  status: OpportunityStatusEnum.optional().default("Active"),
  eligibility: z
    .string()
    .max(VALIDATION.ELIGIBILITY_MAX_LENGTH)
    .optional(),
  postedDate: z
    .string()
    .datetime("Posted date must be a valid ISO datetime")
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
})

export const UpdateOpportunitySchema = CreateOpportunitySchema.partial()
