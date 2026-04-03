import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: boolean
}

export function Card({ children, padding = true, className = '', ...props }: CardProps) {
  return (
    <div
      className={`provisioners-glass rounded-[24px] ${padding ? 'p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
