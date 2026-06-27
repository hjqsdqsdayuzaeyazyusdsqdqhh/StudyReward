export type SortOrder = "asc" | "desc"

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: SortOrder
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface SearchParams {
  query: string
  fields?: string[]
}
