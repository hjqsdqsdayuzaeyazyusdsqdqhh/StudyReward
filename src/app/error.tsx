"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive/50" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight">500</h1>
        <p className="mt-4 text-muted-foreground">
          Something went wrong. Please try again or return home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
