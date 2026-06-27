import type { HealthCheck, HealthStatus, MetricsSnapshot, ProviderMetadata } from "../types"
import type { ProviderRegistry } from "../providers/registry"

export class MonitoringEngine {
  private registry: ProviderRegistry
  private metricsHistory: MetricsSnapshot[] = []
  private maxHistory: number

  constructor(registry: ProviderRegistry, maxHistory = 100) {
    this.registry = registry
    this.maxHistory = maxHistory
  }

  async checkHealth(): Promise<HealthStatus> {
    const checks: HealthCheck[] = []
    const providers = this.registry.getAll()

    for (const provider of providers) {
      const start = Date.now()
      try {
        const healthy = await provider.healthCheck()
        checks.push({
          name: provider.id,
          status: healthy ? "passed" : "failed",
          message: healthy ? undefined : `${provider.name} health check failed`,
          duration: Date.now() - start,
        })
      } catch {
        checks.push({
          name: provider.id,
          status: "failed",
          message: `${provider.name} health check threw an error`,
          duration: Date.now() - start,
        })
      }
    }

    return {
      healthy: checks.every((c) => c.status === "passed"),
      lastCheck: new Date(),
      checks,
    }
  }

  getSnapshot(): MetricsSnapshot {
    const providers = this.registry.getAllMetadata()
    const totalRecords = providers.reduce((sum, p) => sum + p.recordsImported, 0)
    const totalFailed = providers.reduce((sum, p) => sum + p.recordsFailed, 0)
    const totalAttempted = totalRecords + totalFailed
    const successRate = totalAttempted > 0 ? totalRecords / totalAttempted : 1

    const syncDurations = this.metricsHistory.map((m) => m.avgSyncDuration)
    const avgSyncDuration =
      syncDurations.length > 0
        ? syncDurations.reduce((a, b) => a + b, 0) / syncDurations.length
        : 0

    const snapshot: MetricsSnapshot = {
      timestamp: new Date(),
      providers,
      totalRecords,
      successRate,
      avgSyncDuration,
    }

    this.metricsHistory.push(snapshot)
    if (this.metricsHistory.length > this.maxHistory) {
      this.metricsHistory.shift()
    }

    return snapshot
  }

  getProviderStats(providerId: string): ProviderMetadata | undefined {
    return this.registry.get(providerId)?.getMetadata()
  }

  getHistory(): MetricsSnapshot[] {
    return [...this.metricsHistory]
  }
}
