/**
 * Tracking API
 * Track shipments and get real-time status updates
 */

import { TrackingData, TrackingEvent, TrackingResponse } from '@/types/track'
import { apiClient } from './client'


export const trackingApi = {
  /**
   * Track shipment by code
   * @param code - Shipment code (e.g., "SH13651729")
   */
  trackShipment: async (code: string): Promise<TrackingData> => {
    const response = await apiClient.get<TrackingResponse>(
      `/shipments/${code}/track/`
    )
    return response.data
  },

  /**
   * Track shipment by AWB number
   * @param awbNumber - Air Waybill number
   */
  trackByAwb: async (awbNumber: string): Promise<TrackingResponse> => {
    const response = await apiClient.get<TrackingResponse>(
      `/shipments/track/awb/${awbNumber}/`
    )
    return response.data
  },

  /**
   * Get tracking events for a shipment
   * @param shipmentId - Shipment ID
   */
  getTrackingEvents: async (shipmentId: string): Promise<TrackingEvent[]> => {
    const response = await apiClient.get<{ data: TrackingEvent[] }>(
      `/shipments/${shipmentId}/events/`
    )
    return response.data.data
  },
}