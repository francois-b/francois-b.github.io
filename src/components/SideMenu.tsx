import * as React from "react"
import { Link } from "gatsby"
import { useTheme, type ThemePreference } from "../context/theme-context"

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const SystemIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const THEME_CYCLE: ThemePreference[] = ["system", "sun", "night"]

const THEME_LABELS: Record<ThemePreference, string> = {
  system: "System theme",
  sun: "Light theme",
  night: "Dark theme",
}

const CONTACT_LINKS = [
  {
    href: "mailto:your.email@example.com",
    label: "Email",
  },
  {
    href: "https://linkedin.com/in/yourprofile",
    label: "LinkedIn",
  },
  {
    href: "https://github.com/yourusername",
    label: "GitHub",
  },
]

const SideMenu: React.FC = () => {
  const { preference, setPreference } = useTheme()

  const cycleTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(preference)
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length
    setPreference(THEME_CYCLE[nextIndex])
  }

  const getIcon = () => {
    switch (preference) {
      case "system": return <SystemIcon />
      case "sun": return <SunIcon />
      case "night": return <MoonIcon />
    }
  }

  return (
    <div className="floating-controls">
      {/* Name and title */}
      <div className="floating-controls-group sidebar-identity">
        <h1 className="sidebar-name">
          <span>François</span>
          <span>Bouet</span>
        </h1>
        <p className="sidebar-title">Web & AI engineering</p>
      </div>

      {/* Navigation links group */}
      <div className="floating-controls-group">
        <Link
          className="floating-link"
          to="/blog"
          aria-label="Blog"
          title="Blog"
        >
          Articles
        </Link>
        <Link
          className="floating-link"
          to="/projects"
          aria-label="Projects"
          title="Projects"
        >
          Projects
        </Link>
        <Link
          className="floating-link"
          to="/colophon"
          aria-label="Colophon"
          title="Colophon"
        >
          Colophon
        </Link>
      </div>

      {/* Contact links group */}
      <div className="floating-controls-group">
        {CONTACT_LINKS.map(({ href, label }) => (
          <a
            key={href}
            className="floating-link"
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={label}
            title={label}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Theme toggle at bottom */}
      <div className="floating-controls-group sidebar-theme-toggle">
        <button
          className="theme-toggle-button"
          onClick={cycleTheme}
          aria-label={THEME_LABELS[preference]}
          title={THEME_LABELS[preference]}
        >
          {getIcon()}
        </button>
      </div>
    </div>
  )
}

export default SideMenu
