/**
 * Address type definitions
 */

export interface Address {
  id?: string
  name: string
  address_line_1: string
  address_line_2?: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  email: string
}

export interface AddressResponse {
  status: 'success' | 'error'
  data: Address[]
}
