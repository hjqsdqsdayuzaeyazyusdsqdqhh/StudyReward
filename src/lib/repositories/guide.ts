import { BaseRepository } from "./base"
import type { Guide } from "@prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateGuideInput {
  title: string
  slug: string
  excerpt: string
  content?: string
  categoryId: string
}

export interface UpdateGuideInput {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  categoryId?: string
}

export class GuideRepository extends BaseRepository implements IRepository<Guide, CreateGuideInput, UpdateGuideInput> {
  async findAll(): Promise<Guide[]> {
    try {
      return await this.prisma.guide.findMany({ orderBy: { createdAt: "desc" } })
    } catch (error) {
      this.handleError(error, "Guide.findAll")
    }
  }

  async findById(id: string): Promise<Guide | null> {
    try {
      return await this.prisma.guide.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "Guide.findById", { id })
    }
  }

  async findBySlug(slug: string): Promise<Guide | null> {
    try {
      return await this.prisma.guide.findUnique({ where: { slug } })
    } catch (error) {
      this.handleError(error, "Guide.findBySlug", { slug })
    }
  }

  async create(data: CreateGuideInput): Promise<Guide> {
    try {
      return await this.prisma.guide.create({ data })
    } catch (error) {
      this.handleError(error, "Guide.create", { data })
    }
  }

  async update(id: string, data: UpdateGuideInput): Promise<Guide> {
    try {
      return await this.prisma.guide.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "Guide.update", { id, data })
    }
  }

  async delete(id: string): Promise<Guide> {
    try {
      return await this.prisma.guide.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "Guide.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.guide.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "Guide.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.guide.count()
    } catch (error) {
      this.handleError(error, "Guide.count")
    }
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<Guide>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const [data, total] = await Promise.all([
        this.prisma.guide.findMany({ skip, take: pageSize, orderBy: orderBy ?? { createdAt: "desc" } }),
        this.prisma.guide.count(),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Guide.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Guide>> {
    try {
      const { query, page = 1, pageSize = 20, sortBy, sortOrder } = params
      const skip = (page - 1) * pageSize
      const where = {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { excerpt: { contains: query, mode: "insensitive" as const } },
        ],
      }
      const orderBy = sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" as const }
      const [data, total] = await Promise.all([
        this.prisma.guide.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.guide.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Guide.search", { params })
    }
  }

  async findByCategory(categoryId: string): Promise<Guide[]> {
    try {
      return await this.prisma.guide.findMany({ where: { categoryId }, orderBy: { createdAt: "desc" } })
    } catch (error) {
      this.handleError(error, "Guide.findByCategory", { categoryId })
    }
  }
}
