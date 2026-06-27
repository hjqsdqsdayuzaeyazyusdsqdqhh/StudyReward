import type { BatchConfig, ImportResult, ProviderConfig, ProviderMetadata, ProviderStatus, SyncConfig, SyncResult } from "../../types"
import { ProviderNotConnectedError } from "../../errors"

export abstract class BaseProvider {
  public readonly id: string
  public readonly name: string
  public readonly version: string
  public config: ProviderConfig
  public status: ProviderStatus = "disconnected"

  protected lastSync: Date | null = null
  protected nextSync: Date | null = null
  protected recordsImported = 0
  protected recordsUpdated = 0
  protected recordsFailed = 0

  constructor(id: string, name: string, version: string, config: ProviderConfig) {
    this.id = id
    this.name = name
    this.version = version
    this.config = config
  }

  abstract connect(): Promise<void>

  abstract disconnect(): Promise<void>

  async healthCheck(): Promise<boolean> {
    return this.status === "connected"
  }

  abstract fetch(params?: Record<string, unknown>): Promise<unknown[]>

  abstract import(data: unknown[] | unknown, config?: Partial<BatchConfig>): Promise<ImportResult>

  async sync(config?: Partial<SyncConfig>): Promise<SyncResult> {
    if (this.status !== "connected") {
      throw new ProviderNotConnectedError(this.id)
    }

    const startedAt = new Date()
    const strategy = config?.strategy ?? "incremental"
    const errors: string[] = []
    let recordsFetched = 0
    let recordsImported = 0
    let recordsUpdated = 0
    let recordsFailed = 0
    let skipped = 0

    try {
      const rawData = await this.fetch()
      recordsFetched = rawData.length

      const result = await this.import(rawData, { batchSize: config?.batchSize })
      recordsImported = result.totalSaved
      recordsFailed = result.totalFailed
      recordsUpdated = result.totalSaved
      skipped = rawData.length - result.totalFetched

      for (const err of result.errors) {
        errors.push(`${err.stage}: ${err.message}`)
      }

      this.recordsImported += recordsImported
      this.recordsUpdated += recordsUpdated
      this.recordsFailed += recordsFailed
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      errors.push(message)
      recordsFailed = recordsFetched
      this.recordsFailed += recordsFailed
    }

    const completedAt = new Date()
    this.lastSync = completedAt

    return {
      providerId: this.id,
      strategy,
      startedAt,
      completedAt,
      recordsFetched,
      recordsImported,
      recordsUpdated,
      recordsFailed,
      skipped,
      errors,
    }
  }

  getMetadata(): ProviderMetadata {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      status: this.status,
      lastSync: this.lastSync,
      nextSync: this.nextSync,
      recordsImported: this.recordsImported,
      recordsUpdated: this.recordsUpdated,
      recordsFailed: this.recordsFailed,
    }
  }

  setNextSync(date: Date): void {
    this.nextSync = date
  }
}
