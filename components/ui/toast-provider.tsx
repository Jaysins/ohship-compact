'use client'

import { Toaster } from 'sonner'

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        style: {
          background: 'white',
          color: '#0a2540',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: '1rem',
          fontSize: '0.875rem',
        },
        className: 'toast',
      }}
    />
  )
}
