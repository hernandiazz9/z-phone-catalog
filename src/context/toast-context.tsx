'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { animation } from '@/config/animation'
import { ToastStack } from '@/components/toast-stack'

export type Toast = { id: number; message: string }

type ToastContextValue = {
  show: (message: string) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const NOOP_VALUE: ToastContextValue = {
  show: () => {},
  dismiss: () => {},
}

export function useToast(): ToastContextValue {
  return useContext(ToastContext) ?? NOOP_VALUE
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const show = useCallback(
    (message: string) => {
      idRef.current += 1
      const id = idRef.current
      setToasts((current) => [...current, { id, message }])
      const timer = setTimeout(() => dismiss(id), animation.toastVisible)
      timersRef.current.set(id, timer)
    },
    [dismiss],
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      for (const timer of timers.values()) clearTimeout(timer)
      timers.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
