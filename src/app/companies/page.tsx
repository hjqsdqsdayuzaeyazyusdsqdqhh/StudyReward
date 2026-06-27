import type { Metadata } from "next"
import Link from "next/link"
import { companies } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Browse Research Companies | StudyReward",
  description: "Discover research organizations, clinical trial sponsors, and market research companies conducting paid studies across the US.",
  openGraph: { title: "Browse Research Companies | StudyReward" },
}

export default function CompaniesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Companies" }]} />
      <SectionTitle title="Research Companies" description="Discover organizations conducting paid research studies" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link key={company.id} href={`/companies/${company.slug}`} className="group">
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base group-hover:underline">{company.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{company.studyCount} studies</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {company.types.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t.replace(/-/g, " ")}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
