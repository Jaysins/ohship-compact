"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { categoriesApi } from "@/lib/api/categories"
import { quotesApi } from "@/lib/api/quotes"
import type { Category } from "@/types/category"
import type { QuoteItem, QuoteRequest, ShipmentItemUI } from "@/types/quote"
import { COUNTRIES, CURRENCIES, PACKAGE_TYPES, getStatesOfCountry, getCitiesOfState } from "@/lib/data/countries"
import { handleApiError, showSuccess } from "@/lib/utils/error-handler"
import { setStorageItem, getStorageItem, StorageKey } from "@/lib/utils/storage"
import { Button, Input, Select, LoadingSpinner, CityAutocomplete } from "@/components/ui"


export default function CreateShipmentPage() {
  const router = useRouter()

  // Loading states
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Categories
  const [categories, setCategories] = useState<Category[]>([])

  // Form state - Origin
  const [originCountry, setOriginCountry] = useState("NG")
  const [originState, setOriginState] = useState("")
  const [originCity, setOriginCity] = useState("")

  // Form state - Destination
  const [destCountry, setDestCountry] = useState("US")
  const [destState, setDestState] = useState("")
  const [destCity, setDestCity] = useState("")

  // Form state - Items (multiple)
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

  // Form state - Other
  const [currency, setCurrency] = useState("NGN")
  const [isInsured, setIsInsured] = useState(true)

  // Get available states and cities for selected countries
  const originStates = getStatesOfCountry(originCountry)
  const destStates = getStatesOfCountry(destCountry)
  const originCities = originState ? getCitiesOfState(originCountry, originState) : []
  const destCities = destState ? getCitiesOfState(destCountry, destState) : []
  
  const PACKAGE_DEFAULT_WEIGHTS: Record<string, number> = {
    envelope: 0.2,
    box: 1,
    pallet: 10,
    tube: 0.5,
    pak: 0.3,
  }

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

  // Load draft from localStorage
  useEffect(() => {
    const draft = getStorageItem<any>(StorageKey.SHIPMENT_DRAFT)
    if (draft) {
      setOriginCountry(draft.originCountry || "NG")
      setOriginState(draft.originState || "")
      setOriginCity(draft.originCity || "")
      setDestCountry(draft.destCountry || "US")
      setDestState(draft.destState || "")
      setDestCity(draft.destCity || "")
      setCurrency(draft.currency || "NGN")
      setIsInsured(draft.isInsured !== undefined ? draft.isInsured : true)

      // Restore items
      if (draft.items && Array.isArray(draft.items)) {
        setItems(draft.items)
      }
    }
  }, [])

  // Auto-save draft
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      const draft = {
        originCountry,
        originState,
        originCity,
        destCountry,
        destState,
        destCity,
        items,
        currency,
        isInsured,
      }
      setStorageItem(StorageKey.SHIPMENT_DRAFT, draft)
    }, 1000)

    return () => clearTimeout(saveTimer)
  }, [originCountry, originState, originCity, destCountry, destState, destCity, items, currency, isInsured])

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

  const handleGetQuotes = async () => {
    // Validation
    if (!originState) {
      handleApiError(new Error("Please select origin state"))
      return
    }
    if (!destState) {
      handleApiError(new Error("Please select destination state"))
      return
    }
    if (!originCity) {
      handleApiError(new Error("Please select origin city"))
      return
    }
    if (!destCity) {
      handleApiError(new Error("Please select destination city"))
      return
    }

    // Validate package details
    const item = items[0]
    if (!item.weight || parseFloat(item.weight) <= 0) {
      handleApiError(new Error("Please enter a valid weight"))
      return
    }
    if (!item.quantity || parseInt(item.quantity) <= 0) {
      handleApiError(new Error("Please enter a valid quantity"))
      return
    }
    if (!item.declaredValue || parseFloat(item.declaredValue) <= 0) {
      handleApiError(new Error("Please enter a valid declared value"))
      return
    }

    setLoading(true)

    try {
      // Convert state codes to state names for the API request
      const originStateName = originStates.find(s => s.code === originState)?.name || originState
      const destStateName = destStates.find(s => s.code === destState)?.name || destState

      const quoteRequest: QuoteRequest = {
        origin: {
          country: originCountry,
          state: originStateName.toLowerCase(),
          city: originCity.toLowerCase() || undefined,
        },
        destination: {
          country: destCountry,
          state: destStateName.toLowerCase(),
          city: destCity.toLowerCase() || undefined,
        },
        items: items.map((item): QuoteItem => {
          // Use default category (first one) since we're not collecting this on the form
          const category = categories[0] || {
            id: "default",
            name: "General Item",
            description: "General shipment item",
            hs_code: "0000.00.00",
            group_tag: "general"
          }

          return {
            category_id: category.id,
            category_name: category.name,
            category_description: category.description,
            category_hs_code: category.hs_code,
            category_group_tag: category.group_tag,
            description: "Shipment package", // Default description
            package_type: "box", // Default package type
            quantity: parseInt(item.quantity),
            weight: parseFloat(item.weight),
            length: undefined, // No dimensions collected
            width: undefined,
            height: undefined,
            declared_value: parseFloat(item.declaredValue),
          }
        }),
        currency: currency,
        is_insured: isInsured,
      }

      // Fetch quotes from API
      const quotes = await quotesApi.fetchQuotes(quoteRequest)

      // Store quotes and search params
      setStorageItem(StorageKey.QUOTES_CACHE, quotes)
      setStorageItem(StorageKey.QUOTE_SEARCH, quoteRequest)

      showSuccess(`Found ${quotes.length} shipping quotes!`)

      // Navigate to fetch quotes page
      router.push("/fetch-quotes")
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  if (categoriesLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-white dark:bg-slate-900">
        <header className="sticky top-0 z-10 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Go back"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Create a New Shipment</h1>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:py-12">
          <div className="mx-auto max-w-3xl flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Go back"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Create a New Shipment</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Step 1 of 3</p>
            <div className="flex w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-1.5 w-1/3 rounded-full bg-primary"></div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Shipment Route Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Shipment Route</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Origin */}
                <div className="flex flex-col gap-4">
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200">From</p>

                  <Select
                    label="Country"
                    value={originCountry}
                    onChange={(e) => {
                      setOriginCountry(e.target.value)
                      setOriginState("")
                      setOriginCity("")
                    }}
                    options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                  />

                  <Select
                    label="State"
                    value={originState}
                    onChange={(e) => {
                      setOriginState(e.target.value)
                      setOriginCity("")
                    }}
                    options={[
                      { value: "", label: "Select state..." },
                      ...originStates.map((s) => ({ value: s.code, label: s.name })),
                    ]}
                  />

                  <CityAutocomplete
                    label="City"
                    value={originCity}
                    onChange={setOriginCity}
                    cities={originCities}
                    placeholder="Enter city"
                    disabled={!originState}
                  />
                </div>

                {/* Destination */}
                <div className="flex flex-col gap-4">
                  <p className="text-base font-medium text-slate-800 dark:text-slate-200">To</p>

                  <Select
                    label="Country"
                    value={destCountry}
                    onChange={(e) => {
                      setDestCountry(e.target.value)
                      setDestState("")
                      setDestCity("")
                    }}
                    options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                  />

                  <Select
                    label="State"
                    value={destState}
                    onChange={(e) => {
                      setDestState(e.target.value)
                      setDestCity("")
                    }}
                    options={[
                      { value: "", label: "Select state..." },
                      ...destStates.map((s) => ({ value: s.code, label: s.name })),
                    ]}
                  />

                  <CityAutocomplete
                    label="City"
                    value={destCity}
                    onChange={setDestCity}
                    cities={destCities}
                    placeholder="Enter city"
                    disabled={!destState}
                  />
                </div>
              </div>
            </div>

            {/* Package Details Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6">Package Details</h2>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Input
                    label="Quantity"
                    type="number"
                    value={items[0].quantity}
                    onChange={(e) => updateItem(0, { quantity: e.target.value })}
                    placeholder="1"
                    min="1"
                    step="1"
                  />

                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={items[0].weight}
                    onChange={(e) => updateItem(0, { weight: e.target.value })}
                    placeholder="2.5"
                    step="0.1"
                    min="0.1"
                  />

                  <Input
                    label="Declared Value"
                    type="number"
                    value={items[0].declaredValue}
                    onChange={(e) => updateItem(0, { declaredValue: e.target.value })}
                    placeholder="1000"
                    step="0.01"
                    min="0.01"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={isInsured}
                    onChange={(e) => setIsInsured(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="insurance" className="text-base font-medium text-slate-800 dark:text-slate-200">
                    Add shipping insurance
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer CTA */}
      <footer className="sticky bottom-0 mt-auto w-full border-t border-slate-200 bg-white/80 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl justify-end items-center px-4">
          <Button
            onClick={handleGetQuotes}
            loading={loading}
            disabled={loading}
            size="lg"
            className="w-full md:w-auto"
          >
            Get Quotes
          </Button>
        </div>
      </footer>
    </div>
  )
}