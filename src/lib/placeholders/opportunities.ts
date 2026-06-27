import type { StudyOpportunity } from "@/types"
import data from "@/data/opportunities.json"

const opportunitiesData = data as StudyOpportunity[]

export const opportunities: StudyOpportunity[] = opportunitiesData

export function getFeaturedOpportunities() {
  return opportunities.filter((o) => o.featured)
}

export function getOpportunitiesByState(stateSlug: string) {
  return opportunities.filter((o) => o.stateSlug === stateSlug)
}

export function getOpportunitiesByCity(citySlug: string) {
  return opportunities.filter((o) => o.citySlug === citySlug)
}

export function getOpportunitiesByCategory(categorySlug: string) {
  return opportunities.filter((o) => o.categorySlug === categorySlug)
}

export function getOpportunitiesByProvider(providerSlug: string) {
  return opportunities.filter((o) => o.providerSlug === providerSlug)
}

export function getOpportunitiesByType(type: string) {
  return opportunities.filter((o) => o.type === type)
}
