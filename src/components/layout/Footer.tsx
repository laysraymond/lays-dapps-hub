import Image from "next/image"
import { Globe, Github, ExternalLink } from "lucide-react"

function XIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.1.133 18.117a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

const links = [
  { href: "https://ritual.net", label: "Website", Icon: Globe },
  { href: "https://x.com/ritualnet", label: "X", Icon: XIcon },
  { href: "https://discord.com/invite/ritual-net", label: "Discord", Icon: DiscordIcon },
  { href: "https://github.com/ritual-net", label: "GitHub", Icon: Github },
]

export function Footer() {
  return (
    <footer className="border-t border-border-dark mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Official links */}
          <div className="flex items-center gap-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-text-muted-dark hover:text-text-secondary-dark transition-colors"
              >
                <l.Icon />
                <span className="hidden sm:inline">{l.label}</span>
              </a>
            ))}
          </div>

          {/* Creator credit */}
          <a
            href="https://x.com/Laysraymond66"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-muted-dark hover:text-text-secondary-dark transition-colors group"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border-dark-2 group-hover:border-primary/30 transition-colors shrink-0">
              <Image src="/creator-avatar.jpg" alt="Lays" fill sizes="28px" className="object-cover" />
            </div>
            <span>Built by Lays</span>
            <ExternalLink size={11} className="opacity-50" />
          </a>
        </div>

        <div className="mt-5 pt-5 border-t border-border-dark text-center">
          <p className="text-xs text-text-muted-dark">
            Community Hub — not an official Ritual Foundation product
          </p>
        </div>
      </div>
    </footer>
  )
}
