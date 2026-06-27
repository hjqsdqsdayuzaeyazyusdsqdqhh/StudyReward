import { z } from "zod"

export const OpportunityStatusEnum = z.enum(["Active", "Upcoming", "Filled"])
export type OpportunityStatusEnum = z.infer<typeof OpportunityStatusEnum>

export const CompensationTypeEnum = z.enum(["Fixed", "Hourly", "Range", "Negotiable"])
export type CompensationTypeEnum = z.infer<typeof CompensationTypeEnum>

export const StudyLocationEnum = z.enum(["On-Site", "Remote", "Hybrid"])
export type StudyLocationEnum = z.infer<typeof StudyLocationEnum>

export const StudyVisibilityEnum = z.enum(["Public", "Private", "Unlisted"])
export type StudyVisibilityEnum = z.infer<typeof StudyVisibilityEnum>
