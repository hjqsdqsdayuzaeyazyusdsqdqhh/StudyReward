import Link from "next/link"
import { cn } from "@/lib/utils"

const searchTerms = [
  { label: "Clinical Trials", href: "/search?q=clinical+trials" },
  { label: "Remote Studies", href: "/search?q=remote+studies" },
  { label: "Product Testing", href: "/search?q=product+testing" },
  { label: "Focus Groups", href: "/search?q=focus+groups" },
  { label: "Mock Juries", href: "/search?q=mock+juries" },
  { label: "Medical Studies", href: "/search?q=medical+studies" },
  { label: "Online Surveys", href: "/search?q=online+surveys" },
  { label: "High Paying", href: "/search?q=high+paying" },
]

interface PopularSearchesProps {
  title?: string
  limit?: number
}

export function PopularSearches({
  title = "Popular Searches",
  limit = 8,
}: PopularSearchesProps) {
  const items = searchTerms.slice(0, limit)

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((term) => (
          <Link
            key={term.href}
            href={term.href}
            className={cn(
              "rounded-full border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {term.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
