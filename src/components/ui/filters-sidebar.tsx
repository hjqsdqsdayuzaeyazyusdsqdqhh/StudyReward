"use client"

import { categories, states } from "@/lib/placeholders"
import { Filters } from "@/components/ui/filters"
import type { FilterSection } from "@/components/ui/filters"

const studyTypes = [
  { label: "Focus Groups", value: "focus-group" },
  { label: "Clinical Trials", value: "clinical-trial" },
  { label: "Medical Studies", value: "medical-study" },
  { label: "Product Testing", value: "product-testing" },
  { label: "Mock Juries", value: "mock-jury" },
  { label: "Online Surveys", value: "survey" },
]

const filterSections: FilterSection[] = [
  {
    id: "category",
    label: "Category",
    type: "single",
    param: "category",
    options: categories.map((c) => ({ label: c.name, value: c.slug, count: c.count })),
  },
  {
    id: "state",
    label: "State",
    type: "single",
    param: "state",
    options: states.map((s) => ({ label: s.name, value: s.slug, count: s.count })),
  },
  {
    id: "study-type",
    label: "Study Type",
    type: "single",
    param: "type",
    options: studyTypes,
  },
  {
    id: "location",
    label: "Location",
    type: "single",
    param: "remote",
    options: [
      { label: "Online / Remote", value: "remote" },
      { label: "In-Person", value: "in-person" },
    ],
  },
]

export function FiltersSidebar() {
  return <Filters sections={filterSections} />
}
