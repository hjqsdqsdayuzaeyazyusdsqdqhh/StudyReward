import Link from "next/link"
import { states } from "@/lib/placeholders"
import { cn } from "@/lib/utils"

interface RelatedStatesProps {
  currentSlug?: string
  limit?: number
  title?: string
}

export function RelatedStates({
  currentSlug,
  limit = 12,
  title = "Browse by State",
}: RelatedStatesProps) {
  const items = states
    .filter((s) => s.slug !== currentSlug)
    .slice(0, limit)

  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((st) => (
          <Link
            key={st.slug}
            href={`/states/${st.slug}`}
            className={cn(
              "rounded-lg border bg-card px-3 py-2.5 text-center transition-colors hover:border-primary/50"
            )}
          >
            <span className="text-sm font-medium">{st.name}</span>
            <p className="text-xs text-muted-foreground">
              {st.count.toLocaleString()} studies
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
