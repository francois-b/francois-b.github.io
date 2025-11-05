import * as React from "react"
import ThemeToggle from "./ThemeToggle"
import EmailIcon from "./icons/EmailIcon"
import LinkedInIcon from "./icons/LinkedInIcon"

type FloatingControlsProps = {
  onPrintClick: () => void
}

const FloatingControls: React.FC<FloatingControlsProps> = ({ onPrintClick }) => {
  return (
    <div className="floating-controls">
      <button
        className="print-button"
        onClick={onPrintClick}
        aria-label="Print CV"
        title="Print CV"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          style={{ height: "20px" }}
        >
          <rect
            x="8"
            y="4"
            width="16"
            height="6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="4"
            y="10"
            width="24"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="8" y="18" width="16" height="10" fill="currentColor" opacity="0.3" />
          <line
            x1="10"
            y1="21"
            x2="22"
            y2="21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="10"
            y1="24"
            x2="18"
            y2="24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <ThemeToggle />

      <div className="floating-contact-links">
        <a
          className="floating-icon"
          href="mailto:your.email@example.com"
          aria-label="Email"
          title="Email"
        >
          <EmailIcon width={20} height={20} />
        </a>
        <a
          className="floating-icon"
          href="https://linkedin.com/in/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <LinkedInIcon width={20} height={20} />
        </a>
      </div>
    </div>
  )
}

export default FloatingControls
