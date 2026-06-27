import type { Metadata } from "next"
import { opportunities } from "@/lib/placeholders"
import { StudyTypePage } from "@/components/templates/study-type-page"

const slug = "medical-studies"
const config = { label: "Medical Studies", description: "Observational health research and wellness studies. Contribute to medical science while earning compensation." }

export const metadata: Metadata = {
  title: "Medical Studies - Paid Research Opportunities | StudyReward",
  description: "Browse paid medical studies across the US. Participate in health research and earn compensation for your time.",
  openGraph: { title: "Medical Studies - Paid Research Opportunities | StudyReward" },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  return <StudyTypePage slug={slug} config={config} page={page} opportunities={opportunities.filter((o) => o.type === "medical-study")} />
}
