import { cn } from "@/lib/utils"

type BadgeVariant = "verified" | "unverified" | "reported" | "default" | "category"

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-sm",
        {
          "bg-verified/15 text-verified border border-verified/25": variant === "verified",
          "bg-unverified/15 text-unverified border border-unverified/25": variant === "unverified",
          "bg-reported/15 text-reported border border-reported/25": variant === "reported",
          "bg-surface-dark-2 text-text-secondary-dark border border-border-dark": variant === "default",
          "bg-primary/15 text-primary border border-primary/25": variant === "category",
        },
        className
      )}
    >
      {variant === "verified" && <span className="w-1.5 h-1.5 rounded-full bg-verified" />}
      {variant === "unverified" && <span className="w-1.5 h-1.5 rounded-full bg-unverified" />}
      {variant === "reported" && <span className="w-1.5 h-1.5 rounded-full bg-reported" />}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: "verified" | "unverified" | "reported" }) {
  const labels = {
    verified: "Verified",
    unverified: "Unverified",
    reported: "Reported",
  }
  return <Badge variant={status}>{labels[status]}</Badge>
}
