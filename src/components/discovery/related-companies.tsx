import Link from "next/link"
import { companies } from "@/lib/placeholders"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RelatedCompaniesProps {
  currentSlug?: string
  type?: string
  limit?: number
  title?: string
}

export function RelatedCompanies({
  currentSlug,
  type,
  limit = 4,
  title = "Research Companies",
}: RelatedCompaniesProps) {
  const items = companies
    .filter((c) => {
      if (currentSlug && c.slug === currentSlug) return false
      if (type && c.types.includes(type)) return true
      return false
    })
    .slice(0, limit)

  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((comp) => (
          <Link key={comp.slug} href={`/companies/${comp.slug}`}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm">{comp.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {comp.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {comp.types.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0">
                      {t.replace(/-/g, " ")}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
