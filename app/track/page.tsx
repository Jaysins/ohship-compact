"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Button } from "@/components/ui"
import { ArrowLeft, Search } from "lucide-react"

export default function TrackSearchPage() {
  const router = useRouter()
  const [trackingCode, setTrackingCode] = useState("")
  const [error, setError] = useState("")

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    
    const code = trackingCode.trim()
    
    if (!code) {
      setError("Please enter a tracking number")
      return
    }

    // Clear error and navigate to tracking page
    setError("")
    router.push(`/track/${code}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setTrackingCode(value)
    if (error) setError("")
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Search className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Track Your Shipment</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              Enter your tracking number to get real-time updates
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={trackingCode}
                onChange={handleInputChange}
                placeholder="Enter tracking number (e.g., SH13651729)"
                className="h-14 text-lg pr-32"
                autoFocus
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 h-10"
                disabled={!trackingCode.trim()}
              >
                Track Shipment
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </form>

          {/* Additional Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/support"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              FAQ
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}