"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Quote, QuoteRequest, ShipmentItemUI, QuoteItem } from "@/types/quote"
import type { CreateShipmentRequest, Address } from "@/types/shipment"
import type { Category } from "@/types/category"
import { getStorageItem, StorageKey } from "@/lib/utils/storage"
import { formatCurrency } from "@/lib/utils/format"
import { createShipment } from "@/lib/api/shipments"
import { categoriesApi } from "@/lib/api/categories"
import { quotesApi } from "@/lib/api/quotes"
import { handleApiError } from "@/lib/utils/error-handler"
import { LoadingSpinner, Button, Input, Badge, Select, CityAutocomplete } from "@/components/ui"
import { COUNTRIES, PACKAGE_TYPES, getStatesOfCountry, getCitiesOfState } from "@/lib/data/countries"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()

  // State
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<QuoteRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Categories
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Items
  const [items, setItems] = useState<ShipmentItemUI[]>([
    {
      id: crypto.randomUUID(),
      categoryId: "",
      description: "",
      packageType: "box",
      quantity: "1",
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      declaredValue: "",
    },
  ])

  // Form state - Sender
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [senderPhone, setSenderPhone] = useState("")
  const [senderAddress1, setSenderAddress1] = useState("")
  const [senderAddress2, setSenderAddress2] = useState("")
  const [senderPostalCode, setSenderPostalCode] = useState("")
  const [senderCountry, setSenderCountry] = useState("")
  const [senderState, setSenderState] = useState("")
  const [senderCity, setSenderCity] = useState("")

  // Form state - Receiver
  const [receiverName, setReceiverName] = useState("")
  const [receiverEmail, setReceiverEmail] = useState("")
  const [receiverPhone, setReceiverPhone] = useState("")
  const [receiverAddress1, setReceiverAddress1] = useState("")
  const [receiverAddress2, setReceiverAddress2] = useState("")
  const [receiverPostalCode, setReceiverPostalCode] = useState("")
  const [receiverCountry, setReceiverCountry] = useState("")
  const [receiverState, setReceiverState] = useState("")
  const [receiverCity, setReceiverCity] = useState("")

  // Form state - Pickup
  const [pickupType, setPickupType] = useState<"scheduled_pickup" | "drop_off">("scheduled_pickup")
  const [pickupDate, setPickupDate] = useState("")

  // Accordion state
  const [expandedSection, setExpandedSection] = useState<string | null>("items")

  // Step state: 'details' or 'quotes'
  const [step, setStep] = useState<'details' | 'quotes'>('details')

  const PACKAGE_DEFAULT_WEIGHTS: Record<string, number> = {
    envelope: 0.2,
    box: 1,
    pallet: 10,
    tube: 0.5,
    pak: 0.3,
  }

  // Get available states and cities
  const senderStates = getStatesOfCountry(senderCountry)
  const receiverStates = getStatesOfCountry(receiverCountry)
  const senderCities = senderState ? getCitiesOfState(senderCountry, senderState) : []
  const receiverCities = receiverState ? getCitiesOfState(receiverCountry, receiverState) : []

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.getCategories()

        // Deduplicate categories by group_tag
        const uniqueCategories = data.reduce((acc: Category[], current) => {
          const exists = acc.find((item) => item.group_tag === current.group_tag)
          if (!exists) {
            acc.push(current)
          }
          return acc
        }, [])

        setCategories(uniqueCategories)

        // Set default category for first item
        if (uniqueCategories.length > 0 && items[0]) {
          updateItem(0, { categoryId: uniqueCategories[0].id })
        }
      } catch (error) {
        handleApiError(error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Load initial data and search params
  useEffect(() => {
    const initialQuote = getStorageItem<Quote>(StorageKey.SELECTED_QUOTE)
    const cachedSearch = getStorageItem<QuoteRequest>(StorageKey.QUOTE_SEARCH)

    if (!cachedSearch) {
      toast.error("No shipment data found. Please start from the beginning.")
      router.push("/create-shipment")
      return
    }

    // Set the initially selected quote if available
    if (initialQuote) {
      setSelectedQuote(initialQuote)
    }
    setSearchParams(cachedSearch)

    // Prefill location data from quote search
    if (cachedSearch) {
      // Sender (origin)
      setSenderCountry(cachedSearch.origin.country)
      // Convert state name back to state code for the dropdown
      const originStates = getStatesOfCountry(cachedSearch.origin.country)
      const originStateObj = originStates.find(s => s.name.toLowerCase() === cachedSearch.origin.state.toLowerCase())
      if (originStateObj) {
        setSenderState(originStateObj.code)
      }
      if (cachedSearch.origin.city) {
        setSenderCity(cachedSearch.origin.city)
      }

      // Receiver (destination)
      setReceiverCountry(cachedSearch.destination.country)
      // Convert state name back to state code for the dropdown
      const destStates = getStatesOfCountry(cachedSearch.destination.country)
      const destStateObj = destStates.find(s => s.name.toLowerCase() === cachedSearch.destination.state.toLowerCase())
      if (destStateObj) {
        setReceiverState(destStateObj.code)
      }
      if (cachedSearch.destination.city) {
        setReceiverCity(cachedSearch.destination.city)
      }
    }

    // Set minimum pickup date to tomorrow
    const today = new Date()
    setPickupDate(today.toISOString().split('T')[0])

    setLoading(false)
  }, [router])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Item management functions
  const addItem = () => {
    const newItem: ShipmentItemUI = {
      id: crypto.randomUUID(),
      categoryId: categories[0]?.id || "",
      description: "",
      packageType: "box",
      quantity: "1",
      weight: "1",
      dimensions: { length: "", width: "", height: "" },
      declaredValue: "",
    }
    setItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, updates: Partial<ShipmentItemUI>) => {
    setItems(items.map((item, i) => (i === index ? { ...item, ...updates } : item)))
  }

  const handlePackageTypeChange = (index: number, value: string) => {
    const defaultWeight = PACKAGE_DEFAULT_WEIGHTS[value]
    updateItem(index, {
      packageType: value as any,
      weight: defaultWeight ? defaultWeight.toString() : items[index].weight,
    })
  }

  const fetchQuotesForReview = async () => {
    if (!validateDetailsForm()) return

    setQuotesLoading(true)
    setExpandedSection(null)

    try {
      // Convert state codes back to state names for the API
      const senderStateName = senderStates.find(s => s.code === senderState)?.name || senderState
      const receiverStateName = receiverStates.find(s => s.code === receiverState)?.name || receiverState

      // Build items array with current form data
      const shipmentItems: QuoteItem[] = items.map((item): QuoteItem => {
        const category = categories.find((c) => c.id === item.categoryId)!
        return {
          category_id: category.id,
          category_name: category.name,
          category_description: category.description,
          category_hs_code: category.hs_code,
          category_group_tag: category.group_tag,
          description: item.description,
          package_type: item.packageType,
          quantity: parseInt(item.quantity),
          weight: parseFloat(item.weight),
          length: item.dimensions.length ? parseFloat(item.dimensions.length) : undefined,
          width: item.dimensions.width ? parseFloat(item.dimensions.width) : undefined,
          height: item.dimensions.height ? parseFloat(item.dimensions.height) : undefined,
          declared_value: parseFloat(item.declaredValue),
        }
      })

      const quoteRequest: QuoteRequest = {
        origin: {
          country: senderCountry,
          state: senderStateName.toLowerCase(),
          city: senderCity.toLowerCase() || undefined,
        },
        destination: {
          country: receiverCountry,
          state: receiverStateName.toLowerCase(),
          city: receiverCity.toLowerCase() || undefined,
        },
        items: shipmentItems,
        currency: searchParams?.currency || "NGN",
        is_insured: searchParams?.is_insured || true,
      }

      // Fetch fresh quotes
      const fetchedQuotes = await quotesApi.fetchQuotes(quoteRequest)
      setQuotes(fetchedQuotes)

      // Auto-select quote: try to find the previously selected one, otherwise select first
      if (selectedQuote) {
        const matchingQuote = fetchedQuotes.find(q => q.quote_id === selectedQuote.quote_id)
        if (matchingQuote) {
          setSelectedQuote(matchingQuote)
        } else if (fetchedQuotes.length > 0) {
          setSelectedQuote(fetchedQuotes[0])
        }
      } else if (fetchedQuotes.length > 0) {
        setSelectedQuote(fetchedQuotes[0])
      }

      // Update search params
      setSearchParams(quoteRequest)

      // Move to quotes step
      setStep('quotes')
      toast.success(`Found ${fetchedQuotes.length} shipping quotes!`)
    } catch (error) {
      handleApiError(error)
    } finally {
      setQuotesLoading(false)
    }
  }

  const validateDetailsForm = (): boolean => {
    // Items validation
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.categoryId) {
        toast.error(`Please select category for item ${i + 1}`)
        setExpandedSection("items")
        return false
      }
      if (!item.description.trim()) {
        toast.error(`Please enter description for item ${i + 1}`)
        setExpandedSection("items")
        return false
      }
      if (!item.weight || parseFloat(item.weight) <= 0) {
        toast.error(`Please enter valid weight for item ${i + 1}`)
        setExpandedSection("items")
        return false
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        toast.error(`Please enter valid quantity for item ${i + 1}`)
        setExpandedSection("items")
        return false
      }
      if (!item.declaredValue || parseFloat(item.declaredValue) <= 0) {
        toast.error(`Please enter declared value for item ${i + 1}`)
        setExpandedSection("items")
        return false
      }
    }

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
    if (!senderCountry) {
      toast.error("Please select sender country")
      setExpandedSection("sender")
      return false
    }
    if (!senderState) {
      toast.error("Please select sender state")
      setExpandedSection("sender")
      return false
    }
    if (!senderCity.trim()) {
      toast.error("Please enter sender city")
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
    if (!receiverCountry) {
      toast.error("Please select receiver country")
      setExpandedSection("receiver")
      return false
    }
    if (!receiverState) {
      toast.error("Please select receiver state")
      setExpandedSection("receiver")
      return false
    }
    if (!receiverCity.trim()) {
      toast.error("Please enter receiver city")
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
    if (!selectedQuote || !searchParams) {
      toast.error("Please select a quote")
      return
    }

    setSubmitting(true)

    try {
      // Convert state codes back to state names for the API
      const senderStateName = senderStates.find(s => s.code === senderState)?.name || senderState
      const receiverStateName = receiverStates.find(s => s.code === receiverState)?.name || receiverState

      const originAddress: Address = {
        name: senderName,
        email: senderEmail,
        phone: senderPhone,
        address_line_1: senderAddress1,
        address_line_2: senderAddress2 || undefined,
        city: senderCity.toLowerCase(),
        state: senderStateName.toLowerCase(),
        postal_code: senderPostalCode,
        country: senderCountry,
      }

      const destinationAddress: Address = {
        name: receiverName,
        email: receiverEmail,
        phone: receiverPhone,
        address_line_1: receiverAddress1,
        address_line_2: receiverAddress2 || undefined,
        city: receiverCity.toLowerCase(),
        state: receiverStateName.toLowerCase(),
        postal_code: receiverPostalCode,
        country: receiverCountry,
      }

      // Build items array with current form data
      const shipmentItems: QuoteItem[] = items.map((item): QuoteItem => {
        const category = categories.find((c) => c.id === item.categoryId)!
        return {
          category_id: category.id,
          category_name: category.name,
          category_description: category.description,
          category_hs_code: category.hs_code,
          category_group_tag: category.group_tag,
          description: item.description,
          package_type: item.packageType,
          quantity: parseInt(item.quantity),
          weight: parseFloat(item.weight),
          length: item.dimensions.length ? parseFloat(item.dimensions.length) : undefined,
          width: item.dimensions.width ? parseFloat(item.dimensions.width) : undefined,
          height: item.dimensions.height ? parseFloat(item.dimensions.height) : undefined,
          declared_value: parseFloat(item.declaredValue),
        }
      })

      const shipmentData: CreateShipmentRequest = {
        quote_id: selectedQuote.quote_id,
        channel_code: "web",
        is_insured: searchParams.is_insured,
        save_origin_address: false,
        save_destination_address: false,
        items: shipmentItems,
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

  if (!searchParams) {
    return null
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      {/* Top App Bar */}
      <div className="flex items-center border-b border-slate-200 bg-white p-4">
        <button
          onClick={() => step === 'quotes' ? setStep('details') : router.push("/create-shipment")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-900 pl-4 flex-1">
          {step === 'details' ? 'Step 2: Shipment Details' : 'Step 3: Select Quote'}
        </h1>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-700">Route</span>
            </div>
            <div className={`flex-1 h-1 mx-2 md:mx-3 ${step === 'quotes' ? 'bg-primary' : 'bg-slate-200'}`}></div>
            <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
              <div className={`h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center text-sm font-bold ${step === 'quotes' ? 'bg-primary text-white' : 'bg-primary text-white'}`}>
                {step === 'quotes' ? '✓' : '2'}
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-900">Details</span>
            </div>
            <div className={`flex-1 h-1 mx-2 md:mx-3 ${step === 'quotes' ? 'bg-primary' : 'bg-slate-200'}`}></div>
            <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
              <div className={`h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center text-sm font-bold ${step === 'quotes' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
                3
              </div>
              <span className={`hidden md:block text-sm font-medium ${step === 'quotes' ? 'text-slate-900' : 'text-slate-400'}`}>Quote</span>
            </div>
            <div className="flex-1 h-1 bg-slate-200 mx-2 md:mx-3"></div>
            <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
              <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-400">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {step === 'details' ? (
            <>

          {/* Form Sections */}
          <div className="space-y-4">
            {/* Items Section */}
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleSection("items")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📦</span>
                  <h3 className="text-lg font-bold text-slate-900">Items ({items.length})</h3>
                </div>
                <svg
                  className={`h-5 w-5 text-slate-600 transition-transform ${expandedSection === "items" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedSection === "items" && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-200 bg-slate-50">
                  <div className="space-y-6">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-slate-300 bg-white p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base font-bold text-slate-900">
                            Item {index + 1}
                          </h4>
                          {items.length > 1 && (
                            <button
                              onClick={() => removeItem(index)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                              aria-label="Remove item"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col gap-4">
                          <Select
                            label="Item Category"
                            value={item.categoryId}
                            onChange={(e) => updateItem(index, { categoryId: e.target.value })}
                            options={categories.map((c) => ({ value: c.id, label: c.name, key: c.id }))}
                          />

                          {item.categoryId && (
                            <div className="rounded-lg bg-slate-50 p-3 text-sm">
                              <p className="text-slate-600">
                                {categories.find((c) => c.id === item.categoryId)?.description}
                              </p>
                              <p className="text-slate-500 text-xs mt-1">
                                HS Code: {categories.find((c) => c.id === item.categoryId)?.hs_code}
                              </p>
                            </div>
                          )}

                          <Input
                            label="Item Description"
                            value={item.description}
                            onChange={(e) => updateItem(index, { description: e.target.value })}
                            placeholder="e.g., Leather backpack with laptop compartment"
                          />

                          <Select
                            label="Package Type"
                            value={item.packageType}
                            onChange={(e) => handlePackageTypeChange(index, e.target.value)}
                            options={PACKAGE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Quantity"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, { quantity: e.target.value })}
                              placeholder="1"
                              min="1"
                              step="1"
                            />

                            <Input
                              label="Weight (kg)"
                              type="number"
                              value={item.weight}
                              onChange={(e) => {
                                const newWeight = e.target.value
                                if (item.packageType !== "other") {
                                  updateItem(index, { packageType: "other", weight: newWeight })
                                } else {
                                  updateItem(index, { weight: newWeight })
                                }
                              }}
                              placeholder="2.5"
                              step="0.1"
                              min="0.1"
                            />
                          </div>

                          <div>
                            <p className="pb-2 text-sm font-medium text-slate-800">
                              Dimensions (cm) - Optional
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                              <Input
                                type="number"
                                value={item.dimensions.length}
                                onChange={(e) =>
                                  updateItem(index, {
                                    dimensions: { ...item.dimensions, length: e.target.value },
                                  })
                                }
                                placeholder="Length"
                                step="0.1"
                                min="0"
                              />
                              <Input
                                type="number"
                                value={item.dimensions.width}
                                onChange={(e) =>
                                  updateItem(index, {
                                    dimensions: { ...item.dimensions, width: e.target.value },
                                  })
                                }
                                placeholder="Width"
                                step="0.1"
                                min="0"
                              />
                              <Input
                                type="number"
                                value={item.dimensions.height}
                                onChange={(e) =>
                                  updateItem(index, {
                                    dimensions: { ...item.dimensions, height: e.target.value },
                                  })
                                }
                                placeholder="Height"
                                step="0.1"
                                min="0"
                              />
                            </div>
                          </div>

                          <Input
                            label="Declared Value"
                            type="number"
                            value={item.declaredValue}
                            onChange={(e) => updateItem(index, { declaredValue: e.target.value })}
                            placeholder="1000"
                            step="0.01"
                            min="0.01"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add Item Button */}
                    <button
                      onClick={addItem}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-slate-600 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="font-medium">Add Another Item</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

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
                    <Select
                      label="Country"
                      value={senderCountry}
                      onChange={(e) => {
                        setSenderCountry(e.target.value)
                        setSenderState("")
                        setSenderCity("")
                      }}
                      options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                    />
                    <Select
                      label="State"
                      value={senderState}
                      onChange={(e) => {
                        setSenderState(e.target.value)
                        setSenderCity("")
                      }}
                      options={[
                        { value: "", label: "Select state..." },
                        ...senderStates.map((s) => ({ value: s.code, label: s.name })),
                      ]}
                    />
                    <CityAutocomplete
                      label="City"
                      value={senderCity}
                      onChange={setSenderCity}
                      cities={senderCities}
                      placeholder="Enter city"
                      disabled={!senderState}
                    />
                    <div></div>
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
                    <Select
                      label="Country"
                      value={receiverCountry}
                      onChange={(e) => {
                        setReceiverCountry(e.target.value)
                        setReceiverState("")
                        setReceiverCity("")
                      }}
                      options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                    />
                    <Select
                      label="State"
                      value={receiverState}
                      onChange={(e) => {
                        setReceiverState(e.target.value)
                        setReceiverCity("")
                      }}
                      options={[
                        { value: "", label: "Select state..." },
                        ...receiverStates.map((s) => ({ value: s.code, label: s.name })),
                      ]}
                    />
                    <CityAutocomplete
                      label="City"
                      value={receiverCity}
                      onChange={setReceiverCity}
                      cities={receiverCities}
                      placeholder="Enter city"
                      disabled={!receiverState}
                    />
                    <div></div>
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
                  <span className="text-lg">🚚</span>
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
    min={new Date().toISOString().split('T')[0]}
    required
  />
)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Details Step */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-8">
            <Button
              onClick={() => router.push("/create-shipment")}
              variant="outline"
              disabled={quotesLoading}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <Button
              onClick={fetchQuotesForReview}
              disabled={quotesLoading}
              className="w-full sm:flex-1"
            >
              {quotesLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Fetching Quotes...
                </>
              ) : (
                "Review Quotes"
              )}
            </Button>
          </div>
            </>
          ) : (
            <>
              {/* Quotes List */}
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div
                    key={quote.quote_id}
                    onClick={() => setSelectedQuote(quote)}
                    className={`cursor-pointer rounded-xl border-2 bg-white p-4 md:p-6 shadow-sm transition-all hover:shadow-md ${
                      selectedQuote?.quote_id === quote.quote_id
                        ? "border-primary bg-primary/5"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {quote.logo_url ? (
                            <img
                              src={quote.logo_url}
                              alt={quote.display_name}
                              className="h-12 w-12 object-contain"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                              <span className="text-xl">📦</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            {quote.display_name}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {quote.service_name}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="info">
                              {quote.estimated_days} {quote.estimated_days === 1 ? 'day' : 'days'}
                            </Badge>
                            {quote.is_insured && (
                              <Badge variant="success">
                                Insured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-bold text-slate-900">
                          {formatCurrency(quote.total_amount, quote.currency)}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Total cost
                        </p>
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {selectedQuote?.quote_id === quote.quote_id && (
                      <div className="mt-4 pt-4 border-t border-primary/20">
                        <div className="flex items-center gap-2 text-primary">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">Selected</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons - Quotes Step */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-8">
                <Button
                  onClick={() => setStep('details')}
                  variant="outline"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  Back to Details
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !selectedQuote}
                  className="w-full sm:flex-1"
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}
