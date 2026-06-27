import { createHash } from "crypto"

export interface ChangeResult {
  hasChanged: boolean
  previousHash: string
  currentHash: string
}

export class ChangeDetector {
  private hashes: Map<string, string> = new Map()

  computeHash(data: Record<string, unknown>, trackedFields: string[]): string {
    const relevant: Record<string, unknown> = {}
    for (const field of trackedFields) {
      if (data[field] !== undefined) {
        relevant[field] = data[field]
      }
    }
    const serialized = JSON.stringify(relevant, Object.keys(relevant).sort())
    return createHash("sha256").update(serialized).digest("hex")
  }

  detect(id: string, data: Record<string, unknown>, trackedFields: string[]): ChangeResult {
    const currentHash = this.computeHash(data, trackedFields)
    const previousHash = this.hashes.get(id) ?? ""

    const hasChanged = previousHash !== "" && previousHash !== currentHash

    if (!this.hashes.has(id)) {
      this.hashes.set(id, currentHash)
    }

    return { hasChanged, previousHash, currentHash }
  }

  update(id: string, data: Record<string, unknown>, trackedFields: string[]): void {
    const hash = this.computeHash(data, trackedFields)
    this.hashes.set(id, hash)
  }

  remove(id: string): void {
    this.hashes.delete(id)
  }

  clear(): void {
    this.hashes.clear()
  }
}
