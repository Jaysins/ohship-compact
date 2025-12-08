# Quote-to-Payment Flow Documentation

## Overview

This document details the complete quote-to-payment flow implementation, replacing the old caching-heavy approach with a backend-driven, stateless design that uses sessionStorage only for page transitions.

## Key Principles

1. **Backend Returns Complete Data** - Every API response includes all data needed for the next step
2. **Minimal SessionStorage Usage** - Used ONLY for page transitions, cleared after use
3. **Fresh Quotes on Changes** - Always fetch new quotes when user can modify data
4. **No Frontend ID Generation** - `quote_id` comes from backend's selected rate
5. **Stateless Pages** - Refresh sends user back to start (intentional UX decision)
6. **Update vs Create** - Conditional logic based on shipment existence

---

## Changes from Old Approach

### ❌ Old Approach (Don't Use)
- Stored quote data in localStorage/context on first fetch
- Reused cached quotes throughout entire flow
- Generated quote_id on frontend
- Heavy reliance on persistent caching
- Difficult to handle quote expiration
- Stale data issues when user changes inputs

### ✅ New Approach (Current)
- Backend returns complete response with all data
- SessionStorage used ONLY for page handoffs
- Quote_id from backend's rate object
- Fresh quotes fetched when data changes
- Auto-highlight previously selected quote if still valid
- Clean separation between create and update flows

---

## Complete Flow: Step by Step

### **Step 1: Create Shipment Page (Route Selection)**

**Purpose:** User enters basic shipment info to get initial quotes

**User Actions:**
1. Select origin (country, state, city)
2. Select destination (country, state, city)
3. Add basic item info (category, description, weight, value)
4. Click "Get Quotes"

**Implementation:**

```typescript
// 1. Build quote request (NO quote_id)
const quoteRequest: QuoteRequest = {
  origin: {
    country: "NG",
    state: "lagos",
    city: "ikeja"
  },
  destination: {
    country: "US",
    state: "california",
    city: "los angeles"
  },
  items: [
    {
      category_id: "cat_123",
      category_name: "Electronics",
      // ... other fields
      quantity: 1,
      weight: 2.5,
      declared_value: 50000
    }
  ],
  currency: "NGN",
  is_insured: true
  // NO quote_id, NO shipment_id
}

// 2. POST to /v1/quotes/
const response = await quotesApi.fetchQuotes(quoteRequest)

// 3. Backend returns COMPLETE response
{
  "status": "success",
  "message": "Quotes fetched successfully",
  "data": {
    "origin": {
      "city": "ikeja",
      "state": "lagos",
      "country": "NG",
      "address_line_1": null,
      "address_line_2": null,
      "postal_code": null
    },
    "destination": {
      "city": "los angeles",
      "state": "california",
      "country": "US",
      "address_line_1": null,
      "address_line_2": null,
      "postal_code": null
    },
    "items": [ /* original items array */ ],
    "is_insured": true,
    "promo_code": null,
    "quote_id": null,
    "preferred_service_type": null,
    "rates": [
      {
        "quote_id": "quote_abc123",  // ← THIS IS THE QUOTE ID
        "carrier_code": "DHL",
        "carrier_name": "DHL Express",
        "service_type": "express",
        "base_rate": 25000,
        "total_amount": 28500,
        "currency": "NGN",
        "estimated_days": 3,
        // ... other rate fields
      }
      // ... more rates
    ]
  }
}

// 4. Store ENTIRE response.data in sessionStorage temporarily
sessionStorage.setItem('temp-quote-response', JSON.stringify(response.data))

// 5. Navigate to fetch-quotes page
router.push("/fetch-quotes")
```

**Key Files:**
- `app/create-shipment/page.tsx`
- `types/quote.ts` - QuoteRequest, QuoteResponse interfaces

---

### **Step 2: Fetch Quotes Page (Quote Selection)**

**Purpose:** Display available quotes and let user select one

**User Actions:**
1. View list of available quotes with prices and delivery times
2. Select preferred quote
3. Click "Continue"

**Implementation:**

```typescript
// 1. Load data from sessionStorage on mount
useEffect(() => {
  const tempQuoteResponse = sessionStorage.getItem('temp-quote-response')

  if (!tempQuoteResponse) {
    // No data - user refreshed or navigated directly
    router.push("/create-shipment")
    return
  }

  const quoteData = JSON.parse(tempQuoteResponse)
  setQuoteResponseData(quoteData)
  setQuotes(quoteData.rates) // Display rates to user

  // Set state for UI rendering
  setOrigin(quoteData.origin)
  setDestination(quoteData.destination)
  setItems(quoteData.items)
}, [router])

// 2. User selects a quote
const handleSelectQuote = (quoteId: string) => {
  const selectedQuote = quotes.find(q => q.quote_id === quoteId)

  // 3. Store BOTH quote data AND selected quote_id
  sessionStorage.setItem('selected-quote-data', JSON.stringify({
    quoteData: quoteResponseData, // Full response from Step 1
    selectedQuoteId: selectedQuote.quote_id // The selected rate's quote_id
  }))

  // 4. Clean up temporary storage
  sessionStorage.removeItem('temp-quote-response')

  // 5. Navigate to checkout
  router.push("/checkout")
}
```

