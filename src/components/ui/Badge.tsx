import { cn } from "@/lib/utils"

type BadgeVariant = "verified" | "unverified" | "reported" | "default" | "category" | "new" | "trending"

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md",
        {
          "bg-verified/10 text-verified border border-verified/20": variant === "verified",
          "bg-unverified/10 text-unverified border border-unverified/20": variant === "unverified",
          "bg-reported/10 text-reported border border-reported/20": variant === "reported",
          "bg-surface-dark-3 text-text-secondary-dark border border-border-dark": variant === "default",
          "bg-primary/10 text-primary border border-primary/20": variant === "category",
          "bg-blue-500/10 text-blue-400 border border-blue-500/20": variant === "new",
          "bg-orange-500/10 text-orange-400 border border-orange-500/20": variant === "trending",
        },
        className
      )}
    >
      {variant === "verified" && <span className="w-1.5 h-1.5 rounded-full bg-verified shrink-0" />}
      {variant === "unverified" && <span className="w-1.5 h-1.5 rounded-full bg-unverified shrink-0" />}
      {variant === "reported" && <span className="w-1.5 h-1.5 rounded-full bg-reported shrink-0" />}
      {variant === "trending" && <span className="text-[10px]">🔥</span>}
      {variant === "new" && <span className="text-[10px]">✦</span>}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: "verified" | "unverified" | "reported" }) {
  const labels = { verified: "Verified", unverified: "Unverified", reported: "Reported" }
  return <Badge variant={status}>{labels[status]}</Badge>
}
