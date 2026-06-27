import { BaseRepository } from "./base"
import type { Category } from "@/generated/prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateCategoryInput {
  name: string
  slug: string
  icon?: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  slug?: string
  icon?: string
  description?: string
}

export class CategoryRepository extends BaseRepository implements IRepository<Category, CreateCategoryInput, UpdateCategoryInput> {
  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
      this.handleError(error, "Category.findAll")
    }
  }

  async findById(id: string): Promise<Category | null> {
    try {
      return await this.prisma.category.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "Category.findById", { id })
    }
  }

  async findBySlug(slug: string): Promise<Category | null> {
    try {
      return await this.prisma.category.findUnique({ where: { slug } })
    } catch (error) {
      this.handleError(error, "Category.findBySlug", { slug })
    }
  }

  async findByName(name: string): Promise<Category | null> {
    try {
      return await this.prisma.category.findFirst({ where: { name } })
    } catch (error) {
      this.handleError(error, "Category.findByName", { name })
    }
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    try {
      return await this.prisma.category.create({ data })
    } catch (error) {
      this.handleError(error, "Category.create", { data })
    }
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    try {
      return await this.prisma.category.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "Category.update", { id, data })
    }
  }

  async delete(id: string): Promise<Category> {
    try {
      return await this.prisma.category.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "Category.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.category.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "Category.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.category.count()
    } catch (error) {
      this.handleError(error, "Category.count")
    }
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<Category>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const [data, total] = await Promise.all([
        this.prisma.category.findMany({ skip, take: pageSize, orderBy: orderBy ?? { name: "asc" } }),
        this.prisma.category.count(),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Category.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Category>> {
    try {
      const { query, page = 1, pageSize = 20, sortBy, sortOrder } = params
      const skip = (page - 1) * pageSize
      const where = {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      }
      const orderBy = sortBy ? { [sortBy]: sortOrder ?? "asc" } : { name: "asc" as const }
      const [data, total] = await Promise.all([
        this.prisma.category.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.category.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Category.search", { params })
    }
  }
}
