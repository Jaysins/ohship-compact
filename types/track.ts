export interface TrackingEvent {
  id: string
  created_at: string
  event_description: string
  event_time: string
  status: string
  location_city: string | null
  location_state: string | null
  location_country: string | null
  location_description: string | null
  description: string
  is_exception: boolean
  event_type: string
}

export interface ShipmentDetails {
  origin_address: string
  origin_city: string
  origin_state: string
  origin_country: string
  destination_address: string
  destination_city: string
  destination_state: string
  destination_country: string
  carrier_name: string
  carrier_code: string
  carrier_logo_url: string | null
  service_type: string
  total_weight: number
  weight_unit: string
  package_count: number
  dimensions: {
    length: number
    width: number
    height: number
    unit: string
  }
  current_status: string
  estimated_delivery_date: string | null
  actual_delivery_date: string | null
  items: Array<{
    description: string
    quantity: number
    weight: number
  }>
  is_insured: boolean
  shipment_type: string
}

export interface StatusStep {
  status: string
  label: string
  completed: boolean
  timestamp: string | null
}

export interface TrackingData {
  shipment_code: string
  awb_number: string | null
  shipment: ShipmentDetails
  events: TrackingEvent[]
  total: number
  status_progression: {
    current_step: number
    total_steps: number
    steps: StatusStep[]
  }
}


export interface TrackingResponse {
  status: string
  message: string
  data: TrackingData
}
