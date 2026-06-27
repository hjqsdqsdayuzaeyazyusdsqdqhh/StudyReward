import { z } from "zod"
import { VALIDATION, SLUG_REGEX, URL_REGEX } from "../constants"

export const CreateCompanySchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters`),
  slug: z
    .string()
    .min(VALIDATION.SLUG_MIN_LENGTH, `Slug must be at least ${VALIDATION.SLUG_MIN_LENGTH} characters`)
    .max(VALIDATION.SLUG_MAX_LENGTH, `Slug must be at most ${VALIDATION.SLUG_MAX_LENGTH} characters`)
    .regex(SLUG_REGEX, "Slug must be lowercase alphanumeric with hyphens"),
  logo: z
    .string()
    .max(VALIDATION.LOGO_MAX_LENGTH)
    .url("Logo must be a valid URL")
    .optional(),
  website: z
    .string()
    .max(VALIDATION.URL_MAX_LENGTH)
    .regex(URL_REGEX, "Website must be a valid HTTP or HTTPS URL")
    .optional(),
  description: z
    .string()
    .max(VALIDATION.DESCRIPTION_MAX_LENGTH)
    .optional(),
})

export const UpdateCompanySchema = CreateCompanySchema.partial()