**Key Files:**
- `app/fetch-quotes/page.tsx`

---

### **Step 3: Checkout Page (Details Entry & Review)**

**Purpose:** Collect full shipment details and create shipment

**User Actions:**
1. View pre-filled location data
2. Fill in sender details (name, email, phone, address, postal code)
3. Fill in receiver details
4. Adjust items (description, weight, dimensions, value)
5. Select pickup type and date
6. Click "Review Quotes" to see updated pricing
7. Select final quote
8. Click "Continue to Payment" to create shipment

**Implementation:**

#### **3A. Initial Load (Normal Flow)**

```typescript
useEffect(() => {
  // Check if coming from payment page (review mode)
  if (mode === 'review') {
    // Handle review mode (see section 3C below)
    return
  }

  // Normal flow: load from quote selection
  const selectedQuoteDataStr = sessionStorage.getItem('selected-quote-data')

  if (!selectedQuoteDataStr) {
    toast.error("No shipment data found. Please start from the beginning.")
    router.push("/create-shipment")
    return
  }

  const { quoteData: selectedQuoteData, selectedQuoteId } = JSON.parse(selectedQuoteDataStr)

  // Populate React Context (in-memory state for current session)
  setQuoteData(selectedQuoteData)
  setSelectedQuoteId(selectedQuoteId)

  // Build search params for later use
  const initialSearchParams: QuoteRequest = {
    origin: {
      country: selectedQuoteData.origin.country,
      state: selectedQuoteData.origin.state,
      city: selectedQuoteData.origin.city || undefined
    },
    destination: {
      country: selectedQuoteData.destination.country,
      state: selectedQuoteData.destination.state,
      city: selectedQuoteData.destination.city || undefined
    },
    items: selectedQuoteData.items,
    currency: selectedQuoteData.rates[0]?.currency || "NGN",
    is_insured: selectedQuoteData.is_insured || true
  }
  setSearchParams(initialSearchParams)

  // Prefill ONLY location data (country, state, city)
  // User must fill everything else
  setSenderCountry(selectedQuoteData.origin.country)
  setSenderState(getStateCode(selectedQuoteData.origin.state))
  setSenderCity(selectedQuoteData.origin.city)

  setReceiverCountry(selectedQuoteData.destination.country)
  setReceiverState(getStateCode(selectedQuoteData.destination.state))
  setReceiverCity(selectedQuoteData.destination.city)

  setLoading(false)
}, [mode, router, setQuoteData, setSelectedQuoteId])
```

#### **3B. Fetching Fresh Quotes**

```typescript
const fetchQuotesForReview = async () => {
  // Validate all form fields
  if (!validateDetailsForm()) return

  // Convert form data to API format
  const senderStateName = senderStates.find(s => s.code === senderState)?.name
  const receiverStateName = receiverStates.find(s => s.code === receiverState)?.name

  const shipmentItems: QuoteItem[] = items.map(item => ({
    category_id: categories.find(c => c.id === item.categoryId).id,
    category_name: categories.find(c => c.id === item.categoryId).name,
    // ... map all fields
    quantity: parseInt(item.quantity),
    weight: parseFloat(item.weight),
    declared_value: parseFloat(item.declaredValue)
  }))

  // Make FRESH quote request WITHOUT quote_id
  const quoteRequest: QuoteRequest = {
    shipment_id: shipmentId, // Include if updating existing shipment
    origin: {
      country: senderCountry,
      state: senderStateName.toLowerCase(),
      city: senderCity.toLowerCase() || undefined
    },
    destination: {
      country: receiverCountry,
      state: receiverStateName.toLowerCase(),
      city: receiverCity.toLowerCase() || undefined
    },
    items: shipmentItems,
    currency: quoteData?.rates?.[0]?.currency || "NGN",
    is_insured: quoteData?.is_insured || true
    // NO quote_id - this is a fresh request
  }

  // Fetch fresh quotes
  const response = await quotesApi.fetchQuotes(quoteRequest)

  if (response.status === "success") {
    const fetchedQuotes = response.data.rates

    // Update context with fresh data
    setQuoteData(response.data)
    setQuotes(fetchedQuotes)

    // Auto-highlight: if previously selected quote_id exists in new rates
    if (contextQuoteId) {
      const matchingQuote = fetchedQuotes.find(q => q.quote_id === contextQuoteId)
      if (matchingQuote) {
        setSelectedQuote(matchingQuote) // Auto-select previous choice
      } else {
        setSelectedQuote(fetchedQuotes[0]) // Select first if previous not found
      }
    } else {
      setSelectedQuote(fetchedQuotes[0])
    }

    setStep('quotes') // Move to quote selection step
  }
}
```

