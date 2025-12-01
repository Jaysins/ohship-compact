"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { trackingApi } from "@/lib/api/tracking"
import { handleApiError } from "@/lib/utils/error-handler"
import { LoadingSpinner } from "@/components/ui"
import { TrackingData } from "@/types/track"
import {
  ArrowLeft,
  Share2,
  Printer,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  PackageCheck,
  ArrowRight,
  Headphones,
  FileWarning,
  HelpCircle,
  Circle
} from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
  pending_pickup: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  picked_up_by_carrier: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_transit: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  out_for_delivery: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-600 dark:text-red-400",
  exception: "bg-red-500/10 text-red-600 dark:text-red-400"
}

export default function TrackPage() {
  const params = useParams()
  const router = useRouter()
  const code = params?.code as string

  const [loading, setLoading] = useState(true)
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)

  useEffect(() => {
    const fetchTracking = async () => {
      if (!code) return

      try {
        setLoading(true)
        const response = await trackingApi.trackShipment(code)
        setTrackingData(response)
      } catch (error) {
        handleApiError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchTracking()
  }, [code])

  const getProgressPercentage = () => {
    if (!trackingData) return 0
    const { current_step, total_steps } = trackingData.status_progression
    return (current_step / total_steps) * 100
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  }

  const formatEstimatedDelivery = (dateString: string | null) => {
    if (!dateString) return "TBD"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    })
  }

  const getStatusLabel = (status: string) => {
    return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  const getEventIcon = (eventType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      pickup: <Clock className="h-4 w-4" />,
      picked_up: <PackageCheck className="h-4 w-4" />,
      in_transit: <Truck className="h-4 w-4" />,
      out_for_delivery: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      exception: <AlertCircle className="h-4 w-4" />,
      info: <Circle className="h-4 w-4" />
    }
    return iconMap[eventType] || iconMap.info
  }

  const getStatusIcon = (eventType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      pickup: <Clock className="h-5 w-5" />,
      picked_up: <PackageCheck className="h-5 w-5" />,
      in_transit: <Truck className="h-5 w-5" />,
      out_for_delivery: <Truck className="h-5 w-5" />,
      delivered: <CheckCircle className="h-5 w-5" />,
      exception: <AlertCircle className="h-5 w-5" />,
      info: <Package className="h-5 w-5" />
    }
    return iconMap[eventType] || iconMap.info
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track Shipment ${code}`,
          text: `Track your shipment: ${code}`,
          url: url
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(url)
      alert("Tracking link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!trackingData) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <p className="text-lg text-slate-600 dark:text-slate-400">Shipment not found</p>
        <button
          onClick={() => router.push("/shipments")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Shipments
        </button>
      </div>
    )
  }

  const { shipment, events, status_progression } = trackingData

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 w-full border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Shipment Tracking</h1>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-xl space-y-8">
          {/* Headline & Status */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tracking #</p>
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {trackingData.shipment_code}
              </h1>
              {trackingData.awb_number && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  AWB: {trackingData.awb_number}
                </p>
              )}
            </div>
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                STATUS_COLORS[shipment.current_status] || STATUS_COLORS.pending_pickup
              }`}
            >
              {getStatusIcon(events[0]?.event_type || "info")}
              <p className="text-base font-bold capitalize">{getStatusLabel(shipment.current_status)}</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column: Progress and Timeline */}
            <div className="space-y-6 lg:col-span-2">
              {/* Progress Stepper */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {shipment.actual_delivery_date 
                        ? `Delivered: ${formatEstimatedDelivery(shipment.actual_delivery_date)}`
                        : `Estimated Delivery: ${formatEstimatedDelivery(shipment.estimated_delivery_date)}`
                      }
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {events.length > 0 ? `Updated ${formatDate(events[0].event_time)}` : ""}
                    </p>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="absolute h-2 rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className={`grid text-center text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm`} 
                       style={{ gridTemplateColumns: `repeat(${status_progression.steps.length}, 1fr)` }}>
                    {status_progression.steps.map((step) => (
                      <div
                        key={step.status}
                        className={step.completed ? "text-blue-600 dark:text-blue-400" : ""}
                      >
                        {step.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Tracking History</h2>
                {events.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No tracking events yet
                  </p>
                ) : (
                  <div className="flow-root">
                    <ul className="-mb-8" role="list">
                      {events.map((event, index) => (
                        <li key={event.id}>
                          <div className="relative pb-8">
                            {index !== events.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700"
                              ></span>
                            )}
                            <div className="relative flex items-start space-x-3">
                              <div>
                                <div className="relative px-1">
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white dark:ring-slate-900 ${
                                      index === 0
                                        ? "bg-blue-600"
                                        : event.is_exception
                                        ? "bg-red-500"
                                        : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                                  >
                                    <div
                                      className={`${
                                        index === 0 || event.is_exception
                                          ? "text-white"
                                          : "text-slate-700 dark:text-slate-200"
                                      }`}
                                    >
                                      {getEventIcon(event.event_type)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 py-1.5">
                                <div className="text-sm">
                                  <p className="font-medium text-slate-900 dark:text-white">
                                    {event.event_description}
                                  </p>
                                  <p className="mt-1 text-gray-500 dark:text-gray-400">{event.description}</p>
                                  {(event.location_city || event.location_description) && (
                                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                                      {event.location_description && `${event.location_description}, `}
                                      {event.location_city && `${event.location_city}, `}
                                      {event.location_state}
                                    </p>
                                  )}
                                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                    {formatDate(event.event_time)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Info Cards & Actions */}
            <div className="space-y-6 lg:col-span-1">
              {/* Action Buttons */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleShare}
                    className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    <span className="truncate">Share Tracking Link</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    <span className="truncate">Print Details</span>
                  </button>
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Origin</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {shipment.origin_address}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {shipment.origin_city}, {shipment.origin_state}, {shipment.origin_country}
                    </p>
                  </div>
                  <div aria-hidden="true" className="relative flex items-center">
                    <div className="flex-grow border-t border-dashed border-slate-300 dark:border-slate-700"></div>
                    <span className="mx-2 flex-shrink text-slate-400 dark:text-slate-500">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <div className="flex-grow border-t border-dashed border-slate-300 dark:border-slate-700"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Destination</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {shipment.destination_address}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {shipment.destination_city}, {shipment.destination_state}, {shipment.destination_country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Shipment Details</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Carrier:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{shipment.carrier_name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Service:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white capitalize">{shipment.service_type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Type:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white capitalize">{shipment.shipment_type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Weight:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">
                      {shipment.total_weight} {shipment.weight_unit}
                    </dd>
                  </div>
                  {shipment.dimensions && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">Dimensions:</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {shipment.dimensions.length}×{shipment.dimensions.width}×{shipment.dimensions.height}{" "}
                        {shipment.dimensions.unit}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Packages:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{shipment.package_count}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Insurance:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">
                      {shipment.is_insured ? "Yes" : "No"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Items List */}
              {shipment.items && shipment.items.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Package Contents</h2>
                  <ul className="space-y-3">
                    {shipment.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
                          <p className="text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">{item.weight} kg</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Support Section */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Need Help?</h2>
                <div className="space-y-3">
                  <a
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    href="/support"
                  >
                    <Headphones className="h-5 w-5" />
                    <span>Contact Support</span>
                  </a>
                  <a
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    href="/claims"
                  >
                    <FileWarning className="h-5 w-5" />
                    <span>File a Claim</span>
                  </a>
                  <a
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    href="/faq"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>View FAQ</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}