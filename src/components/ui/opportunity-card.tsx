import type { StudyOpportunity } from "@/types"
import { StudyCard, StudyCardSkeleton } from "./study-card"

export { StudyCardSkeleton as OpportunityCardSkeleton }

interface OpportunityCardProps {
  opportunity: StudyOpportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return <StudyCard study={opportunity} />
}
