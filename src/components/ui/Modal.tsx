import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  contentClassName?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-5xl',
}

export function Modal({ open, onClose, title, children, size = 'md', contentClassName = '' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-overlay-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className={`bg-surface rounded-xl shadow-2xl w-full ${sizeClasses[size]} ${contentClassName} animate-modal-in flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 shrink-0 ${title ? 'py-4 border-b border-border' : 'pt-3 pb-0'}`}>
          {title ? (
            <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-tertiary hover:text-text-primary transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
