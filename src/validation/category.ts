import { z } from "zod"
import { VALIDATION, SLUG_REGEX } from "../constants"

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters`),
  slug: z
    .string()
    .min(VALIDATION.SLUG_MIN_LENGTH, `Slug must be at least ${VALIDATION.SLUG_MIN_LENGTH} characters`)
    .max(VALIDATION.SLUG_MAX_LENGTH, `Slug must be at most ${VALIDATION.SLUG_MAX_LENGTH} characters`)
    .regex(SLUG_REGEX, "Slug must be lowercase alphanumeric with hyphens"),
  icon: z
    .string()
    .min(VALIDATION.ICON_MIN_LENGTH)
    .max(VALIDATION.ICON_MAX_LENGTH)
    .optional()
    .default("FlaskConical"),
  description: z
    .string()
    .max(VALIDATION.DESCRIPTION_MAX_LENGTH)
    .optional(),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()