#### **3C. Creating/Updating Shipment**

```typescript
const handleSubmit = async () => {
  // Build complete shipment data
  const originAddress: Address = {
    name: senderName,
    email: senderEmail,
    phone: senderPhone,
    address_line_1: senderAddress1,
    address_line_2: senderAddress2 || undefined,
    city: senderCity.toLowerCase(),
    state: senderStateName.toLowerCase(),
    postal_code: senderPostalCode,
    country: senderCountry
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
    country: receiverCountry
  }

  const shipmentData: CreateShipmentRequest = {
    shipment_id: shipmentId,
    quote_id: selectedQuote.quote_id, // From user's selected rate
    channel_code: "web",
    is_insured: searchParams.is_insured,
    save_origin_address: false,
    save_destination_address: false,
    items: shipmentItems,
    origin_address: originAddress,
    destination_address: destinationAddress,
    pickup_type: pickupType,
    pickup_scheduled_at: pickupType === "scheduled_pickup" ? pickupDate : undefined,
    customer_notes: null
  }

  let response

    // CREATE new shipment (normal flow)
    response = await createShipment(shipmentData)

    if (response.status === "success") {
      // Store for back navigation from payment page
      sessionStorage.setItem('created-shipment-data', JSON.stringify({
        shipment: response.data,
        formData: {
          senderName, senderEmail, senderPhone,
          senderAddress1, senderAddress2, senderPostalCode,
          receiverName, receiverEmail, receiverPhone,
          receiverAddress1, receiverAddress2, receiverPostalCode,
          pickupType, pickupDate, items
        }
      }))

      toast.success("Shipment created successfully!")
      router.push(`/payment/${response.data.id}`)
  }
}
```

**Key Files:**
- `app/checkout/page.tsx`
- `lib/api/shipments.ts` - createShipment, updateShipment functions

---

### **Step 4: Payment Page**

**Purpose:** Review final shipment and process payment

**User Actions:**
1. Review complete shipment details
2. Enter payer information
3. Select payment method
4. Click "Proceed to Payment"
5. Upload payment proof (if bank transfer)
6. **OR** Click "Back" button to return to checkout

**Implementation:**

```typescript
// 1. Load shipment by ID
useEffect(() => {
  const loadData = async () => {
    const [shipmentRes, paymentMethodsRes] = await Promise.all([
      getShipment(shipmentId),
      getPaymentMethods()
    ])

    if (shipmentRes.status === "success") {
      setShipment(shipmentRes.data)
      // Pre-fill payer info from origin address
      setPayerName(shipmentRes.data.origin_address.name)
      setPayerEmail(shipmentRes.data.origin_address.email)
      setPayerPhone(shipmentRes.data.origin_address.phone)
    }

    if (paymentMethodsRes.status === "success") {
      setPaymentMethods(paymentMethodsRes.data)
    }
  }

  loadData()
}, [shipmentId])

// 2. Back button handler - triggers review mode
<button onClick={() => router.push("/checkout?mode=review")}>
  <svg>...</svg> {/* Back arrow */}
</button>

// 3. Payment completion - cleanup sessionStorage
const handleUploadProof = async () => {
  const response = await uploadPaymentProof(transactionId, proofFile)

  if (response.status === "success") {
    // Clear stored shipment data (no longer needed)
    sessionStorage.removeItem('created-shipment-data')

    router.push(`/shipment/${shipment?.code}/success`)
  }
}
```

**Key Files:**
- `app/payment/[shipmentId]/page.tsx`

---

### **Step 5: Review Mode (Back from Payment)**

**Purpose:** Allow user to edit shipment before payment and update it

**Trigger:** User clicks "Back" button on payment page

**User Actions:**
1. Arrive at checkout page with all data pre-filled
2. Modify any field (addresses, items, dates, etc.)
3. Click "Review Quotes" to fetch updated quotes
4. Select quote (previous selection auto-highlighted if still valid)
5. Click "Back to Payment" to update shipment
6. Return to payment page with updated data

**Implementation:**

