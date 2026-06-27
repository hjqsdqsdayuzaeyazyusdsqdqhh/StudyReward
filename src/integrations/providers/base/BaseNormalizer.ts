export abstract class BaseNormalizer<TRaw = unknown, TNormalized = unknown> {
  abstract normalize(data: TRaw): Promise<TNormalized>

  abstract normalizeBatch(data: TRaw[]): Promise<TNormalized[]>
}
