/**
 * Quote type definitions
 */

export interface ShipmentItemUI {
  id: string // For React keys only
  categoryId: string
  description: string
  packageType: "envelope" | "box" | "pallet" | "tube" | "pak" | "other"
  quantity: string
  weight: string
  dimensions: { length: string; width: string; height: string }
  declaredValue: string
}
export interface QuoteItem {
  category_id: string
  category_name: string
  category_description: string
  category_hs_code: string
  category_group_tag: string
  description: string
  package_type: 'envelope' | 'box' | 'pallet' | 'tube' | 'pak' | 'other'
  quantity: number
  weight: number
  length?: number
  width?: number
  height?: number
  declared_value: number
}

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
  shipment_id?: string | null
  quote_id?: string | null
  promo_code?: string | null
  preferred_service_type?: string | null
}

export interface Quote {
  quote_id: string
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
  metadata?: {
    source?: string
    rule_id?: string
    calculation?: string
    origin?: { city?: string; state: string; country: string }
    destination?: { city?: string; state: string; country: string }
    items?: any[]
    is_insured?: boolean
    promo_code?: string | null
    quote_id?: string | null
    preferred_service_type?: string | null
    weight?: number
    actual_weight?: number
    volumetric_weight?: number
    billable_weight?: number
    total_value?: number
    weight_type?: string
    shipment_status?: string | null
    currency?: string
    quotes_hash?: string
  }
  carrier_logo_url?: string
  description?: string
}

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
    rates: Quote[]
  }
}
