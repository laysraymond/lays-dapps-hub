import { cn } from "@/lib/utils"

export function LoadingSpinner({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-3.5 h-3.5 border-[1.5px]", md: "w-5 h-5 border-2", lg: "w-7 h-7 border-2" }
  return (
    <span
      className={cn(
        "inline-block border-primary/30 border-t-primary rounded-full animate-spin",
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
      <p className="text-text-secondary-dark text-sm animate-pulse">Loading...</p>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1.5 flex-1">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
        <div className="skeleton h-5 w-16 rounded-md" />
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
      <div className="flex justify-between items-center pt-1">
        <div className="skeleton h-5 w-14 rounded-md" />
        <div className="skeleton h-5 w-8 rounded" />
      </div>
      <div className="skeleton h-8 w-full rounded-lg mt-1" />
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 space-y-2">
      <div className="skeleton h-7 w-16 rounded mx-auto" />
      <div className="skeleton h-3 w-20 rounded mx-auto" />
    </div>
  )
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {icon && (
        <div className="text-text-muted-dark/40 mb-5 p-5 rounded-2xl bg-surface-dark border border-border-dark">
          {icon}
        </div>
      )}
      <h3 className="text-text-primary-dark font-semibold mb-2 text-lg">{title}</h3>
      {description && (
        <p className="text-text-secondary-dark text-sm max-w-sm leading-relaxed">{description}</p>
      )}
    </div>
  )
}
