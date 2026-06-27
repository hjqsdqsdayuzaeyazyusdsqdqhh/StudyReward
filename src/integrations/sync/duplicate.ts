import { DuplicateError } from "../errors"

export interface DuplicateConfig {
  matchFields: string[]
  caseSensitive: boolean
}

export interface DuplicateMatch {
  isDuplicate: boolean
  matchedField: string
  matchedValue: string
}

export class DuplicateDetector {
  private seen: Map<string, Set<string>> = new Map()
  private config: DuplicateConfig

  constructor(config?: Partial<DuplicateConfig>) {
    this.config = {
      matchFields: config?.matchFields ?? ["slug"],
      caseSensitive: config?.caseSensitive ?? true,
    }
  }

  check<T extends Record<string, unknown>>(item: T): DuplicateMatch {
    for (const field of this.config.matchFields) {
      const value = item[field]
      if (value === undefined || value === null) continue

      const strValue = String(value)
      const normalized = this.config.caseSensitive ? strValue : strValue.toLowerCase()

      if (!this.seen.has(field)) {
        this.seen.set(field, new Set())
      }

      if (this.seen.get(field)!.has(normalized)) {
        return { isDuplicate: true, matchedField: field, matchedValue: strValue }
      }

      this.seen.get(field)!.add(normalized)
    }

    return { isDuplicate: false, matchedField: "", matchedValue: "" }
  }

  checkAndThrow<T extends Record<string, unknown>>(item: T): void {
    const result = this.check(item)
    if (result.isDuplicate) {
      throw new DuplicateError(
        `Duplicate detected: ${result.matchedField}=${result.matchedValue}`,
      )
    }
  }

  reset(): void {
    this.seen.clear()
  }

  remove(field: string, value: string): void {
    const values = this.seen.get(field)
    if (values) {
      values.delete(value)
    }
  }
}
