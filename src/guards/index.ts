import { UUID_REGEX, SLUG_REGEX, URL_REGEX } from "../constants"

export function isUUID(value: string): boolean {
  return UUID_REGEX.test(value)
}

export function isSlug(value: string): boolean {
  return SLUG_REGEX.test(value)
}

export function isURL(value: string): boolean {
  return URL_REGEX.test(value)
}

export function isState(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.slug === "string" &&
    typeof obj.abbreviation === "string"
  )
}

export function isOpportunity(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.slug === "string" &&
    typeof obj.compensation === "string"
  )
}
