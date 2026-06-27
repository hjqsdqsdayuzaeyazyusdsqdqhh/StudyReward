"use client"

import { useCallback, useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompensationFilterProps {
  className?: string
}

export function CompensationFilter({ className }: CompensationFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [min, setMin] = useState(searchParams.get("compensationMin") || "")
  const [max, setMax] = useState(searchParams.get("compensationMax") || "")

  useEffect(() => {
    setMin(searchParams.get("compensationMin") || "")
    setMax(searchParams.get("compensationMax") || "")
  }, [searchParams])

  const updateParams = useCallback(
    (key: string, value: string) => {
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

  const hasValue = min || max

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Compensation</h4>
        {hasValue && (
          <button
            type="button"
            onClick={() => {
              setMin("")
              setMax("")
              const params = new URLSearchParams(searchParams.toString())
              params.delete("compensationMin")
              params.delete("compensationMax")
              params.delete("page")
              router.push(`${pathname}?${params.toString()}`)
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <Separator className="my-3" />
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <DollarSign className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={min}
            onChange={(e) => {
              setMin(e.target.value)
              if (e.target.value === "" || Number(e.target.value) >= 0) {
                updateParams("compensationMin", e.target.value)
              }
            }}
            className="h-8 pl-7 text-xs"
            aria-label="Minimum compensation in dollars"
          />
        </div>
        <span className="text-xs text-muted-foreground">to</span>
        <div className="relative flex-1">
          <DollarSign className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={max}
            onChange={(e) => {
              setMax(e.target.value)
              if (e.target.value === "" || Number(e.target.value) >= 0) {
                updateParams("compensationMax", e.target.value)
              }
            }}
            className="h-8 pl-7 text-xs"
            aria-label="Maximum compensation in dollars"
          />
        </div>
      </div>
    </div>
  )
}
