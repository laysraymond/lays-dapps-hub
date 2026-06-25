import { cn } from "@/lib/utils"
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-secondary-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-surface-dark-2 border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary-dark placeholder:text-text-secondary-dark/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
            error && "border-reported focus:border-reported focus:ring-reported",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-text-secondary-dark">{hint}</p>}
        {error && <p className="text-xs text-reported">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-secondary-dark">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-surface-dark-2 border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary-dark placeholder:text-text-secondary-dark/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none",
            error && "border-reported focus:border-reported focus:ring-reported",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-text-secondary-dark">{hint}</p>}
        {error && <p className="text-xs text-reported">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-text-secondary-dark">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-surface-dark-2 border border-border-dark rounded-md px-3 py-2 text-sm text-text-primary-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors",
            error && "border-reported",
            className
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-reported">{error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"
