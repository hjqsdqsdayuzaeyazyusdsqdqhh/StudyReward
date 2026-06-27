import { z } from "zod"
import { VALIDATION, UUID_REGEX } from "../constants"

export const CreateFAQSchema = z.object({
  question: z
    .string()
    .min(VALIDATION.QUESTION_MIN_LENGTH, `Question must be at least ${VALIDATION.QUESTION_MIN_LENGTH} characters`)
    .max(VALIDATION.QUESTION_MAX_LENGTH, `Question must be at most ${VALIDATION.QUESTION_MAX_LENGTH} characters`),
  answer: z
    .string()
    .min(VALIDATION.ANSWER_MIN_LENGTH, `Answer must be at least ${VALIDATION.ANSWER_MIN_LENGTH} characters`)
    .max(VALIDATION.ANSWER_MAX_LENGTH, `Answer must be at most ${VALIDATION.ANSWER_MAX_LENGTH} characters`),
  opportunityId: z
    .string()
    .regex(UUID_REGEX, "Opportunity ID must be a valid UUID")
    .optional(),
})

export const UpdateFAQSchema = CreateFAQSchema.partial()
