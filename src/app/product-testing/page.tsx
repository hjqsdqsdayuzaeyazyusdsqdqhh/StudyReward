import type { Metadata } from "next"
import { opportunities } from "@/lib/placeholders"
import { StudyTypePage } from "@/components/templates/study-type-page"

const slug = "product-testing"
const config = { label: "Product Testing", description: "Try new products before they launch and provide feedback. Test everything from snacks to software." }

export const metadata: Metadata = {
  title: "Product Testing - Paid Research Opportunities | StudyReward",
  description: "Browse paid product testing opportunities. Try new products before launch and earn compensation for your feedback.",
  openGraph: { title: "Product Testing - Paid Research Opportunities | StudyReward" },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  return <StudyTypePage slug={slug} config={config} page={page} opportunities={opportunities.filter((o) => o.type === "product-testing")} />
}
