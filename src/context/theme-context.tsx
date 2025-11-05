import * as React from "react"

type ThemeName = "sun" | "rain" | "night"

type ThemeContextValue = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = "preferred-theme"
const THEME_CLASSNAMES = ["theme-sun", "theme-rain", "theme-night"]

const isThemeName = (value: string | null): value is ThemeName =>
  value === "sun" || value === "rain" || value === "night"

const getInitialTheme = (): ThemeName => {
  if (typeof window === "undefined") {
    return "sun"
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (isThemeName(stored)) {
    return stored
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches
  return prefersDark ? "night" : "sun"
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<ThemeName>(getInitialTheme)

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return
    }

    const body = document.body
    body.classList.remove(...THEME_CLASSNAMES)
    body.classList.add(`theme-${theme}`)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value = React.useMemo(() => ({ theme, setTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
