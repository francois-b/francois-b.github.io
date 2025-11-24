import * as React from "react"
import { useTheme } from "../context/theme-context"
import sunIcon from "../images/newicons/sun.svg"
import umbrellaIcon from "../images/newicons/umbrella.svg"
import moonIcon from "../images/newicons/moon.svg"
import "../styles/theme.css"

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle-group" role="group" aria-label="Theme toggle">
      <a
        href="#"
        className={`theme-button ${theme === "sun" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault()
          setTheme("sun")
        }}
        aria-label="Sun theme"
        title="Sun theme"
      >
        Sun
      </a>

      <a
        href="#"
        className={`theme-button ${theme === "rain" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault()
          setTheme("rain")
        }}
        aria-label="Rain theme"
        title="Rain theme"
      >
        Rain
      </a>

      <a
        href="#"
        className={`theme-button ${theme === "night" ? "active" : ""}`}
        onClick={(e) => {
          e.preventDefault()
          setTheme("night")
        }}
        aria-label="Night theme"
        title="Night theme"
      >
        Night
      </a>
    </div>
  )
}

export default ThemeToggle