```typescript
// Detect review mode
const mode = urlParams.get('mode') // 'review' if coming from payment

useEffect(() => {
  if (mode === 'review') {
    // Load shipment data from sessionStorage
    const createdShipmentDataStr = sessionStorage.getItem('created-shipment-data')

    if (!createdShipmentDataStr) {
      toast.error("Shipment data not found.")
      router.push("/create-shipment")
      return
    }

    const { shipment, formData } = JSON.parse(createdShipmentDataStr)

    // Prefill ALL form fields (not just location)
    setSenderName(formData.senderName)
    setSenderEmail(formData.senderEmail)
    setSenderPhone(formData.senderPhone)
    setSenderAddress1(formData.senderAddress1)
    setSenderAddress2(formData.senderAddress2 || "")
    setSenderPostalCode(formData.senderPostalCode)

    setReceiverName(formData.receiverName)
    setReceiverEmail(formData.receiverEmail)
    setReceiverPhone(formData.receiverPhone)
    setReceiverAddress1(formData.receiverAddress1)
    setReceiverAddress2(formData.receiverAddress2 || "")
    setReceiverPostalCode(formData.receiverPostalCode)

    setPickupType(formData.pickupType)
    setPickupDate(formData.pickupDate)
    setItems(formData.items) // Prefill items array

    // IMPORTANT: Set shipmentId to trigger update flow
    setShipmentId(shipment.id)

    // Prefill locations from shipment addresses
    setSenderCountry(shipment.origin_address.country)
    setSenderState(getStateCode(shipment.origin_address.state))
    setSenderCity(shipment.origin_address.city)

    setReceiverCountry(shipment.destination_address.country)
    setReceiverState(getStateCode(shipment.destination_address.state))
    setReceiverCity(shipment.destination_address.city)

    // Build search params with shipment_id
    const reviewSearchParams: QuoteRequest = {
      shipment_id: shipment.id, // ← Include for backend tracking
      origin: {
        country: shipment.origin_address.country,
        state: shipment.origin_address.state,
        city: shipment.origin_address.city || undefined
      },
      destination: {
        country: shipment.destination_address.country,
        state: shipment.destination_address.state,
        city: shipment.destination_address.city || undefined
      },
      items: shipment.items,
      currency: shipment.currency,
      is_insured: shipment.is_insured
    }
    setSearchParams(reviewSearchParams)

    toast.info(`Reviewing shipment ${shipment.code}. You can make changes and update.`)
    setLoading(false)
    return
  }

  // ... rest of normal flow
}, [mode, router])
```

**Visual Indicator:**

```tsx
{mode === 'review' && (
  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
    <div className="flex items-start gap-3">
      <svg className="h-6 w-6 text-blue-600">...</svg>
      <div>
        <h3 className="font-bold text-blue-900">Reviewing Existing Shipment</h3>
        <p className="text-sm text-blue-800">
          This shipment has already been created. You can review and modify the
          details below, then return to payment.
        </p>
      </div>
    </div>
  </div>
)}
```

**Button Text Changes:**

```tsx
<Button onClick={handleSubmit}>
  {mode === 'review' ? "Back to Payment" : "Continue to Payment"}
</Button>
```

---

## Type Definitions

### **QuoteRequest**

```typescript
export interface QuoteRequest {
  origin: {
    country: string
    state: string
    city?: string
  }
  destination: {
    country: string
    state: string
    city?: string
  }
  items: QuoteItem[]
  currency: string
  is_insured: boolean
  shipment_id?: string | null  // ← Include when updating existing shipment
  quote_id?: string | null      // ← NOT used in this flow (reserved for future)
  promo_code?: string | null
  preferred_service_type?: string | null
}
```

### **QuoteResponse**

```typescript
export interface QuoteResponse {
  status: 'success' | 'error'
  message: string
  data: {
    origin: {
      city: string
      state: string
      country: string
      address_line_1: string | null
      address_line_2: string | null
      postal_code: string | null
    }
    destination: {
      city: string
      state: string
      country: string
      address_line_1: string | null
      address_line_2: string | null
      postal_code: string | null
    }
    items: QuoteItem[]
    is_insured: boolean
    promo_code: string | null
    quote_id: string | null
    preferred_service_type: string | null
    rates: Quote[] // ← Array of available quotes
  }
}
```

### **Quote (Individual Rate)**

```typescript
export interface Quote {
  quote_id: string // ← THIS is the quote ID to use
  carrier_code: string
  carrier_name: string
  service_type: string
  display_name: string
  service_name: string
  base_rate: number
  adjustments: Array<{
    type: string
    description: string
    calculation_type: 'fixed' | 'percentage'
    rate: number | null
    amount: number
  }>
  discounts: Array<{
    type: string
    description: string
    amount: number
  }>
  total_amount: number
  currency: string
  estimated_delivery_date: string
  estimated_days: number
  expires_at: string
  created_at: string
  metadata?: { /* ... */ }
  carrier_logo_url?: string
  description?: string
}
```

### **CreateShipmentRequest**

```typescript
export interface CreateShipmentRequest {
  quote_id: string // ← From selected rate's quote_id
  channel_code: string
  is_insured: boolean
  save_origin_address: boolean
  save_destination_address: boolean
  items: ShipmentItem[]
  origin_address: Address
  destination_address: Address
  pickup_type: 'scheduled_pickup' | 'drop_off'
  pickup_scheduled_at?: string // ISO date string
  selected_payment_method?: string
  customer_notes?: string | null
}
```

### **UpdateShipmentRequest**

