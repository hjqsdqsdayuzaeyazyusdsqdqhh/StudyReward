import type { BaseProvider } from "../providers/base/BaseProvider"
import type { ProviderRegistry } from "../providers/registry"
import type { SyncResult, SyncStatus } from "../types"

export class SyncEngine {
  private registry: ProviderRegistry
  private currentStatus: SyncStatus = "idle"
  private abortController: AbortController | null = null

  constructor(registry: ProviderRegistry) {
    this.registry = registry
  }

  get status(): SyncStatus {
    return this.currentStatus
  }

  async syncAll(): Promise<SyncResult[]> {
    if (this.currentStatus === "running") {
      throw new Error("Sync is already running")
    }

    this.currentStatus = "running"
    this.abortController = new AbortController()
    const results: SyncResult[] = []

    try {
      const providers = this.registry.getEnabled()
      for (const provider of providers) {
        if (this.abortController.signal.aborted) {
          this.currentStatus = "cancelled"
          return results
        }
        const result = await provider.sync()
        results.push(result)
      }
      this.currentStatus = "completed"
    } catch {
      this.currentStatus = "failed"
    }

    return results
  }

  async syncProvider(providerId: string): Promise<SyncResult> {
    const provider = this.registry.get(providerId)
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }
    return provider.sync()
  }

  async syncWithFallback(providerId: string): Promise<SyncResult> {
    const provider = this.registry.get(providerId)
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }

    try {
      await provider.connect()
      return await provider.sync()
    } catch {
      const fallbacks = this.registry.getFallbackChain(providerId)
      for (const fallback of fallbacks) {
        try {
          await fallback.connect()
          return await fallback.sync()
        } catch {
          continue
        }
      }
      throw new Error(`All providers failed for ${providerId}`)
    }
  }

  cancel(): void {
    if (this.abortController) {
      this.abortController.abort()
      this.currentStatus = "cancelled"
    }
  }
}
