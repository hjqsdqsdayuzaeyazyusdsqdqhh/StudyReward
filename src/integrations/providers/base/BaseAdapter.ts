import type { BatchConfig } from "../../types"

export abstract class BaseAdapter<TRaw = unknown, TNormalized = unknown> {
  constructor(public readonly providerId: string) {}

  abstract parse(raw: TRaw): Promise<TNormalized>

  abstract parseBatch(raw: TRaw[], config?: BatchConfig): Promise<TNormalized[]>
}