```typescript
export interface UpdateShipmentRequest {
  selected_payment_method?: string
  quote_id?: string // ← Can update quote selection
  channel_code?: string
  is_insured?: boolean
  save_origin_address?: boolean
  save_destination_address?: boolean
  items?: ShipmentItem[]
  origin_address?: Address
  destination_address?: Address
  pickup_type?: 'scheduled_pickup' | 'drop_off'
  pickup_scheduled_at?: string
  customer_notes?: string | null
}
```

---

## SessionStorage Management

### **Storage Keys**

| Key | Purpose | Set By | Used By | Cleared By |
|-----|---------|--------|---------|------------|
| `temp-quote-response` | Temporary handoff from Step 1 to Step 2 | create-shipment | fetch-quotes | fetch-quotes (after selection) |
| `selected-quote-data` | Handoff from Step 2 to Step 3 | fetch-quotes | checkout | checkout (on load) |
| `created-shipment-data` | Store shipment + form data for back navigation | checkout | checkout (review mode) | payment (on completion) |

### **Best Practices**

```typescript
// ✅ Good: Store minimal data, clear after use
sessionStorage.setItem('selected-quote-data', JSON.stringify({
  quoteData: response.data,
  selectedQuoteId: 'quote_abc123'
}))

// Later: Clear after reading
const data = JSON.parse(sessionStorage.getItem('selected-quote-data'))
sessionStorage.removeItem('selected-quote-data')

// ❌ Bad: Don't store in localStorage
localStorage.setItem('quotes', ...) // Persists across sessions - causes stale data

// ❌ Bad: Don't rely on context across page navigations
setQuoteData(data) // Lost on refresh
router.push('/next-page') // Context doesn't persist
```

---

## React Context Usage

### **QuoteContext**

Purpose: In-memory state management for current session only

```typescript
// lib/contexts/quote-context.tsx
interface QuoteContextType {
  quoteData: QuoteResponse['data'] | null
  selectedQuoteId: string | null
  setQuoteData: (data: QuoteResponse['data'] | null) => void
  setSelectedQuoteId: (id: string | null) => void
  clearQuoteData: () => void
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quoteData, setQuoteData] = useState<QuoteResponse['data'] | null>(null)
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)

  const clearQuoteData = () => {
    setQuoteData(null)
    setSelectedQuoteId(null)
  }

  return (
    <QuoteContext.Provider value={{
      quoteData,
      selectedQuoteId,
      setQuoteData,
      setSelectedQuoteId,
      clearQuoteData
    }}>
      {children}
    </QuoteContext.Provider>
  )
}
```

**Usage Pattern:**

```typescript
// Only populate context AFTER user reaches checkout page
// Context is used for in-page state, not persistence

// In checkout page:
const { quoteData, selectedQuoteId, setQuoteData, setSelectedQuoteId } = useQuote()

// Load from sessionStorage first
const data = JSON.parse(sessionStorage.getItem('selected-quote-data'))

// Then populate context for use within checkout page
setQuoteData(data.quoteData)
setSelectedQuoteId(data.selectedQuoteId)

// Use context data for UI rendering and fresh quote fetching
const handleFetchQuotes = () => {
  const request = {
    // ... use quoteData for reference
    currency: quoteData.rates[0]?.currency
  }
}
```

---

## Backend API Requirements

### **POST /v1/quotes/**

**Request:**
```json
{
  "origin": {
    "country": "NG",
    "state": "lagos",
    "city": "ikeja"
  },
  "destination": {
    "country": "US",
    "state": "california",
    "city": "los angeles"
  },
  "items": [
    {
      "category_id": "cat_123",
      "category_name": "Electronics",
      "category_description": "Electronic devices and accessories",
      "category_hs_code": "8517",
      "category_group_tag": "electronics",
      "description": "iPhone 15 Pro",
      "package_type": "box",
      "quantity": 1,
      "weight": 0.5,
      "length": 20,
      "width": 10,
      "height": 5,
      "declared_value": 500000
    }
  ],
  "currency": "NGN",
  "is_insured": true,
  "shipment_id": null,  // or "ship_xyz" when updating
  "quote_id": null,
  "promo_code": null,
  "preferred_service_type": null
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Quotes fetched successfully",
  "data": {
    "origin": {
      "city": "ikeja",
      "state": "lagos",
      "country": "NG",
      "address_line_1": null,
      "address_line_2": null,
      "postal_code": null
    },
    "destination": {
      "city": "los angeles",
      "state": "california",
      "country": "US",
      "address_line_1": null,
      "address_line_2": null,
      "postal_code": null
    },
    "items": [ /* echo back items */ ],
    "is_insured": true,
    "promo_code": null,
    "quote_id": null,
    "preferred_service_type": null,
    "rates": [
      {
        "quote_id": "quote_1234abcd",
        "carrier_code": "DHL",
        "carrier_name": "DHL Express",
        "service_type": "express",
        "display_name": "DHL Express - Express Service",
        "service_name": "Express Service",
        "base_rate": 25000,
        "adjustments": [
          {
            "type": "fuel_surcharge",
            "description": "Fuel Surcharge",
            "calculation_type": "percentage",
            "rate": 15,
            "amount": 3750
          }
        ],
        "discounts": [],
        "total_amount": 28750,
        "currency": "NGN",
        "estimated_delivery_date": "2025-12-11T00:00:00Z",
        "estimated_days": 3,
        "expires_at": "2025-12-08T18:00:00Z",
        "created_at": "2025-12-08T12:00:00Z",
        "metadata": {
          "source": "rate_engine",
          "billable_weight": 2.5,
          "weight_type": "actual"
        },
        "carrier_logo_url": "https://example.com/logos/dhl.png",
        "description": "Fast international shipping"
      }
      // ... more rates
    ]
  }
}
```

