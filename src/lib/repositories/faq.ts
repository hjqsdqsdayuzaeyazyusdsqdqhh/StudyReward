import { BaseRepository } from "./base"
import type { FAQ } from "@/generated/prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateFAQInput {
  question: string
  answer: string
  opportunityId?: string
}

export interface UpdateFAQInput {
  question?: string
  answer?: string
  opportunityId?: string
}

export class FAQRepository extends BaseRepository implements IRepository<FAQ, CreateFAQInput, UpdateFAQInput> {
  async findAll(): Promise<FAQ[]> {
    try {
      return await this.prisma.fAQ.findMany({ orderBy: { createdAt: "desc" } })
    } catch (error) {
      this.handleError(error, "FAQ.findAll")
    }
  }

  async findById(id: string): Promise<FAQ | null> {
    try {
      return await this.prisma.fAQ.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "FAQ.findById", { id })
    }
  }

  async findBySlug(_slug: string): Promise<FAQ | null> {
    return null
  }

  async create(data: CreateFAQInput): Promise<FAQ> {
    try {
      return await this.prisma.fAQ.create({ data })
    } catch (error) {
      this.handleError(error, "FAQ.create", { data })
    }
  }

  async update(id: string, data: UpdateFAQInput): Promise<FAQ> {
    try {
      return await this.prisma.fAQ.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "FAQ.update", { id, data })
    }
  }

  async delete(id: string): Promise<FAQ> {
    try {
      return await this.prisma.fAQ.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "FAQ.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.fAQ.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "FAQ.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.fAQ.count()
    } catch (error) {
      this.handleError(error, "FAQ.count")
    }
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<FAQ>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const [data, total] = await Promise.all([
        this.prisma.fAQ.findMany({ skip, take: pageSize, orderBy: orderBy ?? { createdAt: "desc" } }),
        this.prisma.fAQ.count(),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "FAQ.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<FAQ>> {
    try {
      const { query, page = 1, pageSize = 20, sortBy, sortOrder } = params
      const skip = (page - 1) * pageSize
      const where = {
        OR: [
          { question: { contains: query, mode: "insensitive" as const } },
          { answer: { contains: query, mode: "insensitive" as const } },
        ],
      }
      const orderBy = sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" as const }
      const [data, total] = await Promise.all([
        this.prisma.fAQ.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.fAQ.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "FAQ.search", { params })
    }
  }

  async findByOpportunity(opportunityId: string): Promise<FAQ[]> {
    try {
      return await this.prisma.fAQ.findMany({
        where: { opportunityId },
        orderBy: { createdAt: "asc" },
      })
    } catch (error) {
      this.handleError(error, "FAQ.findByOpportunity", { opportunityId })
    }
  }
}
