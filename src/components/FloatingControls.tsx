import * as React from "react"
import { useTheme } from "../context/theme-context"

const FloatingControls: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="floating-controls">
      <a
        href="#"
        className={`floating-link ${theme === "sun" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault()
          setTheme("sun")
        }}
        aria-label="Light theme"
        title="Light theme"
      >
        Light theme
      </a>

      <a
        href="#"
        className={`floating-link ${theme === "night" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault()
          setTheme("night")
        }}
        aria-label="Dark theme"
        title="Dark theme"
      >
        Dark theme
      </a>

      <a
        className="floating-link"
        href="mailto:your.email@example.com"
        aria-label="Email"
        title="Email"
      >
        Email
      </a>
      <a
        className="floating-link"
        href="https://linkedin.com/in/yourprofile"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        LinkedIn
      </a>
      <a
        className="floating-link"
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        title="GitHub"
      >
        GitHub
      </a>
    </div>
  )
}

export default FloatingControls
