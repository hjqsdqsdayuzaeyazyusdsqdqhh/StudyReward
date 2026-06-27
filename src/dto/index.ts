import type { z } from "zod"
import type {
  CreateStateSchema,
  UpdateStateSchema,
  CreateCitySchema,
  UpdateCitySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  CreateCompanySchema,
  UpdateCompanySchema,
  CreateStudyTypeSchema,
  UpdateStudyTypeSchema,
  CreateOpportunitySchema,
  UpdateOpportunitySchema,
  CreateGuideSchema,
  UpdateGuideSchema,
  CreateFAQSchema,
  UpdateFAQSchema,
  CreateTagSchema,
  UpdateTagSchema,
} from "../validation"

export type CreateStateDTO = z.infer<typeof CreateStateSchema>
export type UpdateStateDTO = z.infer<typeof UpdateStateSchema>

export type CreateCityDTO = z.infer<typeof CreateCitySchema>
export type UpdateCityDTO = z.infer<typeof UpdateCitySchema>

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>

export type CreateCompanyDTO = z.infer<typeof CreateCompanySchema>
export type UpdateCompanyDTO = z.infer<typeof UpdateCompanySchema>

export type CreateStudyTypeDTO = z.infer<typeof CreateStudyTypeSchema>
export type UpdateStudyTypeDTO = z.infer<typeof UpdateStudyTypeSchema>

export type CreateOpportunityDTO = z.infer<typeof CreateOpportunitySchema>
export type UpdateOpportunityDTO = z.infer<typeof UpdateOpportunitySchema>

export type CreateGuideDTO = z.infer<typeof CreateGuideSchema>
export type UpdateGuideDTO = z.infer<typeof UpdateGuideSchema>

export type CreateFAQDTO = z.infer<typeof CreateFAQSchema>
export type UpdateFAQDTO = z.infer<typeof UpdateFAQSchema>

export type CreateTagDTO = z.infer<typeof CreateTagSchema>
export type UpdateTagDTO = z.infer<typeof UpdateTagSchema>
