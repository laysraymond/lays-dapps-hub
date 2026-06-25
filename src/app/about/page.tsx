import { Card, CardContent, CardHeader } from "@/components/ui/Card"
import { Badge, StatusBadge } from "@/components/ui/Badge"
import { CheckCircle, Shield, Flag, Coins } from "lucide-react"

export const metadata = { title: "About — Lays Dapps Hub" }

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Hero */}
      <div className="space-y-4">
        <Badge variant="category">Community Hub</Badge>
        <h1 className="text-3xl font-bold text-text-primary-dark">About Lays Dapps Hub</h1>
        <p className="text-text-secondary-dark leading-relaxed">
          Lays Dapps Hub is a community-run directory of dApps, tools, and games built around the{" "}
          <a href="https://ritual.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Ritual
          </a>{" "}
          AI/crypto ecosystem. It is <strong className="text-text-primary-dark">not</strong> an official product of the
          Ritual Foundation.
        </p>
        <div className="inline-block text-xs bg-surface-dark-2 border border-border-dark px-3 py-2 rounded-md text-text-secondary-dark">
          Community Hub — not an official Ritual Foundation product
        </div>
      </div>

      {/* Status badges */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <h2 className="font-semibold text-text-primary-dark">Status Badges</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary-dark">Each dapp displays a status badge indicating its safety level:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <StatusBadge status="verified" />
              <p className="text-sm text-text-secondary-dark">
                <span className="text-text-primary-dark font-medium">Verified</span> — The dapp has been manually reviewed and confirmed working and safe by the community moderators.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <StatusBadge status="unverified" />
              <p className="text-sm text-text-secondary-dark">
                <span className="text-text-primary-dark font-medium">Unverified</span> — The dapp has been submitted but not yet fully reviewed. Use with caution.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <StatusBadge status="reported" />
              <p className="text-sm text-text-secondary-dark">
                <span className="text-text-primary-dark font-medium">Reported</span> — The dapp has received community reports. Do not interact until resolved.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification checklist */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-primary" />
            <h2 className="font-semibold text-text-primary-dark">Verification Checklist</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary-dark mb-4">A dapp is marked Verified when moderators confirm:</p>
          <ul className="space-y-2">
            {[
              "The URL is live and reachable",
              "The dapp is related to the Ritual ecosystem",
              "No apparent phishing or wallet-draining behavior",
              "The creator handle is real and traceable",
              "The dapp doesn't impersonate the official Ritual Foundation",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-text-secondary-dark">
                <CheckCircle size={14} className="text-verified mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* How to report */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flag size={16} className="text-secondary" />
            <h2 className="font-semibold text-text-primary-dark">How to Report a Dapp</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary-dark leading-relaxed">
            If you find a dapp that is broken, suspicious, or harmful, click the{" "}
            <span className="text-text-primary-dark font-medium">flag icon</span> on any dapp card to submit a report.
            Provide a clear reason so moderators can act quickly. Reports are reviewed in the admin panel and resolved
            as soon as possible.
          </p>
        </CardContent>
      </Card>

      {/* Access fee */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-secondary" />
            <h2 className="font-semibold text-text-primary-dark">Session Access Fee</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary-dark leading-relaxed mb-3">
            Before browsing the directory, a small one-time-per-session fee of{" "}
            <span className="text-text-primary-dark font-medium">0.001 RITUAL</span> (testnet token — no real monetary
            value) is required. This fee serves two purposes:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-text-secondary-dark">
              <span className="text-primary mt-0.5">→</span>
              <span><strong className="text-text-primary-dark">Anti-spam</strong> — discourages bots and automated scrapers from abusing the directory.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-text-secondary-dark">
              <span className="text-primary mt-0.5">→</span>
              <span><strong className="text-text-primary-dark">Maintenance</strong> — helps support ongoing updates and curation of the dapp listing.</span>
            </li>
          </ul>
          <p className="text-sm text-text-secondary-dark mt-3">
            The fee is scoped to the current browser session — it clears when you close the browser tab or explicitly
            disconnect. No personal data is stored.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
