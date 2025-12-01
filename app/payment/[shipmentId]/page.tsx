"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import type { Shipment } from "@/types/shipment"
import type { TenantPaymentMethod, CheckoutPayRequest } from "@/types/payment"
import { getShipment, updateShipment } from "@/lib/api/shipments"
import { getPaymentMethods, initiatePayment, uploadPaymentProof } from "@/lib/api/payments"
import { formatCurrency } from "@/lib/utils/format"
import { handleApiError } from "@/lib/utils/error-handler"
import { LoadingSpinner, Button, Input, Badge, Select } from "@/components/ui"
import { toast } from "sonner"

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const shipmentId = params.shipmentId as string

  // State
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<TenantPaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [payerName, setPayerName] = useState("")
  const [payerEmail, setPayerEmail] = useState("")
  const [payerPhone, setPayerPhone] = useState("")

  // Payment state
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [bankDetails, setBankDetails] = useState<any>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [uploadingProof, setUploadingProof] = useState(false)

  // Load shipment and payment methods
  useEffect(() => {
    const loadData = async () => {
      try {
        const [shipmentRes, paymentMethodsRes] = await Promise.all([
          getShipment(shipmentId),
          getPaymentMethods(),
        ])

        if (shipmentRes.status === "success") {
          setShipment(shipmentRes.data)

          // Pre-fill payer info from origin address
          setPayerName(shipmentRes.data.origin_address.name)
          setPayerEmail(shipmentRes.data.origin_address.email)
          setPayerPhone(shipmentRes.data.origin_address.phone)
        }

        if (paymentMethodsRes.status === "success") {
          const enabledMethods = paymentMethodsRes.data.filter((pm) => pm.is_enabled)
          setPaymentMethods(enabledMethods)

          // Auto-select if only one method available
          if (enabledMethods.length === 1) {
            setSelectedPaymentMethod(enabledMethods[0].id)
          }
        }
      } catch (error: any) {
        handleApiError(error)
        toast.error("Failed to load payment information")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [shipmentId])

  const handlePaymentMethodChange = async () => {
    if (!selectedPaymentMethod || !shipment) return

    setSubmitting(true)
    try {
      // Update shipment with selected payment method
      const response = await updateShipment(shipmentId, {
        selected_payment_method: selectedPaymentMethod,
      })

      if (response.status === "success") {
        setShipment(response.data)
        toast.success("Payment method selected")
        return response.data
      }
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInitiatePayment = async () => {


    if (!payerName.trim() || !payerEmail.trim() || !payerPhone.trim()) {
      toast.error("Please fill in all payer information")
      return
    }

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method")
      return
    }
    
    let finalShipment = shipment;

    // First, update shipment with payment method if not already done
    if (finalShipment?.selected_payment_method !== selectedPaymentMethod) {
      const updated = await handlePaymentMethodChange();
        if (updated) {
           finalShipment = updated;
          }
    }
    if (!finalShipment?.payment_id) {
      toast.error("Payment ID not found")
      return
    }
    setSubmitting(true)
    try {
      const paymentData: CheckoutPayRequest = {
        payer_name: payerName,
        payer_email: payerEmail,
        payer_phone: payerPhone,
      }

      const response = await initiatePayment(finalShipment.payment_id, paymentData)

      if (response.status === "success") {
        toast.success("Payment initiated successfully!")
        const bankAccount = response.data.transaction_data.virtual_account;
        // Handle different payment methods
        if (bankAccount) {
          // Manual bank transfer
          setBankDetails(bankAccount)
          setTransactionId(response.data.transaction_id)
          setShowPaymentDetails(true)
        } else if (response.data.transaction_data.open_url) {
          // Card payment - redirect
          window.location.href = response.data.transaction_data.open_url
        }
      }
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or PDF file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    setProofFile(file)
  }

  const handleUploadProof = async () => {
    if (!proofFile || !transactionId) {
      toast.error("Please select a file to upload")
      return
    }

    setUploadingProof(true)
    try {
      const response = await uploadPaymentProof(transactionId, proofFile)

      if (response.status === "success") {
        toast.success("Payment proof uploaded successfully!")
        toast.info("Your payment is being verified. You will receive a confirmation email shortly.")


        // Redirect to success page or dashboard
        setTimeout(() => {
          
          router.push(`/shipment/${shipment?.code}/success`)
        }, 2000)
      }
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setUploadingProof(false)
    }
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white">
        <div className="flex items-center justify-center flex-1">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Shipment Not Found</h2>
            <Button onClick={() => router.push("/create-shipment")}>
              Create New Shipment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show payment details screen
  if (showPaymentDetails && bankDetails) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white">
        {/* Top App Bar */}
        <div className="flex items-center border-b border-slate-200 bg-white p-4">
          <h1 className="text-xl font-bold text-slate-900 flex-1">Complete Payment</h1>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            {/* Payment Instructions */}
            <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Payment Instructions</h3>
                  <p className="text-slate-700">
                    Please transfer <strong>{formatCurrency(shipment.final_price, shipment.currency)}</strong> to the bank account below.
                    After making the transfer, upload your payment proof to complete the process.
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Bank Account Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Bank Name</span>
                  <span className="font-semibold text-slate-900">{bankDetails.bank_name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xl text-slate-900">
                      {bankDetails.account_number}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(bankDetails.account_number)
                        toast.success("Account number copied!")
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-600">Account Name</span>
                  <span className="font-semibold text-slate-900">{bankDetails.account_name}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600">Amount</span>
                  <span className="font-bold text-2xl text-primary">
                    {formatCurrency(shipment.final_price, shipment.currency)}
                  </span>
                </div>
                {bankDetails.reference && (
                  <div className="flex justify-between items-center py-3 bg-yellow-50 -mx-6 px-6 border-t border-yellow-200">
                    <span className="text-slate-600">Reference (Optional)</span>
                    <span className="font-mono text-slate-900">{bankDetails.reference}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Proof */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Upload Payment Proof</h3>
              <p className="text-slate-600 mb-4">
                After making the transfer, please upload a screenshot or photo of your payment receipt.
              </p>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="proof-upload"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="proof-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-slate-900 font-medium">
                      {proofFile ? proofFile.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-sm text-slate-500 mt-1">
                      PNG, JPG, or PDF (max 5MB)
                    </span>
                  </label>
                </div>

                <Button
                  onClick={handleUploadProof}
                  disabled={!proofFile || uploadingProof}
                  className="w-full"
                >
                  {uploadingProof ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    "Submit Payment Proof"
                  )}
                </Button>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Shipment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipment Code:</span>
                  <span className="font-mono font-semibold">{shipment.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Carrier:</span>
                  <span className="font-semibold">{shipment.carrier_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Service:</span>
                  <span className="font-semibold">{shipment.service_type}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Show review and payment method selection
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      {/* Top App Bar */}
      <div className="flex items-center border-b border-slate-200 bg-white p-4">
        <Link href="/checkout" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-slate-900 pl-4 flex-1">Step 4: Review & Payment</h1>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-slate-700">Details</span>
            </div>
            <div className="flex-1 h-1 bg-primary mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-slate-700">Quote</span>
            </div>
            <div className="flex-1 h-1 bg-primary mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-slate-700">Shipment</span>
            </div>
            <div className="flex-1 h-1 bg-primary mx-4"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                4
              </div>
              <span className="text-sm font-medium text-slate-900">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>

            {/* Shipment Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-200">
              <div>
                <p className="text-xs text-slate-600 mb-1">Shipment Code</p>
                <p className="font-mono font-semibold text-slate-900">{shipment.code}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Carrier</p>
                <p className="font-semibold text-slate-900">{shipment.carrier_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Service</p>
                <Badge variant="info">{shipment.service_type}</Badge>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-700">Base Rate</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(shipment.rate_base_price, shipment.currency)}
                </span>
              </div>

              {shipment.rate_adjustments.map((adj, idx) => (
                <div key={idx} className="flex justify-between items-center py-2">
                  <div>
                    <span className="text-sm text-slate-700">{adj.description}</span>
                    {adj.calculation_type === 'percentage' && adj.rate && (
                      <span className="text-xs text-slate-500 ml-1">({adj.rate}%)</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(adj.amount, shipment.currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(shipment.final_price, shipment.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Payer Information */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Payer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Full Name"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Method</h3>
            <Select
              label="Select Payment Method"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              options={[
                { value: "", label: "-- Select a payment method --" },
                ...paymentMethods.map((pm) => ({
                  value: pm.id,
                  label: pm.payment_method.name,
                  key: pm.id,
                })),
              ]}
            />
            {selectedPaymentMethod && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  {paymentMethods.find((pm) => pm.id === selectedPaymentMethod)?.payment_method.description}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/checkout")}
              variant="outline"
              disabled={submitting}
            >
              Back
            </Button>
            <Button
              onClick={handleInitiatePayment}
              disabled={!selectedPaymentMethod || submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
