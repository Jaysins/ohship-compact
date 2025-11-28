"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Quote, QuoteRequest } from "@/types/quote"
import type { CreateShipmentRequest, Address } from "@/types/shipment"
import { getStorageItem, StorageKey } from "@/lib/utils/storage"
import { formatCurrency } from "@/lib/utils/format"
import { createShipment } from "@/lib/api/shipments"
import { handleApiError } from "@/lib/utils/error-handler"
import { LoadingSpinner, Button, Input, Badge } from "@/components/ui"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()

  // State
  const [quote, setQuote] = useState<Quote | null>(null)
  const [searchParams, setSearchParams] = useState<QuoteRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state - Sender
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [senderPhone, setSenderPhone] = useState("")
  const [senderAddress1, setSenderAddress1] = useState("")
  const [senderAddress2, setSenderAddress2] = useState("")
  const [senderPostalCode, setSenderPostalCode] = useState("")

  // Form state - Receiver
  const [receiverName, setReceiverName] = useState("")
  const [receiverEmail, setReceiverEmail] = useState("")
  const [receiverPhone, setReceiverPhone] = useState("")
  const [receiverAddress1, setReceiverAddress1] = useState("")
  const [receiverAddress2, setReceiverAddress2] = useState("")
  const [receiverPostalCode, setReceiverPostalCode] = useState("")

  // Form state - Pickup
  const [pickupType, setPickupType] = useState<"scheduled_pickup" | "drop_off">("scheduled_pickup")
  const [pickupDate, setPickupDate] = useState("")

  // Accordion state
  const [expandedSection, setExpandedSection] = useState<string | null>("sender")

  // Load quote and search params
  useEffect(() => {
    const selectedQuote = getStorageItem<Quote>(StorageKey.SELECTED_QUOTE)
    const cachedSearch = getStorageItem<QuoteRequest>(StorageKey.QUOTE_SEARCH)

    if (!selectedQuote) {
      toast.error("No quote selected. Please select a quote first.")
      router.push("/fetch-quotes")
      return
    }

    setQuote(selectedQuote)
    setSearchParams(cachedSearch)

    // Set minimum pickup date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setPickupDate(tomorrow.toISOString().split('T')[0])

    setLoading(false)
  }, [router])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const validateForm = (): boolean => {
    // Sender validation
    if (!senderName.trim()) {
      toast.error("Please enter sender name")
      setExpandedSection("sender")
      return false
    }
    if (!senderEmail.trim() || !senderEmail.includes("@")) {
      toast.error("Please enter a valid sender email")
      setExpandedSection("sender")
      return false
    }
    if (!senderPhone.trim()) {
      toast.error("Please enter sender phone number")
      setExpandedSection("sender")
      return false
    }
    if (!senderAddress1.trim()) {
      toast.error("Please enter sender address")
      setExpandedSection("sender")
      return false
    }
    if (!senderPostalCode.trim()) {
      toast.error("Please enter sender postal code")
      setExpandedSection("sender")
      return false
    }

    // Receiver validation
    if (!receiverName.trim()) {
      toast.error("Please enter receiver name")
      setExpandedSection("receiver")
      return false
    }
    if (!receiverEmail.trim() || !receiverEmail.includes("@")) {
      toast.error("Please enter a valid receiver email")
      setExpandedSection("receiver")
      return false
    }
    if (!receiverPhone.trim()) {
      toast.error("Please enter receiver phone number")
      setExpandedSection("receiver")
      return false
    }
    if (!receiverAddress1.trim()) {
      toast.error("Please enter receiver address")
      setExpandedSection("receiver")
      return false
    }
    if (!receiverPostalCode.trim()) {
      toast.error("Please enter receiver postal code")
      setExpandedSection("receiver")
      return false
    }

    // Pickup validation
    if (pickupType === "scheduled_pickup" && !pickupDate) {
      toast.error("Please select a pickup date")
      setExpandedSection("pickup")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm() || !quote || !searchParams) return

    setSubmitting(true)

    try {
      const originAddress: Address = {
        name: senderName,
        email: senderEmail,
        phone: senderPhone,
        address_line_1: senderAddress1,
        address_line_2: senderAddress2 || undefined,
        city: searchParams.origin.city || searchParams.origin.state,
        state: searchParams.origin.state,
        postal_code: senderPostalCode,
        country: searchParams.origin.country,
      }

      const destinationAddress: Address = {
        name: receiverName,
        email: receiverEmail,
        phone: receiverPhone,
        address_line_1: receiverAddress1,
        address_line_2: receiverAddress2 || undefined,
        city: searchParams.destination.city || searchParams.destination.state,
        state: searchParams.destination.state,
        postal_code: receiverPostalCode,
        country: searchParams.destination.country,
      }

      const shipmentData: CreateShipmentRequest = {
        quote_id: quote.quote_id,
        channel_code: "web",
        is_insured: searchParams.is_insured,
        save_origin_address: false,
        save_destination_address: false,
        items: searchParams.items,
        origin_address: originAddress,
        destination_address: destinationAddress,
        pickup_type: pickupType,
        pickup_scheduled_at: pickupType === "scheduled_pickup" ? pickupDate : undefined,
        customer_notes: null,
      }

      const response = await createShipment(shipmentData)

      console.log(response)
      if (response.status === "success") {
        toast.success("Shipment created successfully!")
        // Navigate to payment page with shipment ID
        router.push(`/payment/${response.data.id}`)
      }
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setSubmitting(false)
    }
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

  if (!quote || !searchParams) {
    return null
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      {/* Top App Bar */}
      <div className="flex items-center border-b border-slate-200 bg-white p-4">
        <Link href="/fetch-quotes" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-slate-900 pl-4 flex-1">Step 3: Shipment Details</h1>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-slate-700">Details</span>
            </div>
            <div className="flex-1 h-1 bg-primary mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-slate-700">Quote</span>
            </div>
            <div className="flex-1 h-1 bg-primary mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-slate-900">Shipment</span>
            </div>
            <div className="flex-1 h-1 bg-slate-200 mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="text-sm font-medium text-slate-400">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {/* Selected Quote Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Selected Quote</h2>
                <p className="text-sm text-slate-600">
                  {quote.display_name} • {quote.service_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(quote.total_amount, quote.currency)}
                </p>
                <Badge variant="info" className="mt-1">
                  {quote.estimated_days} {quote.estimated_days === 1 ? 'day' : 'days'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-4">
            {/* Sender Information */}
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleSection("sender")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📤</span>
                  <h3 className="text-lg font-bold text-slate-900">Sender Information</h3>
                </div>
                <svg
                  className={`h-5 w-5 text-slate-600 transition-transform ${expandedSection === "sender" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedSection === "sender" && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-200 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+234909493991"
                      required
                    />
                    <Input
                      label="Postal Code"
                      value={senderPostalCode}
                      onChange={(e) => setSenderPostalCode(e.target.value)}
                      placeholder="11111"
                      required
                    />
                    <Input
                      label="Address Line 1"
                      value={senderAddress1}
                      onChange={(e) => setSenderAddress1(e.target.value)}
                      placeholder="123 Main Street"
                      required
                      className="md:col-span-2"
                    />
                    <Input
                      label="Address Line 2 (Optional)"
                      value={senderAddress2}
                      onChange={(e) => setSenderAddress2(e.target.value)}
                      placeholder="Apartment, suite, etc."
                      className="md:col-span-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Receiver Information */}
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleSection("receiver")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📥</span>
                  <h3 className="text-lg font-bold text-slate-900">Receiver Information</h3>
                </div>
                <svg
                  className={`h-5 w-5 text-slate-600 transition-transform ${expandedSection === "receiver" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedSection === "receiver" && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-200 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Jane Smith"
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="+1234567890"
                      required
                    />
                    <Input
                      label="Postal Code"
                      value={receiverPostalCode}
                      onChange={(e) => setReceiverPostalCode(e.target.value)}
                      placeholder="10001"
                      required
                    />
                    <Input
                      label="Address Line 1"
                      value={receiverAddress1}
                      onChange={(e) => setReceiverAddress1(e.target.value)}
                      placeholder="456 Broadway"
                      required
                      className="md:col-span-2"
                    />
                    <Input
                      label="Address Line 2 (Optional)"
                      value={receiverAddress2}
                      onChange={(e) => setReceiverAddress2(e.target.value)}
                      placeholder="Apartment, suite, etc."
                      className="md:col-span-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Pickup & Delivery */}
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleSection("pickup")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📦</span>
                  <h3 className="text-lg font-bold text-slate-900">Pickup & Delivery</h3>
                </div>
                <svg
                  className={`h-5 w-5 text-slate-600 transition-transform ${expandedSection === "pickup" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedSection === "pickup" && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-200 bg-slate-50">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-medium text-slate-800 mb-3">
                        Pickup Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="pickupType"
                            value="scheduled_pickup"
                            checked={pickupType === "scheduled_pickup"}
                            onChange={(e) => setPickupType(e.target.value as "scheduled_pickup")}
                            className="h-4 w-4 text-primary focus:ring-primary"
                          />
                          <span className="text-slate-900">Scheduled Pickup</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="pickupType"
                            value="drop_off"
                            checked={pickupType === "drop_off"}
                            onChange={(e) => setPickupType(e.target.value as "drop_off")}
                            className="h-4 w-4 text-primary focus:ring-primary"
                          />
                          <span className="text-slate-900">Drop Off</span>
                        </label>
                      </div>
                    </div>

                    {pickupType === "scheduled_pickup" && (
                      <Input
                        label="Pickup Date"
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        required
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              onClick={() => router.push("/fetch-quotes")}
              variant="outline"
              disabled={submitting}
            >
              Back to Quotes
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating Shipment...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
