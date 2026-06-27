import type {
  CreateStateDTO,
  UpdateStateDTO,
  CreateCityDTO,
  UpdateCityDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CreateCompanyDTO,
  UpdateCompanyDTO,
  CreateStudyTypeDTO,
  UpdateStudyTypeDTO,
  CreateOpportunityDTO,
  UpdateOpportunityDTO,
  CreateGuideDTO,
  UpdateGuideDTO,
  CreateFAQDTO,
  UpdateFAQDTO,
  CreateTagDTO,
  UpdateTagDTO,
} from "../dto"
import type {
  StateType,
  CityType,
  CategoryType,
  CompanyType,
  StudyTypeType,
  OpportunityType,
  GuideType,
  FAQType,
  TagType,
} from "../types"
import type {
  CreateStateInput,
  UpdateStateInput,
  CreateCityInput,
  UpdateCityInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateCompanyInput,
  UpdateCompanyInput,
  CreateStudyTypeInput,
  UpdateStudyTypeInput,
  CreateOpportunityInput,
  UpdateOpportunityInput,
  CreateGuideInput,
  UpdateGuideInput,
  CreateFAQInput,
  UpdateFAQInput,
  CreateTagInput,
  UpdateTagInput,
} from "../lib/repositories"

function toUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value
}

export const stateMapper = {
  dtoToCreate(input: CreateStateDTO): CreateStateInput {
    return {
      name: input.name,
      slug: input.slug,
      abbreviation: input.abbreviation,
    }
  },
  dtoToUpdate(input: UpdateStateDTO): UpdateStateInput {
    return input
  },
  toType(db: StateType): StateType {
    return db
  },
}

export const cityMapper = {
  dtoToCreate(input: CreateCityDTO): CreateCityInput {
    return {
      stateId: input.stateId,
      name: input.name,
      slug: input.slug,
    }
  },
  dtoToUpdate(input: UpdateCityDTO): UpdateCityInput {
    return input
  },
  toType(db: CityType): CityType {
    return db
  },
}

export const categoryMapper = {
  dtoToCreate(input: CreateCategoryDTO): CreateCategoryInput {
    return {
      name: input.name,
      slug: input.slug,
      icon: input.icon,
      description: toUndefined(input.description),
    }
  },
  dtoToUpdate(input: UpdateCategoryDTO): UpdateCategoryInput {
    return input
  },
  toType(db: CategoryType): CategoryType {
    return db
  },
}

export const companyMapper = {
  dtoToCreate(input: CreateCompanyDTO): CreateCompanyInput {
    return {
      name: input.name,
      slug: input.slug,
      logo: toUndefined(input.logo),
      website: toUndefined(input.website),
      description: toUndefined(input.description),
    }
  },
  dtoToUpdate(input: UpdateCompanyDTO): UpdateCompanyInput {
    return input
  },
  toType(db: CompanyType): CompanyType {
    return db
  },
}

export const studyTypeMapper = {
  dtoToCreate(input: CreateStudyTypeDTO): CreateStudyTypeInput {
    return {
      name: input.name,
      slug: input.slug,
    }
  },
  dtoToUpdate(input: UpdateStudyTypeDTO): UpdateStudyTypeInput {
    return input
  },
  toType(db: StudyTypeType): StudyTypeType {
    return db
  },
}

export const opportunityMapper = {
  dtoToCreate(input: CreateOpportunityDTO): CreateOpportunityInput {
    return {
      title: input.title,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: toUndefined(input.description),
      companyId: input.companyId,
      categoryId: input.categoryId,
      studyTypeId: input.studyTypeId,
      stateId: input.stateId,
      cityId: input.cityId,
      compensation: input.compensation,
      compensationType: input.compensationType,
      online: input.online,
      featured: input.featured,
      status: input.status,
      eligibility: toUndefined(input.eligibility),
      postedDate: input.postedDate,
    }
  },
  dtoToUpdate(input: UpdateOpportunityDTO): UpdateOpportunityInput {
    return input
  },
  toType(db: OpportunityType): OpportunityType {
    return db
  },
}

export const guideMapper = {
  dtoToCreate(input: CreateGuideDTO): CreateGuideInput {
    return {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: toUndefined(input.content),
      categoryId: input.categoryId,
    }
  },
  dtoToUpdate(input: UpdateGuideDTO): UpdateGuideInput {
    return input
  },
  toType(db: GuideType): GuideType {
    return db
  },
}

export const faqMapper = {
  dtoToCreate(input: CreateFAQDTO): CreateFAQInput {
    return {
      question: input.question,
      answer: input.answer,
      opportunityId: toUndefined(input.opportunityId),
    }
  },
  dtoToUpdate(input: UpdateFAQDTO): UpdateFAQInput {
    return input
  },
  toType(db: FAQType): FAQType {
    return db
  },
}

export const tagMapper = {
  dtoToCreate(input: CreateTagDTO): CreateTagInput {
    return {
      name: input.name,
      slug: input.slug,
    }
  },
  dtoToUpdate(input: UpdateTagDTO): UpdateTagInput {
    return input
  },
  toType(db: TagType): TagType {
    return db
  },
}
