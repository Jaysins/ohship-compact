"use client"

import { useState } from "react"

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("ABC123XYZ")

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 w-full border-b border-slate-200/80 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">local_shipping</span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Shipment Tracking</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
              <span className="truncate">Manage Shipment</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-slate-900 dark:text-white">person</span>
            </button>
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
                {trackingNumber}
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-orange-500 dark:text-orange-400">
              <span className="material-symbols-outlined text-lg">schedule</span>
              <p className="text-base font-bold">In Transit</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column: Map and Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Progress Stepper */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      Estimated Delivery: Tuesday, Aug 20
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: just now</p>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="absolute h-2 rounded-full bg-blue-600 dark:bg-blue-500"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-5 text-center text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">
                    <div className="text-blue-600 dark:text-blue-400">Booked</div>
                    <div className="text-blue-600 dark:text-blue-400">Picked Up</div>
                    <div className="text-blue-600 dark:text-blue-400">In Transit</div>
                    <div>Out for Delivery</div>
                    <div>Delivered</div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Live Location</h2>
                <div
                  className="aspect-video w-full overflow-hidden rounded-lg bg-center bg-cover"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1ymsJ07jnnqrN95BhzmIY3tFlQfkapZEsqdYkBejHxIUeojg673WLvrttse1tCu6wjO-vvvZErw43fIVEdkQ2LNQ30qjzrxw48PPzE14ULyDhZTnuRVoF-QLDt-FNsR15LqRG372gNzFhP_1e7bN2GrF0hMP_L60WBcSO9J1hT2BoYmGbFyICBvawrM3AvnXjzz68a4qywNAR3UbtAiexFsRGBCjPN6R392581wNtjupHESoWroW-jLViCZAUN2_hvNYLIx2En55_')`,
                  }}
                ></div>
              </div>

              {/* Tracking History */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Tracking History</h2>
                <div className="flow-root">
                  <ul className="-mb-8" role="list">
                    <li>
                      <div className="relative pb-8">
                        <span
                          aria-hidden="true"
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700"
                        ></span>
                        <div className="relative flex items-start space-x-3">
                          <div>
                            <div className="relative px-1">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 ring-8 ring-white dark:ring-slate-900">
                                <span className="material-symbols-outlined text-white" style={{ fontSize: "16px" }}>
                                  flight_takeoff
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 py-1.5">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span>Departed from facility</span>
                              <span className="whitespace-nowrap font-medium text-slate-900 dark:text-white ml-2">
                                Chicago, IL
                              </span>
                              <span className="ml-2 whitespace-nowrap">Aug 18, 10:42 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative pb-8">
                        <span
                          aria-hidden="true"
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700"
                        ></span>
                        <div className="relative flex items-start space-x-3">
                          <div>
                            <div className="relative px-1">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600 ring-8 ring-white dark:ring-slate-900">
                                <span
                                  className="material-symbols-outlined text-slate-700 dark:text-slate-200"
                                  style={{ fontSize: "16px" }}
                                >
                                  warehouse
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 py-1.5">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span>Arrived at sorting hub</span>
                              <span className="whitespace-nowrap font-medium text-slate-900 dark:text-white ml-2">
                                Chicago, IL
                              </span>
                              <span className="ml-2 whitespace-nowrap">Aug 18, 05:15 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex items-start space-x-3">
                          <div>
                            <div className="relative px-1">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600 ring-8 ring-white dark:ring-slate-900">
                                <span
                                  className="material-symbols-outlined text-slate-700 dark:text-slate-200"
                                  style={{ fontSize: "16px" }}
                                >
                                  inventory_2
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 py-1.5">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span>Package picked up by carrier</span>
                              <span className="whitespace-nowrap font-medium text-slate-900 dark:text-white ml-2">
                                Los Angeles, CA
                              </span>
                              <span className="ml-2 whitespace-nowrap">Aug 17, 03:30 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Info Cards & Actions */}
            <div className="space-y-6 lg:col-span-1">
              {/* Action Buttons */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3">
                  <button className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                    <span className="material-symbols-outlined mr-2" style={{ fontSize: "18px" }}>
                      share
                    </span>
                    <span className="truncate">Share Tracking Link</span>
                  </button>
                  <button className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined mr-2" style={{ fontSize: "18px" }}>
                      print
                    </span>
                    <span className="truncate">Print Label</span>
                  </button>
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Origin</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      123 Industrial Way, Los Angeles, CA 90001
                    </p>
                  </div>
                  <div aria-hidden="true" className="relative flex items-center">
                    <div className="flex-grow border-t border-dashed border-slate-300 dark:border-slate-700"></div>
                    <span className="mx-2 flex-shrink text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined">arrow_right_alt</span>
                    </span>
                    <div className="flex-grow border-t border-dashed border-slate-300 dark:border-slate-700"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Destination</p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      456 Corporate Blvd, New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Shipment Details</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Carrier:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">ExpressFreight</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Service:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">Priority Overnight</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Weight:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">15.2 lbs</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Dimensions:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">18x12x10 in</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Package Count:</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">1 of 1</dd>
                  </div>
                </dl>
              </div>

              {/* Support Section */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Need Help?</h2>
                <div className="space-y-3">
                  <a
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    href="#"
                  >
                    <span className="material-symbols-outlined">support_agent</span>
                    <span>Contact Support</span>
                  </a>
                  <a
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    href="#"
                  >
                    <span className="material-symbols-outlined">assignment_late</span>
                    <span>File a Claim</span>
                  </a>
                  <a
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    href="#"
                  >
                    <span className="material-symbols-outlined">quiz</span>
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
