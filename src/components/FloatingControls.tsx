import * as React from "react"
import { Link } from "gatsby"
import { useTheme, type ThemeName } from "../context/theme-context"

const THEME_OPTIONS: Array<{ name: ThemeName; label: string }> = [
  { name: "sun", label: "Light theme" },
  // { name: "rain", label: "Rain theme" },
  { name: "night", label: "Dark theme" },
]

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

const FloatingControls: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="floating-controls">
      {/* Theme links group */}
      <div className="floating-controls-group">
        {THEME_OPTIONS.map(({ name, label }) => (
          <a
            key={name}
            href="#"
            className={`floating-link ${theme === name ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault()
              setTheme(name)
            }}
            aria-label={label}
            title={label}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Blog link group */}
      <div className="floating-controls-group">
        <Link
          className="floating-link"
          to="/blog"
          aria-label="Blog"
          title="Blog"
        >
          Blog
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
    </div>
  )
}

export default FloatingControls
