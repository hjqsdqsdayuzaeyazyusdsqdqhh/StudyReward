import type { Metadata } from "next"
import { opportunities } from "@/lib/placeholders"
import { StudyTypePage } from "@/components/templates/study-type-page"

const slug = "mock-jury-studies"
const config = { label: "Mock Juries", description: "Participate in simulated court trials and deliberations. Get paid to provide your verdict on real legal cases." }

export const metadata: Metadata = {
  title: "Mock Juries - Paid Research Opportunities | StudyReward",
  description: "Browse paid mock jury opportunities across the US. Serve as a mock juror and earn $100-$400 per session.",
  openGraph: { title: "Mock Juries - Paid Research Opportunities | StudyReward" },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  return <StudyTypePage slug={slug} config={config} page={page} opportunities={opportunities.filter((o) => o.type === "mock-jury")} />
}
