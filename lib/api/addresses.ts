/**
 * Addresses API
 * Manage saved addresses for quick selection
 */

import { apiClient } from './client'
import type { Address, AddressResponse } from '@/types/address'

export const addressesApi = {
  /**
   * Get all saved addresses for current user
   */
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>('/addresses/')
    return response.data
  },

  /**
   * Save a new address
   */
  saveAddress: async (address: Omit<Address, 'id'>): Promise<Address> => {
    const response = await apiClient.post<Address>('/addresses/', address)
    return response.data
  },
}
