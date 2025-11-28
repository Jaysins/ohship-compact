"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { categoriesApi } from "@/lib/api/categories"
import { quotesApi } from "@/lib/api/quotes"
import type { Category } from "@/types/category"
import type { QuoteRequest } from "@/types/quote"
import { COUNTRIES, CURRENCIES, PACKAGE_TYPES } from "@/lib/data/countries"
import { handleApiError, showSuccess } from "@/lib/utils/error-handler"
import { setStorageItem, getStorageItem, StorageKey } from "@/lib/utils/storage"
import { Button, Input, Select, LoadingSpinner } from "@/components/ui"

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

  // Form state - Item details
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [itemDescription, setItemDescription] = useState("")
  const [packageType, setPackageType] = useState<"envelope" | "box" | "pallet" | "tube" | "pak">("box")
  const [quantity, setQuantity] = useState("1")
  const [weight, setWeight] = useState("")
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" })
  const [declaredValue, setDeclaredValue] = useState("")

  // Form state - Other
  const [currency, setCurrency] = useState("NGN")
  const [isInsured, setIsInsured] = useState(true)

  // Get available states for selected countries
  const originStates = COUNTRIES.find((c) => c.code === originCountry)?.states || []
  const destStates = COUNTRIES.find((c) => c.code === destCountry)?.states || []

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
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0])
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
      setItemDescription(draft.itemDescription || "")
      setPackageType(draft.packageType || "box")
      setQuantity(draft.quantity || "1")
      setWeight(draft.weight || "")
      setDimensions(draft.dimensions || { length: "", width: "", height: "" })
      setDeclaredValue(draft.declaredValue || "")
      setCurrency(draft.currency || "NGN")
      setIsInsured(draft.isInsured !== undefined ? draft.isInsured : true)

      // Restore selected category
      if (draft.categoryId && categories.length > 0) {
        const cat = categories.find(c => c.id === draft.categoryId)
        if (cat) setSelectedCategory(cat)
      }
    }
  }, [categories])

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
        categoryId: selectedCategory?.id,
        itemDescription,
        packageType,
        quantity,
        weight,
        dimensions,
        declaredValue,
        currency,
        isInsured,
      }
      setStorageItem(StorageKey.SHIPMENT_DRAFT, draft)
    }, 1000)

    return () => clearTimeout(saveTimer)
  }, [originCountry, originState, originCity, destCountry, destState, destCity, selectedCategory, itemDescription, packageType, quantity, weight, dimensions, declaredValue, currency, isInsured])

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      setSelectedCategory(category)
    }
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

    if (!selectedCategory) {
      handleApiError(new Error("Please select item category"))
      return
    }
    if (!itemDescription.trim()) {
      handleApiError(new Error("Please enter item description"))
      return
    }
    if (!weight || parseFloat(weight) <= 0) {
      handleApiError(new Error("Please enter a valid weight"))
      return
    }
    if (!quantity || parseInt(quantity) <= 0) {
      handleApiError(new Error("Please enter a valid quantity"))
      return
    }
    if (!declaredValue || parseFloat(declaredValue) <= 0) {
      handleApiError(new Error("Please enter declared value"))
      return
    }

    setLoading(true)

    try {
      const quoteRequest: QuoteRequest = {
        origin: {
          country: originCountry,
          state: originState.toLowerCase(),
          city: originCity.toLowerCase() || undefined,
        },
        destination: {
          country: destCountry,
          state: destState.toLowerCase(),
          city: destCity.toLowerCase() || undefined,
        },
        items: [
          {
            category_id: selectedCategory.id,
            category_name: selectedCategory.name,
            category_description: selectedCategory.description,
            category_hs_code: selectedCategory.hs_code,
            category_group_tag: selectedCategory.group_tag,
            description: itemDescription,
            package_type: packageType,
            quantity: parseInt(quantity),
            weight: parseFloat(weight),
            length: dimensions.length ? parseFloat(dimensions.length) : undefined,
            width: dimensions.width ? parseFloat(dimensions.width) : undefined,
            height: dimensions.height ? parseFloat(dimensions.height) : undefined,
            declared_value: parseFloat(declaredValue),
          },
        ],
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
                    }}
                    options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                  />

                  <Select
                    label="State"
                    value={originState}
                    onChange={(e) => setOriginState(e.target.value)}
                    options={[
                      { value: "", label: "Select state..." },
                      ...originStates.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
                    ]}
                  />

                  <Input
                    label="City"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="Enter city"
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
                    }}
                    options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                  />

                  <Select
                    label="State"
                    value={destState}
                    onChange={(e) => setDestState(e.target.value)}
                    options={[
                      { value: "", label: "Select state..." },
                      ...destStates.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
                    ]}
                  />

                  <Input
                    label="City"
                    value={destCity}
                    onChange={(e) => setDestCity(e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
              </div>
            </div>

            {/* Package Details Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Package Information</h2>
              <div className="mt-6 flex flex-col gap-6">
                <Select
                  label="Item Category"
                  value={selectedCategory?.id || ""}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  options={categories.map((c) => ({ value: c.id, label: c.name, key: c.id }))}
                />

                {selectedCategory && (
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm">
                    <p className="text-slate-600 dark:text-slate-400">{selectedCategory.description}</p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
                      HS Code: {selectedCategory.hs_code}
                    </p>
                  </div>
                )}

                <Input
                  label="Item Description"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="e.g., Leather backpack with laptop compartment"
                />

                <Select
                  label="Package Type"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value as any)}
                  options={PACKAGE_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="1"
                    min="1"
                    step="1"
                  />

                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="2.5"
                    step="0.1"
                    min="0.1"
                  />
                </div>

                <div>
                  <p className="pb-3 text-base font-medium text-slate-800 dark:text-slate-200">Dimensions (cm) - Optional</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                      placeholder="Length"
                      step="0.1"
                      min="0"
                    />
                    <Input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                      placeholder="Width"
                      step="0.1"
                      min="0"
                    />
                    <Input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                      placeholder="Height"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="Declared Value"
                    type="number"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                    placeholder="1000"
                    step="0.01"
                    min="0.01"
                  />

                  <Select
                    label="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    options={CURRENCIES.map((c) => ({ value: c.code, label: c.name }))}
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
        <div className="mx-auto flex max-w-3xl justify-end px-4">
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
