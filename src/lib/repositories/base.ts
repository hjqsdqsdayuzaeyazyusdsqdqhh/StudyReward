import { logger } from "../utils/logger"
import { DatabaseError } from "../errors/database"
import type { PaginatedResult } from "../types/pagination"
import type { PaginationParams } from "../types/pagination"
import type { PrismaClient } from "@/generated/prisma/client"

export abstract class BaseRepository {
  constructor(protected readonly prisma: PrismaClient) {}

  protected handleError(error: unknown, operation: string, context?: Record<string, unknown>): never {
    if (error instanceof DatabaseError) throw error
    logger.error(`Repository operation failed: ${operation}`, { error, ...context })
    throw new DatabaseError(`Database operation '${operation}' failed`)
  }

  protected paginateResult<T>(
    data: T[],
    total: number,
    params: PaginationParams
  ): PaginatedResult<T> {
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 20
    const totalPages = Math.ceil(total / pageSize) || 1
    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page * pageSize < total,
      hasPreviousPage: page > 1,
    }
  }

  protected parsePaginationParams(params?: PaginationParams) {
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 20
    const skip = (page - 1) * pageSize
    const orderBy = params?.sortBy
      ? { [params.sortBy]: params.sortOrder ?? "asc" }
      : undefined
    return { page, pageSize, skip, orderBy }
  }
}
