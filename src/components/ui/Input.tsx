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
          <label className="block text-xs font-medium text-text-secondary-dark uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-surface-dark-2 border border-border-dark rounded-lg px-3 py-2.5 text-sm text-text-primary-dark placeholder:text-text-muted-dark focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors",
            error && "border-reported/60 focus:border-reported focus:ring-reported/20",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-text-muted-dark">{hint}</p>}
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
          <label className="block text-xs font-medium text-text-secondary-dark uppercase tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-surface-dark-2 border border-border-dark rounded-lg px-3 py-2.5 text-sm text-text-primary-dark placeholder:text-text-muted-dark focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors resize-none",
            error && "border-reported/60 focus:border-reported focus:ring-reported/20",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-text-muted-dark">{hint}</p>}
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
          <label className="block text-xs font-medium text-text-secondary-dark uppercase tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-surface-dark-2 border border-border-dark rounded-lg px-3 py-2.5 text-sm text-text-primary-dark focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors",
            error && "border-reported/60",
            className
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-surface-dark-2">
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
