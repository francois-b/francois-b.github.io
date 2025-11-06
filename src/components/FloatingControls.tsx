import * as React from "react"
import ThemeToggle from "./ThemeToggle"
import EmailIcon from "./icons/EmailIcon"
import LinkedInIcon from "./icons/LinkedInIcon"
import GitHubIcon from "./icons/GitHubIcon"

const FloatingControls: React.FC = () => {
  return (
    <div className="floating-controls">
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
        <a
          className="floating-icon"
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <GitHubIcon width={20} height={20} />
        </a>
      </div>
    </div>
  )
}

export default FloatingControls
