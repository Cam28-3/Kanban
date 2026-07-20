import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'bg-surface text-ink border border-ink/10 hover:bg-canvas',
  }

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
