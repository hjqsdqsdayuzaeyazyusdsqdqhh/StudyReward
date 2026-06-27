import Link from "next/link"
import { categories } from "@/lib/placeholders"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RelatedCategoriesProps {
  currentSlug?: string
  limit?: number
  title?: string
  variant?: "pills" | "cards"
}

export function RelatedCategories({
  currentSlug,
  limit = 6,
  title = "Browse Categories",
  variant = "pills",
}: RelatedCategoriesProps) {
  const items = categories
    .filter((c) => c.slug !== currentSlug)
    .slice(0, limit)

  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {variant === "pills" ? (
        <div className="flex flex-wrap gap-2">
          {items.map((cat) => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`}>
              <Badge
                variant="secondary"
                className="px-3 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
              >
                {cat.name}
                <span className="ml-1.5 text-xs opacity-70">
                  {cat.count.toLocaleString()}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={cn(
                "rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
              )}
            >
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {cat.count.toLocaleString()} studies
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
