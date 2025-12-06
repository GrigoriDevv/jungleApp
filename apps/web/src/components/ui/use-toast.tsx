"use client"

import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { toastVariants } from "./toast"

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement
  duration?: number
  className?: string
}

type ToastInput = Omit<ToastProps, "id">

const ToastContext = React.createContext<{
  toast: (toast: ToastInput) => void
  dismiss: (id: string) => void
  toasts: ToastProps[]
} | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((input: ToastInput) => {
    const id = crypto.randomUUID()
    const newToast: ToastProps = { id, duration: 5000, ...input }
    setToasts((currentToasts) => [...currentToasts, newToast])

    const duration = newToast.duration ?? 5000
    if (duration !== Infinity && duration > 0) {
      setTimeout(() => {
        setToasts((currentToasts) => currentToasts.filter((i) => i.id !== id))
      }, duration)
    }
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((item) => item.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}