import type { Metadata } from "next"
import { guides } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { GuideCard } from "@/components/ui/guide-card"

export const metadata: Metadata = {
  title: "Guides & Resources | StudyReward",
  description: "Expert guides on finding and participating in paid research studies. Learn about clinical trials, focus groups, safety tips, and more.",
  openGraph: { title: "Guides & Resources | StudyReward", description: "Expert guides on paid research participation." },
}

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Guides" }]} />
      <SectionTitle title="Guides & Resources" description="Expert advice on finding and participating in paid research" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  )
}
