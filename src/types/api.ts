import type { SortOrder } from "../lib/types"

export interface PaginationType {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: SortOrder
}

export interface SearchFiltersType {
  query?: string
  categoryId?: string
  stateId?: string
  cityId?: string
  companyId?: string
  studyTypeId?: string
  status?: string
  online?: boolean
  featured?: boolean
  tags?: string[]
}

export interface ApiResponseType<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: Record<string, unknown>
  }
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ApiListResponseType<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
