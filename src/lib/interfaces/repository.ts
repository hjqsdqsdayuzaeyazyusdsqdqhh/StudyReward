import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface IRepository<TModel, TCreate, TUpdate> {
  findAll(): Promise<TModel[]>
  findById(id: string): Promise<TModel | null>
  findBySlug(slug: string): Promise<TModel | null>
  create(data: TCreate): Promise<TModel>
  update(id: string, data: TUpdate): Promise<TModel>
  delete(id: string): Promise<TModel>
  exists(id: string): Promise<boolean>
  count(): Promise<number>
  paginate(params?: PaginationParams): Promise<PaginatedResult<TModel>>
  search(params: SearchParams & PaginationParams): Promise<PaginatedResult<TModel>>
}
