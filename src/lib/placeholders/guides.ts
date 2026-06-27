import type { Guide } from "@/types"
import data from "@/data/guides.json"

const guidesData = data as Guide[]

export const guides: Guide[] = guidesData
