"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded-lg focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none",
          {
            "bg-primary text-bg-dark hover:bg-primary-hover active:scale-[0.97] shadow-glow-sm hover:shadow-glow font-semibold":
              variant === "primary",
            "bg-surface-dark-2 text-text-primary-dark border border-border-dark-2 hover:bg-surface-dark-3 hover:border-primary/30 active:scale-[0.97]":
              variant === "secondary",
            "text-text-secondary-dark hover:text-text-primary-dark hover:bg-surface-dark-2 active:scale-[0.97]":
              variant === "ghost",
            "bg-reported/15 text-reported border border-reported/25 hover:bg-reported/25 active:scale-[0.97]":
              variant === "danger",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
