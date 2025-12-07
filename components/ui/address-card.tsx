import React from 'react'
import type { Address } from '@/types/shipment'

interface AddressCardProps {
  title: string
  address: Address
  icon?: string
}

export const AddressCard: React.FC<AddressCardProps> = ({
  title,
  address,
  icon = "📍"
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{title}</p>
      </div>
      <p className="font-semibold text-slate-900">{address.name}</p>
      <p className="text-sm text-slate-700">{address.email}</p>
      <p className="text-sm text-slate-700">{address.phone}</p>
      <div className="pt-2">
        <p className="text-sm text-slate-700">{address.address_line_1}</p>
        {address.address_line_2 && (
          <p className="text-sm text-slate-700">{address.address_line_2}</p>
        )}
        <p className="text-sm text-slate-700">
          {address.city}, {address.state} {address.postal_code}
        </p>
        <p className="text-sm text-slate-700 uppercase">{address.country}</p>
      </div>
    </div>
  )
}
