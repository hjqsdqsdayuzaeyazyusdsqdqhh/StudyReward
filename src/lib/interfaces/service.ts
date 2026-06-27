import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface IService<TModel, TCreate, TUpdate> {
  getAll(): Promise<TModel[]>
  getById(id: string): Promise<TModel>
  getBySlug(slug: string): Promise<TModel>
  create(data: TCreate): Promise<TModel>
  update(id: string, data: TUpdate): Promise<TModel>
  delete(id: string): Promise<TModel>
  exists(id: string): Promise<boolean>
  count(): Promise<number>
  paginate(params?: PaginationParams): Promise<PaginatedResult<TModel>>
  search(params: SearchParams & PaginationParams): Promise<PaginatedResult<TModel>>
}
