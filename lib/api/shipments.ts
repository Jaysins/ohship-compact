/**
 * Shipments API
 */

import { apiClient } from './client'
import type {
  CreateShipmentRequest,
  ShipmentResponse,
  UpdateShipmentRequest,
} from '@/types/shipment'

/**
 * Create a new shipment
 */
export async function createShipment(
  data: CreateShipmentRequest
): Promise<ShipmentResponse> {
  return apiClient.post<ShipmentResponse>('/shipments/', data)
}

/**
 * Get shipment by ID
 */
export async function getShipment(shipmentId: string): Promise<ShipmentResponse> {
  return apiClient.get<ShipmentResponse>(`/shipments/${shipmentId}/`)
}

/**
 * Update shipment (e.g., add payment method)
 */
export async function updateShipment(
  shipmentId: string,
  data: UpdateShipmentRequest
): Promise<ShipmentResponse> {
  return apiClient.patch<ShipmentResponse>(`/shipments/${shipmentId}/`, data)
}
