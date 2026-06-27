import type { ProviderMetadata } from "../types"
import { BaseProvider } from "./base/BaseProvider"

type ProviderFactory = () => BaseProvider

export class ProviderRegistry {
  private providers: Map<string, BaseProvider> = new Map()
  private factories: Map<string, ProviderFactory> = new Map()

  register(id: string, providerOrFactory: BaseProvider | ProviderFactory): void {
    if (providerOrFactory instanceof BaseProvider) {
      this.providers.set(id, providerOrFactory)
    } else {
      this.factories.set(id, providerOrFactory)
    }
  }

  unregister(id: string): void {
    this.providers.delete(id)
    this.factories.delete(id)
  }

  get(id: string): BaseProvider | undefined {
    let provider = this.providers.get(id)
    if (!provider && this.factories.has(id)) {
      const factory = this.factories.get(id)!
      provider = factory()
      this.providers.set(id, provider)
      this.factories.delete(id)
    }
    return provider
  }

  getAll(): BaseProvider[] {
    for (const [id, factory] of this.factories) {
      const provider = factory()
      this.providers.set(id, provider)
      this.factories.delete(id)
    }
    return Array.from(this.providers.values())
  }

  getEnabled(): BaseProvider[] {
    return this.getAll().filter((p) => p.config.enabled)
  }

  getByPriority(): BaseProvider[] {
    return this.getAll().sort((a, b) => a.config.priority - b.config.priority)
  }

  getFallbackChain(excludeId: string): BaseProvider[] {
    return this.getEnabled()
      .filter((p) => p.id !== excludeId)
      .sort((a, b) => a.config.priority - b.config.priority)
  }

  async connectAll(): Promise<void> {
    const providers = this.getAll()
    await Promise.all(providers.map((p) => p.connect()))
  }

  async disconnectAll(): Promise<void> {
    const providers = this.getAll()
    await Promise.all(providers.map((p) => p.disconnect()))
  }

  getAllMetadata(): ProviderMetadata[] {
    return this.getAll().map((p) => p.getMetadata())
  }

  exists(id: string): boolean {
    return this.providers.has(id) || this.factories.has(id)
  }

  count(): number {
    return this.providers.size + this.factories.size
  }
}
