interface AvatarProps {
  name?: string | null
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
}

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'User avatar'}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-[linear-gradient(135deg,rgba(124,58,237,0.16),rgba(236,72,153,0.16))] text-primary-700 ring-1 ring-primary-200/80 font-medium flex items-center justify-center ${className}`}
    >
      {initials}
    </div>
  )
}
