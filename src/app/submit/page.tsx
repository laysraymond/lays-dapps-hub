"use client"

import { WalletGate } from "@/components/WalletGate"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Input, Textarea, Select } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { CATEGORIES } from "@/lib/utils"
import { useState } from "react"
import { CheckCircle, Send } from "lucide-react"

export default function SubmitPage() {
  return (
    <WalletGate>
      <SubmitContent />
    </WalletGate>
  )
}

function SubmitContent() {
  const [form, setForm] = useState({
    name: "",
    url: "",
    creatorHandle: "",
    category: "tool",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState("")

  const categoryOptions = CATEGORIES.filter((c) => c.value !== "all").map((c) => ({
    value: c.value,
    label: c.label,
  }))

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: "" }))
    setServerError("")
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.url.trim()) {
      newErrors.url = "URL is required"
    } else {
      try {
        const u = new URL(form.url)
        if (u.protocol !== "https:") newErrors.url = "URL must start with https://"
      } catch {
        newErrors.url = "Invalid URL format"
      }
    }
    if (form.description.length > 200) newErrors.description = "Max 200 characters"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }

    setSubmitting(true)
    setServerError("")
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.ok) {
        setSuccess(true)
      } else {
        setServerError(data.error || "Submission failed")
      }
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-verified/15 flex items-center justify-center">
            <CheckCircle size={32} className="text-verified" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-text-primary-dark">Submission Received!</h2>
        <p className="text-text-secondary-dark text-sm leading-relaxed">
          Your dapp has been submitted for review. It will appear publicly once approved by a moderator.
        </p>
        <Button onClick={() => { setSuccess(false); setForm({ name: "", url: "", creatorHandle: "", category: "tool", description: "" }) }}>
          Submit Another
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary-dark">Submit a dApp</h1>
        <p className="text-text-secondary-dark text-sm mt-1">
          Share a dApp built on the Ritual ecosystem. Submissions are reviewed before going live.
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="dApp Name *"
              placeholder="e.g. Ritual Chess"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
            />
            <Input
              label="URL *"
              placeholder="https://your-dapp.vercel.app"
              value={form.url}
              onChange={(e) => handleChange("url", e.target.value)}
              error={errors.url}
              hint="Must be a https:// link"
            />
            <Input
              label="Creator Handle"
              placeholder="e.g. @you on X / Discord"
              value={form.creatorHandle}
              onChange={(e) => handleChange("creatorHandle", e.target.value)}
            />
            <Select
              label="Category *"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              options={categoryOptions}
            />
            <Textarea
              label="Short Description"
              placeholder="Briefly describe what this dApp does (max 200 chars)"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              error={errors.description}
              rows={3}
              hint={`${form.description.length}/200`}
            />

            {serverError && (
              <p className="text-sm text-reported bg-reported/10 border border-reported/20 rounded-md px-3 py-2">
                {serverError}
              </p>
            )}

            <Button type="submit" className="w-full gap-2" loading={submitting}>
              <Send size={14} />
              Submit for Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
