"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp, MapPin, FlaskConical, FileText, Building2 } from "lucide-react"
import { opportunities, categories, states, studyTypes, companies, guides } from "@/lib/placeholders"
import { cn } from "@/lib/utils"

interface SuggestionGroup {
  label: string
  icon: React.ReactNode
  items: { label: string; href: string; subtitle?: string }[]
}

export function SearchAutocomplete() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const normalized = query.trim().toLowerCase()

  const groups: SuggestionGroup[] = normalized.length >= 2
    ? [
        {
          label: "Studies",
          icon: <Search className="h-4 w-4" />,
          items: opportunities
            .filter(
              (o) =>
                o.title.toLowerCase().includes(normalized) ||
                o.description.toLowerCase().includes(normalized)
            )
            .slice(0, 5)
            .map((o) => ({
              label: o.title,
              href: `/search?q=${encodeURIComponent(o.title)}`,
              subtitle: `${o.compensation} · ${o.city}, ${o.state}`,
            })),
        },
        {
          label: "Categories",
          icon: <FlaskConical className="h-4 w-4" />,
          items: categories
            .filter((c) => c.name.toLowerCase().includes(normalized))
            .slice(0, 5)
            .map((c) => ({
              label: c.name,
              href: `/categories/${c.slug}`,
              subtitle: `${c.count.toLocaleString()} studies`,
            })),
        },
        {
          label: "States",
          icon: <MapPin className="h-4 w-4" />,
          items: states
            .filter((s) => s.name.toLowerCase().includes(normalized))
            .slice(0, 5)
            .map((s) => ({
              label: s.name,
              href: `/states/${s.slug}`,
              subtitle: `${s.count.toLocaleString()} studies`,
            })),
        },
        {
          label: "Study Types",
          icon: <TrendingUp className="h-4 w-4" />,
          items: studyTypes
            .filter((t) => t.name.toLowerCase().includes(normalized))
            .slice(0, 5)
            .map((t) => ({
              label: t.name,
              href: `/${t.slug}`,
              subtitle: t.averageCompensation,
            })),
        },
        {
          label: "Companies",
          icon: <Building2 className="h-4 w-4" />,
          items: companies
            .filter((c) => c.name.toLowerCase().includes(normalized))
            .slice(0, 3)
            .map((c) => ({
              label: c.name,
              href: `/companies/${c.slug}`,
            })),
        },
        {
          label: "Guides",
          icon: <FileText className="h-4 w-4" />,
          items: guides
            .filter(
              (g) =>
                g.title.toLowerCase().includes(normalized) ||
                g.description.toLowerCase().includes(normalized)
            )
            .slice(0, 3)
            .map((g) => ({
              label: g.title,
              href: `/guides/${g.slug}`,
              subtitle: g.category,
            })),
        },
      ].filter((g) => g.items.length > 0)
    : []

  const flatItems = groups.flatMap((g) => g.items)
  const totalItems = flatItems.length

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = query.trim()
      if (!trimmed) return
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      setIsOpen(false)
    },
    [query, router]
  )

  const handleSelect = useCallback(
    (href: string) => {
      setIsOpen(false)
      setQuery("")
      setActiveIndex(-1)
      inputRef.current?.blur()
      router.push(href)
    },
    [router]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || totalItems === 0) {
        if (e.key === "Escape") setIsOpen(false)
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
          break
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
          break
        case "Enter":
          e.preventDefault()
          if (activeIndex >= 0 && activeIndex < totalItems) {
            handleSelect(flatItems[activeIndex].href)
          }
          break
        case "Escape":
          setIsOpen(false)
          setActiveIndex(-1)
          break
      }
    },
    [isOpen, totalItems, activeIndex, flatItems, handleSelect]
  )

  useEffect(() => {
    if (!isOpen) setActiveIndex(-1)
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(e.target.value.trim().length >= 2)
  }

  const handleFocus = () => {
    if (query.trim().length >= 2) setIsOpen(true)
  }

  return (
    <div className="relative" role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-controls={isOpen ? "autocomplete-list" : undefined}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search studies, categories, states..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Search studies, categories, states"
            aria-autocomplete="list"
            aria-controls={isOpen ? "autocomplete-list" : undefined}
            aria-activedescendant={
              activeIndex >= 0 ? `autocomplete-item-${activeIndex}` : undefined
            }
            autoComplete="off"
          />
        </div>
      </form>

      {isOpen && groups.length > 0 && (
        <div
          ref={listRef}
          id="autocomplete-list"
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg border bg-background shadow-lg"
        >
          {groups.map((group, gi) => {
            const startIndex = groups
              .slice(0, gi)
              .reduce((acc, g) => acc + g.items.length, 0)
            return (
              <div key={group.label}>
                {gi > 0 && <div className="h-px bg-border" role="separator" />}
                <div
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground"
                  aria-hidden="true"
                >
                  {group.icon}
                  {group.label}
                </div>
                {group.items.map((item, ii) => {
                  const globalIndex = startIndex + ii
                  const isActive = globalIndex === activeIndex
                  return (
                    <button
                      key={item.href}
                      id={`autocomplete-item-${globalIndex}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSelect(item.href)
                      }}
                      onMouseEnter={() => setActiveIndex(globalIndex)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                        isActive ? "bg-accent text-accent-foreground" : ""
                      )}
                    >
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.subtitle && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {item.subtitle}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
