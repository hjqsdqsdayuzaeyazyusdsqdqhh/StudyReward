"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Check } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="border-t py-16" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          {submitted ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold">You&apos;re subscribed!</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ll send you the latest paid research opportunities.
              </p>
            </div>
          ) : (
            <>
              <Mail className="mx-auto h-8 w-8 text-primary" />
              <h2 id="newsletter-heading" className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Stay Updated
              </h2>
              <p className="mt-3 text-muted-foreground">
                Get the latest paid research opportunities delivered to your inbox.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                  className="sm:max-w-xs"
                />
                <Button type="submit" className="shrink-0">
                  Subscribe
                </Button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
