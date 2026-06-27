export interface ConflictResult {
  hasConflict: boolean
  existingValue: unknown
  incomingValue: unknown
  field: string
  resolution?: "keep_existing" | "use_incoming" | "merge"
}

export class ConflictDetector {
  detect<T extends Record<string, unknown>>(
    existing: T,
    incoming: T,
    trackedFields: string[],
  ): ConflictResult[] {
    const conflicts: ConflictResult[] = []

    for (const field of trackedFields) {
      const existingVal = existing[field]
      const incomingVal = incoming[field]

      if (existingVal !== undefined && incomingVal !== undefined && existingVal !== incomingVal) {
        conflicts.push({
          hasConflict: true,
          existingValue: existingVal,
          incomingValue: incomingVal,
          field,
        })
      }
    }

    return conflicts
  }

  resolve<T extends Record<string, unknown>>(
    existing: T,
    incoming: T,
    strategy: "keep_existing" | "use_incoming" | "newer_wins",
    trackedFields: string[],
  ): T {
    if (strategy === "use_incoming") {
      return { ...existing, ...incoming }
    }

    if (strategy === "keep_existing") {
      return { ...existing }
    }

    if (strategy === "newer_wins") {
      const existingUpdated = existing.updatedAt as string | Date | undefined
      const incomingUpdated = incoming.updatedAt as string | Date | undefined

      if (incomingUpdated && existingUpdated && new Date(incomingUpdated) > new Date(existingUpdated)) {
        for (const field of trackedFields) {
          (existing as Record<string, unknown>)[field] = incoming[field]
        }
      }
      return existing
    }

    return existing
  }
}
