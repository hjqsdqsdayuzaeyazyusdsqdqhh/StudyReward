import { z } from "zod"
import { VALIDATION, SLUG_REGEX, UUID_REGEX } from "../constants"

export const CreateGuideSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.TITLE_MIN_LENGTH, `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`)
    .max(VALIDATION.TITLE_MAX_LENGTH, `Title must be at most ${VALIDATION.TITLE_MAX_LENGTH} characters`),
  slug: z
    .string()
    .min(VALIDATION.SLUG_MIN_LENGTH, `Slug must be at least ${VALIDATION.SLUG_MIN_LENGTH} characters`)
    .max(VALIDATION.SLUG_MAX_LENGTH, `Slug must be at most ${VALIDATION.SLUG_MAX_LENGTH} characters`)
    .regex(SLUG_REGEX, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z
    .string()
    .min(VALIDATION.EXCERPT_MIN_LENGTH, `Excerpt must be at least ${VALIDATION.EXCERPT_MIN_LENGTH} characters`)
    .max(VALIDATION.EXCERPT_MAX_LENGTH, `Excerpt must be at most ${VALIDATION.EXCERPT_MAX_LENGTH} characters`),
  content: z
    .string()
    .max(VALIDATION.DESCRIPTION_MAX_LENGTH)
    .optional(),
  categoryId: z
    .string()
    .regex(UUID_REGEX, "Category ID must be a valid UUID"),
})

export const UpdateGuideSchema = CreateGuideSchema.partial()
