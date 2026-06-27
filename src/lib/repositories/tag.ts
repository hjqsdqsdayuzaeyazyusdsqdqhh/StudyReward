import { BaseRepository } from "./base"
import type { Tag } from "@/generated/prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateTagInput {
  name: string
  slug: string
}

export interface UpdateTagInput {
  name?: string
  slug?: string
}

export class TagRepository extends BaseRepository implements IRepository<Tag, CreateTagInput, UpdateTagInput> {
  async findAll(): Promise<Tag[]> {
    try {
      return await this.prisma.tag.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
      this.handleError(error, "Tag.findAll")
    }
  }

  async findById(id: string): Promise<Tag | null> {
    try {
      return await this.prisma.tag.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "Tag.findById", { id })
    }
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    try {
      return await this.prisma.tag.findUnique({ where: { slug } })
    } catch (error) {
      this.handleError(error, "Tag.findBySlug", { slug })
    }
  }

  async create(data: CreateTagInput): Promise<Tag> {
    try {
      return await this.prisma.tag.create({ data })
    } catch (error) {
      this.handleError(error, "Tag.create", { data })
    }
  }

  async update(id: string, data: UpdateTagInput): Promise<Tag> {
    try {
      return await this.prisma.tag.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "Tag.update", { id, data })
    }
  }

  async delete(id: string): Promise<Tag> {
    try {
      return await this.prisma.tag.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "Tag.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.tag.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "Tag.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.tag.count()
    } catch (error) {
      this.handleError(error, "Tag.count")
    }
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<Tag>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const [data, total] = await Promise.all([
        this.prisma.tag.findMany({ skip, take: pageSize, orderBy: orderBy ?? { name: "asc" } }),
        this.prisma.tag.count(),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Tag.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Tag>> {
    try {
      const { query, page = 1, pageSize = 20, sortBy, sortOrder } = params
      const skip = (page - 1) * pageSize
      const where = {
        name: { contains: query, mode: "insensitive" as const },
      }
      const orderBy = sortBy ? { [sortBy]: sortOrder ?? "asc" } : { name: "asc" as const }
      const [data, total] = await Promise.all([
        this.prisma.tag.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.tag.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Tag.search", { params })
    }
  }
}
