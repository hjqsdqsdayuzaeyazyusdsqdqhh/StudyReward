export abstract class BaseTransformer<TNormalized = unknown, TCreate = unknown, TUpdate = unknown> {
  abstract toCreate(data: TNormalized): Promise<TCreate>

  abstract toUpdate(data: TNormalized): Promise<TUpdate>

  abstract toCreateBatch(data: TNormalized[]): Promise<TCreate[]>
}
