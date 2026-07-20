// Shared button styling so every button in the app (New Task, modal
// Cancel/Create, error Retry, etc.) looks consistent. Accepts all normal
// <button> props (onClick, type, disabled, ...) via ButtonHTMLAttributes,
// plus a `variant` to pick which style.
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' // primary = filled accent color, secondary = outlined
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'bg-surface text-ink border border-white/10 hover:bg-surface-hover',
  }

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
