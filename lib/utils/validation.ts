/**
 * Validation utilities and Zod schemas
 */

import { z } from 'zod'

/**
 * Quote request validation schema
 */
export const quoteRequestSchema = z.object({
  origin: z.object({
    country: z.string().length(2, 'Country code must be 2 letters'),
    state: z.string().min(1, 'State is required'),
    city: z.string(),
  }),
  destination: z.object({
    country: z.string().length(2, 'Country code must be 2 letters'),
    state: z.string().min(1, 'State is required'),
    city: z.string(),
  }),
  item_type: z.string().min(1, 'Item type is required'),
  package: z.object({
    package_type: z.enum(['envelope', 'box', 'pallet', 'tube', 'pak'], {
      errorMap: () => ({ message: 'Invalid package type' }),
    }),
    weight: z.number().positive('Weight must be positive'),
    length: z.number().positive().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
  }),
  currency: z.string().length(3, 'Currency code must be 3 letters'),
  shipment_value: z.number().positive().optional(),
})

/**
 * Address validation schema
 */
export const addressSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address_line_1: z.string().min(1, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().length(2, 'Country code must be 2 letters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
})

/**
 * Shipment item validation schema
 */
export const shipmentItemSchema = z.object({
  category_id: z.string().uuid('Invalid category ID'),
  category_name: z.string().min(1),
  category_description: z.string().optional(),
  category_group_tag: z.string().optional(),
  category_hs_code: z.string().optional(),
  description: z.string().min(1, 'Item description is required'),
  package_type: z.enum(['envelope', 'box', 'pallet', 'tube', 'pak']),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  weight: z.number().positive('Weight must be positive'),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  declared_value: z.number().positive('Declared value must be positive'),
})

/**
 * Shipment creation validation schema
 */
export const createShipmentSchema = z.object({
  quote_id: z.string().min(1, 'Quote ID is required'),
  channel_code: z.literal('web'),
  is_insured: z.boolean(),
  save_origin_address: z.boolean(),
  save_destination_address: z.boolean(),
  items: z.array(shipmentItemSchema).min(1, 'At least one item is required'),
  origin_address: addressSchema,
  destination_address: addressSchema,
  pickup_type: z.enum(['scheduled_pickup', 'drop_off']),
  pickup_scheduled_at: z.string().optional(),
  customer_notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
})

/**
 * Payment initiation validation schema
 */
export const paymentInitSchema = z.object({
  payer_name: z.string().min(1, 'Payer name is required'),
  payer_email: z.string().email('Invalid email address'),
  payer_phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

/**
 * File upload validation
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF, PNG, and JPEG files are allowed' }
  }

  return { valid: true }
}

/**
 * Phone number validation
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  // Check if it has at least 10 digits
  return cleaned.length >= 10
}

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Postal code validation
 */
export const isValidPostalCode = (postalCode: string, country: string): boolean => {
  // Basic validation - can be enhanced per country
  return postalCode.length >= 3
}

/**
 * Credit card validation (basic Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '')

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Type exports for validation
 */
export type QuoteRequest = z.infer<typeof quoteRequestSchema>
export type Address = z.infer<typeof addressSchema>
export type ShipmentItem = z.infer<typeof shipmentItemSchema>
export type CreateShipmentRequest = z.infer<typeof createShipmentSchema>
export type PaymentInitRequest = z.infer<typeof paymentInitSchema>
