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
      <button
        type="button"
        className={`theme-button ${theme === "sun" ? "active" : ""}`}
        onClick={() => setTheme("sun")}
        aria-label="Sun theme"
        title="Sun theme"
      >
        <img src={sunIcon} alt="" width={20} height={20} aria-hidden="true" />
      </button>

      <button
        type="button"
        className={`theme-button ${theme === "rain" ? "active" : ""}`}
        onClick={() => setTheme("rain")}
        aria-label="Rain theme"
        title="Rain theme"
      >
  <img src={umbrellaIcon} alt="" width={20} height={20} aria-hidden="true" />
      </button>

      <button
        type="button"
        className={`theme-button ${theme === "night" ? "active" : ""}`}
        onClick={() => setTheme("night")}
        aria-label="Night theme"
        title="Night theme"
      >
  <img src={moonIcon} alt="" width={20} height={20} aria-hidden="true" />
      </button>
    </div>
  )
}

export default ThemeToggle
