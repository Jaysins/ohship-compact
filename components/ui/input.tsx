import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, iconPosition = 'left', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label htmlFor={inputId} className="pb-2 text-base font-medium text-slate-800 dark:text-slate-200">
            {label}
          </label>
        )}

        <div className="relative group">
          {icon && iconPosition === 'left' && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary dark:text-slate-500 dark:group-focus-within:text-primary transition-colors">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border border-slate-300 bg-white py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder:text-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
              icon && iconPosition === 'left' && 'pl-11 pr-4',
              icon && iconPosition === 'right' && 'pl-4 pr-11',
              !icon && 'px-4',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 group-focus-within:text-primary dark:text-slate-500 dark:group-focus-within:text-primary transition-colors">
              {icon}
            </span>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
