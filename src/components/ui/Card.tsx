import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
  glow?: boolean
}

export function Card({ className, children, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-dark border border-border-dark rounded-xl shadow-inner-glow transition-all duration-300",
        hover && "hover:border-primary/30 hover:shadow-glow-sm hover:-translate-y-0.5 cursor-pointer",
        glow && "verified-glow",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("px-5 py-4 border-b border-border-dark", className)}>
      {children}
    </div>
  )
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>
}
