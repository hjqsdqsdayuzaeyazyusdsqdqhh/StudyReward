import type { CityData } from "@/types"
import data from "@/data/cities.json"

const citiesData = data as CityData[]

export const cities: CityData[] = citiesData

export function getCityBySlug(slug: string) {
  return cities.find((c) => c.slug === slug)
}

export function getCitiesByState(stateSlug: string) {
  return cities.filter((c) => c.stateSlug === stateSlug)
}
