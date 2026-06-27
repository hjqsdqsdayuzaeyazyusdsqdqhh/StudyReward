import type {
  CacheConfig,
  CronConfig,
  ProviderSettings,
  RetryConfig,
  SyncConfig,
} from "../types"

export interface IntegrationConfig {
  providers: Record<string, ProviderSettings>
  sync: SyncConfig
  retry: RetryConfig
  cache: CacheConfig
  cron: CronConfig
  concurrency: number
  maxBatchSize: number
}

const DEFAULT_CONFIG: IntegrationConfig = {
  providers: {},
  sync: {
    strategy: "incremental",
    interval: 3600,
    batchSize: 100,
  },
  retry: {
    maxRetries: 3,
    initialDelay: 1000,
    backoff: "exponential",
    maxDelay: 30000,
  },
  cache: {
    ttl: 300,
    maxSize: 1000,
  },
  cron: {
    expression: "0 0 * * *",
    timezone: "UTC",
  },
  concurrency: 5,
  maxBatchSize: 500,
}

let currentConfig: IntegrationConfig = { ...DEFAULT_CONFIG }

export class ConfigEngine {
  get<K extends keyof IntegrationConfig>(key: K): IntegrationConfig[K] {
    return currentConfig[key]
  }

  getAll(): IntegrationConfig {
    return { ...currentConfig }
  }

  set<K extends keyof IntegrationConfig>(key: K, value: IntegrationConfig[K]): void {
    currentConfig = { ...currentConfig, [key]: value }
  }

  reset(): void {
    currentConfig = { ...DEFAULT_CONFIG }
  }

  getProviderSettings(providerId: string): ProviderSettings | undefined {
    return currentConfig.providers[providerId]
  }

  setProviderSettings(providerId: string, settings: ProviderSettings): void {
    currentConfig = {
      ...currentConfig,
      providers: { ...currentConfig.providers, [providerId]: settings },
    }
  }

  getRetryConfig(overrides?: Partial<RetryConfig>): RetryConfig {
    return { ...currentConfig.retry, ...overrides }
  }

  getSyncConfig(overrides?: Partial<SyncConfig>): SyncConfig {
    return { ...currentConfig.sync, ...overrides }
  }

  getCacheConfig(overrides?: Partial<CacheConfig>): CacheConfig {
    return { ...currentConfig.cache, ...overrides }
  }
}
