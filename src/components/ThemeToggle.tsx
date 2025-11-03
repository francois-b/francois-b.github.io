import * as React from "react"
import { useTheme } from "../context/theme-context"
import "../styles/theme.css"

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle-group" role="group" aria-label="Theme toggle">
      <button
        type="button"
        className={`theme-button ${theme === "sun" ? "active" : ""}`}
        onClick={() => setTheme("sun")}
        aria-label="Sun theme"
        title="Sun theme"
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="6" fill="currentColor" />
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="26" x2="16" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="16" x2="6" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="6.34" y1="6.34" x2="9.17" y2="9.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="22.83" y1="22.83" x2="25.66" y2="25.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="6.34" y1="25.66" x2="9.17" y2="22.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="22.83" y1="9.17" x2="25.66" y2="6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        className={`theme-button ${theme === "rain" ? "active" : ""}`}
        onClick={() => setTheme("rain")}
        aria-label="Rain theme"
        title="Rain theme"
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M 8 14 Q 8 10 12 10 Q 12 6 16 6 Q 20 6 20 10 Q 24 10 24 14 Q 24 18 20 18 L 12 18 Q 8 18 8 14" fill="currentColor" />
          <line x1="12" y1="22" x2="11" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="20" x2="15" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="22" x2="19" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        className={`theme-button ${theme === "night" ? "active" : ""}`}
        onClick={() => setTheme("night")}
        aria-label="Night theme"
        title="Night theme"
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="9" fill="currentColor" />
          <circle cx="19" cy="16" r="7" fill="var(--color-bg)" />
        </svg>
      </button>
    </div>
  )
}

export default ThemeToggle
