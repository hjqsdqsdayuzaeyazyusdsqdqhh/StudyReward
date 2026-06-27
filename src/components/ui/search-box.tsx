"use client"

import { useState, useCallback, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBoxProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  initialQuery?: string
  autoFocus?: boolean
}

export function SearchBox({
  placeholder = "Search studies...",
  onSearch,
  className,
  initialQuery = "",
  autoFocus = false,
}: SearchBoxProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const trimmed = query.trim()
      if (!trimmed) return
      if (onSearch) {
        onSearch(trimmed)
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      }
    },
    [query, onSearch, router]
  )

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)} role="search">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-20"
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      <Button
        type="submit"
        size="sm"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
        disabled={!query.trim()}
      >
        Search
      </Button>
    </form>
  )
}
