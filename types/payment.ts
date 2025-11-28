/**
 * Payment type definitions
 */

export interface PaymentMethod {
  id: string
  name: string
  description: string
  code: string
  is_active: boolean
  is_primary: boolean
  is_displayable: boolean
  created_at: string
  updated_at: string
}

export interface TenantPaymentMethod {
  id: string
  created_at: string
  updated_at: string
  tenant_id: string
  is_enabled: boolean
  provider_code: string
  provider_name: string
  payment_method: PaymentMethod
}

export interface PaymentMethodsResponse {
  status: 'success' | 'error'
  message: string
  data: TenantPaymentMethod[]
}

export interface PayerInfo {
  payer_name: string
  payer_email: string
  payer_phone: string
}

export interface BankAccountDetails {
  bank_name: string
  account_number: string
  account_name: string
  reference?: string
}

export interface CheckoutPayRequest extends PayerInfo {}

export interface TransactionData {
  page: string
  provider_message: string
  provider_status: string
  status: string
  data: {
    amount: string
    txref: string
    status: string
    order_reference: string
  }
  transaction_id: string
  txref: string
  transaction_code: string
  transaction_status: string
  provider_reference: string
  provider_reference_id: string
  open_url: string | null
  payment_method: string
  virtual_account?: {
    bank_name: string
    account_name: string
    account_number: string
    routing_number: string
    amount: string
    currency: string
    reference: string
  }
}

export interface CheckoutPayResponse {
  status: 'success' | 'error'
  message: string
  data: {
    transaction_id: string
    transaction_data: TransactionData
    payment_status: 'pending' | 'completed' | 'failed'
    expires_at?: string
  }
}

export interface UploadProofRequest {
  file: File
}

export interface UploadProofResponse {
  status: 'success' | 'error'
  message?: string | undefined
  data: {
    transaction_id: string
    proof_url: string
    uploaded_at: string
  }
}

export interface ValidatePaymentResponse {
  status: 'success' | 'error'
  message: string
  data: {
    payment_status: 'pending' | 'completed' | 'failed'
    payment_id: string
    updated_at: string
  }
}
