import { cn } from "@/lib/utils"

export function LoadingSpinner({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" }
  return (
    <span
      className={cn(
        "inline-block border-2 border-primary/30 border-t-primary rounded-full animate-spin",
        sizeClasses[size],
        className
      )}
    />
  )
}

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
      <LoadingSpinner size="lg" />
      <p className="text-text-secondary-dark text-sm">Loading...</p>
    </div>
  )
}

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-text-secondary-dark/40 mb-4">{icon}</div>}
      <h3 className="text-text-primary-dark font-medium mb-1">{title}</h3>
      {description && <p className="text-text-secondary-dark text-sm max-w-sm">{description}</p>}
    </div>
  )
}