### **POST /v1/shipments/**

**Request:**
```json
{
  "quote_id": "quote_1234abcd",
  "channel_code": "web",
  "is_insured": true,
  "save_origin_address": false,
  "save_destination_address": false,
  "items": [ /* full item objects */ ],
  "origin_address": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+2349012345678",
    "address_line_1": "123 Main Street",
    "address_line_2": "Apt 4B",
    "city": "ikeja",
    "state": "lagos",
    "postal_code": "100001",
    "country": "NG"
  },
  "destination_address": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "address_line_1": "456 Broadway",
    "address_line_2": null,
    "city": "los angeles",
    "state": "california",
    "postal_code": "90001",
    "country": "US"
  },
  "pickup_type": "scheduled_pickup",
  "pickup_scheduled_at": "2025-12-10T10:00:00Z",
  "customer_notes": null
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Shipment created successfully",
  "data": {
    "id": "ship_xyz789",
    "code": "SHP-20251208-001",
    "status": "drafted",
    "carrier_name": "DHL Express",
    "service_type": "express",
    "final_price": 28750,
    "currency": "NGN",
    "origin_address": { /* full address */ },
    "destination_address": { /* full address */ },
    "items": [ /* full items */ ],
    "payment_id": "pay_abc123",
    "payment_status": "pending",
    "rate_base_price": 25000,
    "rate_adjustments": [ /* adjustments */ ],
    "rate_discounts": [],
    // ... other shipment fields
  }
}
```

### **PATCH /v1/shipments/{shipment_id}/**

**Request:** Same structure as POST (all fields optional)

**Response:** Same structure as POST response with updated data

---

## Important Implementation Details

### **1. Category Default Behavior**

Prevent auto-setting category in review mode:

```typescript
useEffect(() => {
  const loadCategories = async () => {
    const data = await categoriesApi.getCategories()
    const uniqueCategories = deduplicateByGroupTag(data)
    setCategories(uniqueCategories)

    // Only set default category if NOT in review mode
    const isReviewMode = urlParams.get('mode') === 'review'
    if (!isReviewMode && uniqueCategories.length > 0 && items[0] && !items[0].categoryId) {
      updateItem(0, { categoryId: uniqueCategories[0].id })
    }
  }

  loadCategories()
}, [])
```

### **2. State Code Conversion**

UI uses state codes, API expects state names:

```typescript
// Get state name for API
const senderStateName = senderStates.find(s => s.code === senderState)?.name || senderState

// Get state code for UI
const originStateObj = originStates.find(s => s.name.toLowerCase() === origin_address.state.toLowerCase())
if (originStateObj) setSenderState(originStateObj.code)
```

### **3. Items Transformation**

Convert between UI format and API format:

```typescript
// UI Format (ShipmentItemUI)
interface ShipmentItemUI {
  id: string // For React keys
  categoryId: string
  description: string
  packageType: "envelope" | "box" | "pallet" | "tube" | "pak" | "other"
  quantity: string // String for input value
  weight: string // String for input value
  dimensions: { length: string; width: string; height: string }
  declaredValue: string // String for input value
}

// API Format (QuoteItem / ShipmentItem)
const shipmentItems: QuoteItem[] = items.map(item => {
  const category = categories.find(c => c.id === item.categoryId)
  return {
    category_id: category.id,
    category_name: category.name,
    category_description: category.description,
    category_hs_code: category.hs_code,
    category_group_tag: category.group_tag,
    description: item.description,
    package_type: item.packageType,
    quantity: parseInt(item.quantity), // Convert to number
    weight: parseFloat(item.weight), // Convert to number
    length: item.dimensions.length ? parseFloat(item.dimensions.length) : undefined,
    width: item.dimensions.width ? parseFloat(item.dimensions.width) : undefined,
    height: item.dimensions.height ? parseFloat(item.dimensions.height) : undefined,
    declared_value: parseFloat(item.declaredValue) // Convert to number
  }
})
```

### **4. Package Type Weight Defaults**

