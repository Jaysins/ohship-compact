import React from 'react'
import { cn } from '@/lib/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  title?: string
  children: React.ReactNode
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, children, ...props }, ref) => {
    const variants = {
      default: 'border-slate-200 bg-slate-50 text-slate-900',
      success: 'border-green-500 bg-green-50 text-green-900',
      warning: 'border-amber-500 bg-amber-50 text-amber-900',
      danger: 'border-red-500 bg-red-50 text-red-900',
      info: 'border-blue-500 bg-blue-50 text-blue-900',
    }

    const iconColors = {
      default: 'text-slate-600',
      success: 'text-green-600',
      warning: 'text-amber-600',
      danger: 'text-red-600',
      info: 'text-blue-600',
    }

    const icons = {
      default: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      danger: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    }

    return (
      <div ref={ref} className={cn('rounded-xl border p-4', variants[variant], className)} {...props}>
        <div className="flex gap-3">
          <div className={cn('flex-shrink-0', iconColors[variant])}>{icons[variant]}</div>
          <div className="flex-1">
            {title && <p className="font-bold mb-1">{title}</p>}
            <div className="text-sm">{children}</div>
          </div>
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'
