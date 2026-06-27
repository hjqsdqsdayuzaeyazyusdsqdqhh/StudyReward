import { z } from "zod"

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: { path: string; message: string }[]
}

function formatZodIssues(issues: { path: (string | number | symbol)[]; message: string }[]): { path: string; message: string }[] {
  return issues.map((e) => ({
    path: e.path.filter((p): p is string | number => typeof p !== "symbol").join("."),
    message: e.message,
  }))
}

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

export function validateQuery<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

export function validateParams<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: formatZodIssues(result.error.issues) }
}

export function safeParseAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  return Promise.resolve(safeParse(schema, data))
}
