/**
 * Payments API
 */

import { apiClient } from './client'
import type {
  PaymentMethodsResponse,
  CheckoutPayRequest,
  CheckoutPayResponse,
  UploadProofResponse,
  ValidatePaymentResponse,
} from '@/types/payment'

/**
 * Get tenant payment methods
 */
export async function getPaymentMethods(): Promise<PaymentMethodsResponse> {
  return apiClient.get<PaymentMethodsResponse>('/payment-methods/tenant/')
}

/**
 * Initiate payment for a checkout
 */
export async function initiatePayment(
  paymentId: string,
  data: CheckoutPayRequest
): Promise<CheckoutPayResponse> {
  return apiClient.post<CheckoutPayResponse>(`/checkouts/${paymentId}/pay/`, data)
}

/**
 * Upload payment proof for a transaction
 */
export async function uploadPaymentProof(
  transactionId: string,
  file: File
): Promise<UploadProofResponse> {

  return apiClient.upload<UploadProofResponse>(
    `/transactions/${transactionId}/upload-proof/`,
    file
  )
}

/**
 * Validate payment status
 */
export async function validatePayment(paymentId: string): Promise<ValidatePaymentResponse> {
  return apiClient.get<ValidatePaymentResponse>(`/checkouts/${paymentId}/validate/`)
}
