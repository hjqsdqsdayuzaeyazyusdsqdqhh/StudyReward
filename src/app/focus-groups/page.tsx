import type { Metadata } from "next"
import { opportunities } from "@/lib/placeholders"
import { StudyTypePage } from "@/components/templates/study-type-page"

const slug = "focus-groups"
const config = { label: "Focus Groups", description: "Paid group discussions sharing opinions on products, services, and brands. Earn $50-$300 per session." }

export const metadata: Metadata = {
  title: "Focus Groups - Paid Research Opportunities | StudyReward",
  description: "Browse paid focus group opportunities across the US. Share your opinions and earn $50-$300 per session.",
  openGraph: { title: "Focus Groups - Paid Research Opportunities | StudyReward" },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  return <StudyTypePage slug={slug} config={config} page={page} opportunities={opportunities.filter((o) => o.type === "focus-group")} />
}
