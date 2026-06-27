import { BaseRepository } from "./base"
import type { Company } from "@/generated/prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateCompanyInput {
  name: string
  slug: string
  logo?: string
  website?: string
  description?: string
}

export interface UpdateCompanyInput {
  name?: string
  slug?: string
  logo?: string
  website?: string
  description?: string
}

export class CompanyRepository extends BaseRepository implements IRepository<Company, CreateCompanyInput, UpdateCompanyInput> {
  async findAll(): Promise<Company[]> {
    try {
      return await this.prisma.company.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
      this.handleError(error, "Company.findAll")
    }
  }

  async findById(id: string): Promise<Company | null> {
    try {
      return await this.prisma.company.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "Company.findById", { id })
    }
  }

  async findBySlug(slug: string): Promise<Company | null> {
    try {
      return await this.prisma.company.findUnique({ where: { slug } })
    } catch (error) {
      this.handleError(error, "Company.findBySlug", { slug })
    }
  }

  async findByName(name: string): Promise<Company | null> {
    try {
      return await this.prisma.company.findFirst({ where: { name } })
    } catch (error) {
      this.handleError(error, "Company.findByName", { name })
    }
  }

  async create(data: CreateCompanyInput): Promise<Company> {
    try {
      return await this.prisma.company.create({ data })
    } catch (error) {
      this.handleError(error, "Company.create", { data })
    }
  }

  async update(id: string, data: UpdateCompanyInput): Promise<Company> {
    try {
      return await this.prisma.company.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "Company.update", { id, data })
    }
  }

  async delete(id: string): Promise<Company> {
    try {
      return await this.prisma.company.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "Company.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.company.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "Company.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.company.count()
    } catch (error) {
      this.handleError(error, "Company.count")
    }
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<Company>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const [data, total] = await Promise.all([
        this.prisma.company.findMany({ skip, take: pageSize, orderBy: orderBy ?? { name: "asc" } }),
        this.prisma.company.count(),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Company.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Company>> {
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
        this.prisma.company.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.company.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Company.search", { params })
    }
  }
}
