"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui"
import { CheckCircle, Package, Plus } from "lucide-react"

export default function ShipmentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const shipmentCode = params.shipmentCode; 
  console.log("atleaset yeae")

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-slate-950">
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-md text-center">
          {/* Success Icon */}
          <div className="mx-auto h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Payment Submitted!</h1>

          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Your payment proof has been uploaded successfully.
          </p>

          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We are verifying your payment and will send you a confirmation email shortly.
          </p>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Shipment Code</p>
            <p className="font-mono font-bold text-slate-900 dark:text-white text-lg">{shipmentCode}</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push(`/track/${shipmentCode}`)} 
              className="w-full"
            >
              <Package className="mr-2 h-4 w-4" />
              Track Shipment
            </Button>
            <Button 
              onClick={() => router.push("/create-shipment")} 
              variant="outline" 
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Shipment
            </Button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
            Questions? Contact support at support@example.com
          </p>
        </div>
      </div>
    </div>
  )
}