```typescript
const PACKAGE_DEFAULT_WEIGHTS: Record<string, number> = {
  envelope: 0.2,
  box: 1,
  pallet: 10,
  tube: 0.5,
  pak: 0.3
}

const handlePackageTypeChange = (index: number, value: string) => {
  const defaultWeight = PACKAGE_DEFAULT_WEIGHTS[value]
  updateItem(index, {
    packageType: value as any,
    weight: defaultWeight ? defaultWeight.toString() : items[index].weight
  })
}
```

### **5. Form Validation**

Validate before fetching quotes:

```typescript
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
      return false
    }
    if (!item.weight || parseFloat(item.weight) <= 0) {
      toast.error(`Please enter valid weight for item ${i + 1}`)
      return false
    }
    // ... more validations
  }

  // Sender validation
  if (!senderName.trim()) {
    toast.error("Please enter sender name")
    setExpandedSection("sender")
    return false
  }
  // ... more validations

  return true
}
```

---

## Testing Checklist

### **Normal Flow**
- [ ] User can enter route and get quotes
- [ ] User can select a quote and proceed to checkout
- [ ] Checkout page pre-fills location data only
- [ ] User can fill in all details and add multiple items
- [ ] Fresh quotes are fetched with updated data
- [ ] Previously selected quote is auto-highlighted if present
- [ ] User can select a different quote
- [ ] Shipment is created successfully
- [ ] Payment page displays correct shipment details

### **Review Mode Flow**
- [ ] Back button on payment page navigates to checkout with `?mode=review`
- [ ] All form fields are pre-filled (not just location)
- [ ] Items array is properly restored
- [ ] Blue banner indicates review mode
- [ ] User can modify any field
- [ ] Fresh quotes are fetched when "Review Quotes" is clicked
- [ ] `shipment_id` is included in quote request
- [ ] Previously selected quote is auto-highlighted
- [ ] UPDATE request (PATCH) is sent instead of CREATE (POST)
- [ ] Success toast says "Shipment updated successfully!"
- [ ] User is returned to payment page
- [ ] Payment page shows updated shipment data

### **Edge Cases**
- [ ] User refreshes on fetch-quotes page → redirected to create-shipment
- [ ] User refreshes on checkout page → redirected to create-shipment
- [ ] User refreshes on payment page → stays on payment (shipment loaded by ID)
- [ ] User navigates directly to checkout URL → redirected to create-shipment
- [ ] Selected quote no longer available in fresh quotes → first quote auto-selected
- [ ] User changes location significantly → new set of quotes returned
- [ ] SessionStorage is properly cleared after successful payment

### **SessionStorage Behavior**
- [ ] `temp-quote-response` is set in Step 1
- [ ] `temp-quote-response` is read in Step 2
- [ ] `temp-quote-response` is removed after quote selection
- [ ] `selected-quote-data` is set in Step 2
- [ ] `selected-quote-data` is read in Step 3
- [ ] `created-shipment-data` is set after shipment creation
- [ ] `created-shipment-data` is read in review mode
- [ ] `created-shipment-data` is updated after shipment update
- [ ] `created-shipment-data` is removed after payment completion

---

## Migration Guide

### **From Old Approach to New Approach**

#### **Step 1: Update Type Definitions**

```typescript
// types/quote.ts

// Add new fields to QuoteRequest
export interface QuoteRequest {
  // ... existing fields
  shipment_id?: string | null  // NEW
  quote_id?: string | null      // NEW (reserved for future)
  promo_code?: string | null    // NEW
  preferred_service_type?: string | null // NEW
}

// Change QuoteResponse structure
export interface QuoteResponse {
  status: 'success' | 'error'
  message: string
  data: {
    origin: { city: string; state: string; country: string; /* ... */ }
    destination: { city: string; state: string; country: string; /* ... */ }
    items: QuoteItem[]
    is_insured: boolean
    promo_code: string | null
    quote_id: string | null
    preferred_service_type: string | null
    rates: Quote[] // Array of quotes
  }
}
```

#### **Step 2: Update API Functions**

```typescript
// lib/api/quotes.ts

// Change return type
export async function fetchQuotes(
  data: QuoteRequest
): Promise<QuoteResponse> { // Not Quote[]
  return apiClient.post<QuoteResponse>('/quotes/', data)
}
```

#### **Step 3: Update Create Shipment Page**

Remove:
- ❌ Storing in localStorage
- ❌ Storing in context immediately
- ❌ Generating quote_id

Add:
- ✅ Store response.data in sessionStorage as `temp-quote-response`
- ✅ Navigate to fetch-quotes

#### **Step 4: Update Fetch Quotes Page**

Remove:
- ❌ Making new API call on mount
- ❌ Reading from localStorage/context

Add:
- ✅ Read from `temp-quote-response` sessionStorage
- ✅ Extract rates from response.data.rates
- ✅ On selection, store full data + quote_id in `selected-quote-data`
- ✅ Clear `temp-quote-response`

#### **Step 5: Update Checkout Page**

