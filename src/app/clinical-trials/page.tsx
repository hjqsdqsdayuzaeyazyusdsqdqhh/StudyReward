import type { Metadata } from "next"
import { opportunities } from "@/lib/placeholders"
import { StudyTypePage } from "@/components/templates/study-type-page"

const slug = "clinical-trials"
const config = { label: "Clinical Trials", description: "Paid medical research studies testing new treatments, medications, and medical devices. Compensation varies by study length." }

export const metadata: Metadata = {
  title: "Clinical Trials - Paid Research Opportunities | StudyReward",
  description: "Browse paid clinical trial opportunities across the US. Participate in medical research and earn compensation for your time.",
  openGraph: { title: "Clinical Trials - Paid Research Opportunities | StudyReward" },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  return <StudyTypePage slug={slug} config={config} page={page} opportunities={opportunities.filter((o) => o.type === "clinical-trial")} />
}
