"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Quote, QuoteRequest } from "@/types/quote"
import { getStorageItem, setStorageItem, StorageKey } from "@/lib/utils/storage"
import { formatCurrency, calculateDeliveryDate } from "@/lib/utils/format"
import { LoadingSpinner, Button, Badge } from "@/components/ui"

export default function FetchQuotesPage() {
  const router = useRouter()

  // State
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [searchParams, setSearchParams] = useState<QuoteRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null)

  // Load quotes from storage
  useEffect(() => {
    const cachedQuotes = getStorageItem<Quote[]>(StorageKey.QUOTES_CACHE)
    const cachedSearch = getStorageItem<QuoteRequest>(StorageKey.QUOTE_SEARCH)

    if (!cachedQuotes || cachedQuotes.length === 0) {
      // No quotes found, redirect back
      router.push("/create-shipment")
      return
    }

    setQuotes(cachedQuotes)
    setSearchParams(cachedSearch)
    setLoading(false)
  }, [router])

  const handleSelectQuote = (quoteId: string) => {
    const selectedQuote = quotes.find((q) => q.quote_id === quoteId)
    if (selectedQuote) {
      setStorageItem(StorageKey.SELECTED_QUOTE, selectedQuote)
      // TODO: Navigate to checkout page in Phase 3
      router.push("/checkout")
    }
  }

  const toggleExpanded = (quoteId: string) => {
    setExpandedQuote(expandedQuote === quoteId ? null : quoteId)
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white">
        <div className="flex items-center justify-center flex-1">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white">
        {/* Top App Bar */}
        <div className="flex items-center border-b border-slate-200 bg-white p-4">
          <Link href="/create-shipment" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 pl-4 flex-1">Step 2: Select Quote</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <svg
              className="mx-auto h-16 w-16 text-slate-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Quotes Found</h2>
            <p className="text-slate-600 mb-6">
              Please go back and create a shipment to get quotes.
            </p>
            <Button onClick={() => router.push("/create-shipment")}>
              Create Shipment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      {/* Top App Bar */}
      <div className="flex items-center border-b border-slate-200 bg-white p-4">
        <Link href="/create-shipment" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-slate-900 pl-4 flex-1">Step 2: Select Quote</h1>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-slate-700">Shipment Details</span>
            </div>
            <div className="flex-1 h-1 bg-primary mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-slate-900">Select Quote</span>
            </div>
            <div className="flex-1 h-1 bg-slate-200 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-slate-400">Shipment Info</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {/* Shipment Summary */}
          {searchParams && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Shipment Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Route</p>
                  <p className="font-semibold text-slate-900">
                    {searchParams.origin.state.charAt(0).toUpperCase() + searchParams.origin.state.slice(1)}, {searchParams.origin.country}
                    {" → "}
                    {searchParams.destination.state.charAt(0).toUpperCase() + searchParams.destination.state.slice(1)}, {searchParams.destination.country}
                  </p>
                </div>
                {searchParams.items && searchParams.items.length > 0 && (
                  <>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Item</p>
                      <p className="font-semibold text-slate-900">
                        {searchParams.items[0].quantity}x {searchParams.items[0].category_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Weight & Value</p>
                      <p className="font-semibold text-slate-900">
                        {searchParams.items[0].weight} kg • {formatCurrency(searchParams.items[0].declared_value, searchParams.currency)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quote Count */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              {quotes.length} {quotes.length === 1 ? "Quote" : "Quotes"} Available
            </h2>
            <p className="text-slate-600 mt-1">Select a shipping quote to continue</p>
          </div>

          {/* Quote Cards */}
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote.quote_id}
                className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm transition-all hover:border-primary/50"
              >
                {/* Quote Header */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Carrier Logo/Name */}
                    <div className="h-16 w-24 flex-shrink-0 flex items-center justify-center">
                      {quote.carrier_logo_url ? (
                        <img
                          src={quote.carrier_logo_url}
                          alt={quote.carrier_name}
                          className="max-h-12 max-w-full object-contain"
                        />
                      ) : (
                        <div className="bg-slate-100 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 text-center">
                          {quote.carrier_name}
                        </div>
                      )}
                    </div>

                    {/* Quote Details */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Carrier</p>
                        <p className="font-semibold text-slate-900">{quote.display_name}</p>
                        <p className="text-xs text-slate-500">{quote.service_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Transit Time</p>
                        <p className="font-semibold text-slate-900">{quote.estimated_days} {quote.estimated_days === 1 ? 'day' : 'days'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Est. Delivery</p>
                        <p className="font-semibold text-slate-900">{calculateDeliveryDate(quote.estimated_days)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Service Level</p>
                        <Badge variant={quote.service_type === "express" ? "info" : "default"}>
                          {quote.service_type.charAt(0).toUpperCase() + quote.service_type.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-end gap-3 ml-auto">
                      <div className="text-3xl font-bold text-slate-900">
                        {formatCurrency(quote.total_amount, quote.currency)}
                      </div>
                      <Button
                        onClick={() => handleSelectQuote(quote.quote_id)}
                        size="sm"
                        className="w-full md:w-auto"
                      >
                        Select Quote
                      </Button>
                    </div>
                  </div>

                  {/* View Details Toggle */}
                  <button
                    onClick={() => toggleExpanded(quote.quote_id)}
                    className="mt-4 text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    {expandedQuote === quote.quote_id ? (
                      <>
                        Hide Details
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        View Price Breakdown
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Expandable Price Breakdown */}
                {expandedQuote === quote.quote_id && (
                  <div className="border-t border-slate-200 bg-slate-50 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Price Breakdown</h3>

                    {/* Base Rate */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-700">Base Rate</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrency(quote.base_rate, quote.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Adjustments */}
                    {quote.adjustments && quote.adjustments.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Additional Fees</p>
                        {quote.adjustments.map((adjustment, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2">
                            <div className="flex-1">
                              <span className="text-sm text-slate-700">{adjustment.description}</span>
                              {adjustment.calculation_type === 'percentage' && adjustment.rate && (
                                <span className="text-xs text-slate-500 ml-1">({adjustment.rate}%)</span>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-slate-900">
                              {formatCurrency(adjustment.amount, quote.currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Discounts */}
                    {quote.discounts && quote.discounts.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-green-600 uppercase mb-2">Discounts</p>
                        {quote.discounts.map((discount, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2">
                            <span className="text-sm text-green-700">{discount.description}</span>
                            <span className="text-sm font-semibold text-green-700">
                              -{formatCurrency(discount.amount, quote.currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-slate-300 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-slate-900">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(quote.total_amount, quote.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {quote.metadata && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                          {quote.metadata.weight && (
                            <div>
                              <span className="text-slate-600">Billable Weight:</span>
                              <span className="ml-1 font-semibold text-slate-900">
                                {quote.metadata.billable_weight || quote.metadata.weight} kg
                              </span>
                            </div>
                          )}
                          {quote.metadata.is_insured !== undefined && (
                            <div>
                              <span className="text-slate-600">Insurance:</span>
                              <span className="ml-1 font-semibold text-slate-900">
                                {quote.metadata.is_insured ? 'Yes' : 'No'}
                              </span>
                            </div>
                          )}
                          {quote.expires_at && (
                            <div>
                              <span className="text-slate-600">Expires:</span>
                              <span className="ml-1 font-semibold text-slate-900">
                                {new Date(quote.expires_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
