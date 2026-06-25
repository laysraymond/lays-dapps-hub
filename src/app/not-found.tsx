import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-xl font-semibold text-text-primary-dark">Page not found</h2>
      <p className="text-text-secondary-dark text-sm max-w-sm">
        This page doesn&apos;t exist. Head back to the directory.
      </p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
