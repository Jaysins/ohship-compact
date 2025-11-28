"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui"

export default function ShipmentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const shipmentId = params.shipmentId as string

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="max-w-md text-center">
          {/* Success Icon */}
          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">Payment Submitted!</h1>

          <p className="text-slate-600 mb-2">
            Your payment proof has been uploaded successfully.
          </p>

          <p className="text-slate-600 mb-6">
            We are verifying your payment and will send you a confirmation email shortly.
          </p>

          <div className="bg-slate-100 rounded-lg p-4 mb-6">
            <p className="text-xs text-slate-600 mb-1">Shipment Code</p>
            <p className="font-mono font-bold text-slate-900 text-lg">{shipmentId}</p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push("/track")} className="w-full">
              Track Shipment
            </Button>
            <Button onClick={() => router.push("/create-shipment")} variant="outline" className="w-full">
              Create New Shipment
            </Button>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Questions? Contact support at support@example.com
          </p>
        </div>
      </div>
    </div>
  )
}
