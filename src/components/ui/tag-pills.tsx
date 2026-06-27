import Link from "next/link"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagItem {
  label: string
  href: string
}

interface TagPillsProps {
  items: TagItem[]
  onRemove?: (label: string) => void
  className?: string
  size?: "sm" | "md"
}

export function TagPills({ items, onRemove, className, size = "sm" }: TagPillsProps) {
  if (!items.length) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="list" aria-label="Tags">
      {items.map((item) => (
        <span
          key={item.href}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border bg-background font-medium transition-colors hover:bg-accent",
            size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm"
          )}
          role="listitem"
        >
          <Link href={item.href} className="hover:underline">
            {item.label}
          </Link>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.label)}
              className="ml-0.5 rounded-full p-0.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Remove ${item.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  )
}