Remove:
- ❌ Reading from localStorage
- ❌ Using cached quote data throughout

Add:
- ✅ Read from `selected-quote-data` on mount
- ✅ Populate context AFTER reading sessionStorage
- ✅ Detect `mode=review` for review flow
- ✅ Fetch fresh quotes when user clicks "Review Quotes"
- ✅ Auto-highlight previous quote_id if exists
- ✅ Conditional create vs update based on `shipmentId`
- ✅ Store shipment + form data in `created-shipment-data`

#### **Step 6: Update Payment Page**

Add:
- ✅ Back button that navigates to `/checkout?mode=review`
- ✅ Clear `created-shipment-data` after payment completion

#### **Step 7: Add Review Mode**

Implement:
- ✅ Review mode detection in checkout page
- ✅ Load shipment + form data from `created-shipment-data`
- ✅ Prefill ALL fields, not just location
- ✅ Set `shipmentId` state
- ✅ Include `shipment_id` in quote requests
- ✅ Call `updateShipment()` instead of `createShipment()`
- ✅ Display blue banner indicating review mode

#### **Step 8: Update Backend (if needed)**

Ensure:
- ✅ POST /quotes/ returns QuoteResponse structure
- ✅ PATCH /shipments/{id}/ accepts same data as POST /shipments/
- ✅ Backend tracks `shipment_id` in quote requests (optional, for analytics)

---

## Common Pitfalls to Avoid

### **1. Don't Generate quote_id on Frontend**

❌ **Wrong:**
```typescript
const quoteId = `quote_${Date.now()}_${Math.random()}`
```

✅ **Correct:**
```typescript
// quote_id comes from backend's rate object
const selectedQuote = rates.find(r => r.quote_id === userSelectedId)
const quoteIdToUse = selectedQuote.quote_id
```

### **2. Don't Cache Quotes Long-Term**

❌ **Wrong:**
```typescript
localStorage.setItem('quotes', JSON.stringify(quotes))
// Used across multiple pages and sessions
```

✅ **Correct:**
```typescript
sessionStorage.setItem('temp-quote-response', JSON.stringify(response.data))
// Used only for next page transition, then cleared
```

### **3. Don't Populate Context Before SessionStorage**

❌ **Wrong:**
```typescript
setQuoteData(data)
router.push('/checkout') // Context lost on navigation
```

✅ **Correct:**
```typescript
sessionStorage.setItem('selected-quote-data', JSON.stringify(data))
router.push('/checkout')
// Then in checkout:
const data = JSON.parse(sessionStorage.getItem('selected-quote-data'))
setQuoteData(data) // Now populate context
```

### **4. Don't Skip Fresh Quote Fetching**

❌ **Wrong:**
```typescript
// Use cached quotes from Step 1
const oldQuotes = quoteData.rates
setQuotes(oldQuotes) // Stale data, user changed details
```

✅ **Correct:**
```typescript
// Fetch fresh quotes with current form data
const response = await quotesApi.fetchQuotes(currentFormData)
setQuotes(response.data.rates) // Fresh, accurate pricing
```

### **5. Don't Forget to Handle Review Mode**

❌ **Wrong:**
```typescript
// Always create new shipment
const response = await createShipment(shipmentData)
```

✅ **Correct:**
```typescript
if (shipmentId) {
  // Update existing
  response = await updateShipment(shipmentId, shipmentData)
} else {
  // Create new
  response = await createShipment(shipmentData)
}
```

---

## Quick Reference

### **SessionStorage Keys**
```typescript
'temp-quote-response'      // Step 1 → Step 2
'selected-quote-data'      // Step 2 → Step 3
'created-shipment-data'    // Step 3 ↔ Step 4 (review mode)
```

### **URL Parameters**
```typescript
'/checkout?mode=review'    // Indicates review mode from payment back button
```

### **State Indicators**
```typescript
const shipmentId = useState(null) // If set, triggers update flow instead of create
```

### **API Endpoints**
```typescript
POST   /v1/quotes/              // Fetch quotes (no quote_id needed)
POST   /v1/shipments/           // Create shipment (with quote_id)
PATCH  /v1/shipments/{id}/      // Update shipment (review mode)
GET    /v1/shipments/{id}/      // Load shipment for payment page
```

### **Key Functions**
```typescript
quotesApi.fetchQuotes(request)           // Fetch quotes from backend
createShipment(data)                     // Create new shipment
updateShipment(id, data)                 // Update existing shipment
getShipment(id)                          // Load shipment by ID
```

---

## Support

For questions or issues implementing this flow:
1. Review this documentation thoroughly
2. Check the reference implementation in `app/checkout/page.tsx`
3. Verify backend API responses match expected structure
4. Test each step independently before integration
5. Use browser DevTools to inspect sessionStorage contents

**Last Updated:** December 8, 2025
**Version:** 1.0
**Reference Project:** ohship-compact
