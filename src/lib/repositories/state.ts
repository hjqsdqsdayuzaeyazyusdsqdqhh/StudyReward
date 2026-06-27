import { BaseRepository } from "./base"
import { NotFoundError } from "../errors/not-found"
import type { State } from "@/generated/prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateStateInput {
  name: string
  slug: string
  abbreviation: string
}

export interface UpdateStateInput {
  name?: string
  slug?: string
  abbreviation?: string
}

export class StateRepository extends BaseRepository implements IRepository<State, CreateStateInput, UpdateStateInput> {
  async findAll(): Promise<State[]> {
    try {
      return await this.prisma.state.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
      this.handleError(error, "State.findAll")
    }
  }

  async findById(id: string): Promise<State | null> {
    try {
      return await this.prisma.state.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "State.findById", { id })
    }
  }

  async findBySlug(slug: string): Promise<State | null> {
    try {
      return await this.prisma.state.findUnique({ where: { slug } })
    } catch (error) {
      this.handleError(error, "State.findBySlug", { slug })
    }
  }

  async findByAbbreviation(abbreviation: string): Promise<State | null> {
    try {
      return await this.prisma.state.findUnique({ where: { abbreviation } })
    } catch (error) {
      this.handleError(error, "State.findByAbbreviation", { abbreviation })
    }
  }

  async create(data: CreateStateInput): Promise<State> {
    try {
      return await this.prisma.state.create({ data })
    } catch (error) {
      this.handleError(error, "State.create", { data })
    }
  }

  async update(id: string, data: UpdateStateInput): Promise<State> {
    try {
      return await this.prisma.state.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "State.update", { id, data })
    }
  }

  async delete(id: string): Promise<State> {
    try {
      return await this.prisma.state.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "State.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.state.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "State.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.state.count()
    } catch (error) {
      this.handleError(error, "State.count")
    }
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<State>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const [data, total] = await Promise.all([
        this.prisma.state.findMany({ skip, take: pageSize, orderBy: orderBy ?? { name: "asc" } }),
        this.prisma.state.count(),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "State.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<State>> {
    try {
      const { query, page = 1, pageSize = 20, sortBy, sortOrder } = params
      const skip = (page - 1) * pageSize
      const where = {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { abbreviation: { contains: query, mode: "insensitive" as const } },
        ],
      }
      const orderBy = sortBy ? { [sortBy]: sortOrder ?? "asc" } : { name: "asc" as const }
      const [data, total] = await Promise.all([
        this.prisma.state.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.state.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "State.search", { params })
    }
  }
}
