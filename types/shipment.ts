/**
 * Shipment type definitions
 */

export interface Address {
  name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  email: string
  company?: string | null
}

export interface ShipmentItem {
  id?: string
  category_id: string
  category_name?: string
  category_description?: string
  category_hs_code?: string
  category_group_tag?: string
  description: string
  package_type?: string
  quantity: number
  weight: number
  length?: number
  width?: number
  height?: number
  declared_value: number
  hs_code?: string
  declared_weight?: number
  declared_length?: number
  declared_width?: number
  declared_height?: number
  verified_weight?: number | null
  verified_length?: number | null
  verified_width?: number | null
  verified_height?: number | null
  carrier_weight?: number | null
  carrier_volumetric_weight?: number | null
  currency?: string
  origin_country?: string | null
  shipment_id?: string
  created_at?: string
  updated_at?: string
}

export interface CreateShipmentRequest {
  quote_id: string
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

export interface Shipment {
  id: string
  created_at: string
  updated_at: string
  tenant_id: string
  code: string
  awb_no: string | null
  pickup_type: 'scheduled_pickup' | 'drop_off'
  carrier_name: string
  service_type: string
  status: 'drafted' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'
  final_price: number
  currency: string
  origin_address: Address
  destination_address: Address
  estimated_delivery_date: string | null
  actual_delivery_date: string | null
  requires_customer_approval: boolean
  user_id: string
  carrier_code: string
  shipment_type: 'domestic' | 'international'
  customer_quoted_price: number
  current_quoted_price: number
  carrier_billed_price: number
  total_adjustments: number
  tenant_absorbed_cost: number
  total_declared_value: number | null
  assigned_agent_id: string | null
  pickup_scheduled_at: string | null
  picked_up_at: string | null
  arrived_at_hub_at: string | null
  verified_at: string | null
  verified_by_user_id: string | null
  label_generated_at: string | null
  label_url: string | null
  label_generated_by_user_id: string | null
  carrier_pickup_at: string | null
  customer_approved_at: string | null
  customer_approval_notes: string | null
  is_insured: boolean
  insurance_cost: number | null
  signature_required: boolean
  saturday_delivery: boolean
  channel_code: string
  rate_base_price: number
  rate_adjustments: Array<{
    type: string
    description: string
    calculation_type: 'fixed' | 'percentage'
    rate: number | null
    amount: number
  }>
  rate_discounts: Array<{
    type: string
    description: string
    amount: number
  }>
  customer_notes: string | null
  internal_notes: string | null
  payment_id: string | null
  selected_payment_method: string | null
  payment_status: 'pending' | 'completed' | 'failed'
  items: ShipmentItem[]
  user?: {
    id: string
    email: string
    first_name: string
    last_name: string
    full_name: string
    phone: string
    role: string
    is_active: boolean
    created_at: string
    updated_at: string
    tenant_id: string
    last_login_at: string
  }
}

export interface ShipmentResponse {
  status: 'success' | 'error'
  message: string
  data: Shipment
}

export interface UpdateShipmentRequest {
  selected_payment_method?: string
}
