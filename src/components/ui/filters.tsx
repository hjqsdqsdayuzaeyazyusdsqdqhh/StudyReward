"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface FilterSection {
  id: string
  label: string
  type: "single" | "multiple"
  options: FilterOption[]
  param: string
}

interface FiltersProps {
  sections: FilterSection[]
  className?: string
  clearLabel?: string
}

export function Filters({
  sections,
  className,
  clearLabel = "Clear all",
}: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeParams = sections.reduce(
    (acc, section) => {
      acc[section.param] = searchParams.get(section.param)
      return acc
    },
    {} as Record<string, string | null>
  )

  const hasFilters = Object.values(activeParams).some(Boolean)

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  return (
    <aside className={cn("w-full shrink-0 lg:w-64", className)} aria-label="Filters">
      <div className="space-y-6 rounded-lg border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1 p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              <X className="h-3 w-3" />
              {clearLabel}
            </Button>
          )}
        </div>

        {sections.map((section, i) => (
          <div key={section.id}>
            {i > 0 && <Separator className="mb-6" />}
            <h4 className="mb-3 text-sm font-medium">{section.label}</h4>
            <div className="space-y-1.5">
              {section.options.map((option) => {
                const isActive = activeParams[section.param] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFilter(
                        section.param,
                        isActive ? null : option.value
                      )
                    }
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                      isActive
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                    aria-pressed={isActive}
                  >
                    {option.label}
                    {option.count !== undefined && (
                      <span className="text-xs">{option.count}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
