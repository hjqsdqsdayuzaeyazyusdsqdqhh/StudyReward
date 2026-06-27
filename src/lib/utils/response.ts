import type { PaginatedResult } from "../types/pagination"

export interface SuccessResponse<T> {
  success: true
  data: T
}

export interface ErrorApiResponse {
  success: false
  error: {
    message: string
    code?: string
  }
}

export interface PaginatedApiResponse<T> {
  success: true
  data: T[]
  pagination: Omit<PaginatedResult<T>, "data">
}

export function successResponse<T>(data: T): SuccessResponse<T> {
  return { success: true, data }
}

export function errorResponse(message: string, code?: string): ErrorApiResponse {
  return { success: false, error: { message, code } }
}

export function paginatedResponse<T>(
  data: T[],
  pagination: Omit<PaginatedResult<T>, "data">
): PaginatedApiResponse<T> {
  return { success: true, data, pagination }
}
