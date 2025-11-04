/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import ThemeToggle from "./ThemeToggle"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <>
      <div className="floating-controls">
        <button
          className="print-button"
          onClick={handlePrint}
          aria-label="Print page"
          title="Print page"
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
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
            <rect
              x="8"
              y="18"
              width="16"
              height="10"
              fill="currentColor"
              opacity="0.3"
            />
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
              <polyline points="3 7 12 13 21 7" />
            </svg>
          </a>
          <a
            className="floating-icon"
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm.02 6H3v11h2V9.5Zm4 0H7v11h2v-6.1c0-1.63.7-2.4 2.06-2.4 1.26 0 1.94.86 1.94 2.4V20.5h2v-6.6c0-2.86-1.5-4.4-3.77-4.4-1.73 0-2.23.95-2.73 1.6V9.5Z" />
            </svg>
          </a>
        </div>
      </div>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `var(--size-content)`,
          padding: `var(--size-gutter)`,
        }}
      >
        <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
        <main>{children}</main>
        <footer
          style={{
            marginTop: `var(--space-5)`,
            fontSize: `var(--font-sm)`,
          }}
        >
          © {new Date().getFullYear()} &middot; Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </footer>
      </div>
    </>
  )
}

export default Layout
