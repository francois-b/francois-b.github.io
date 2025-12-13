import * as React from "react"

export type ThemeName = "sun" | "rain" | "night"
export type ThemePreference = ThemeName | "system"

type ThemeContextValue = {
  theme: ThemeName
  preference: ThemePreference
  setPreference: (pref: ThemePreference) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = "preferred-theme"
const THEME_CLASSNAMES = ["theme-sun", "theme-rain", "theme-night"]

const isThemePreference = (value: string | null): value is ThemePreference =>
  value === "sun" || value === "rain" || value === "night" || value === "system"

const getSystemTheme = (): ThemeName => {
  if (typeof window === "undefined") return "sun"
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "night" : "sun"
}

const getInitialPreference = (): ThemePreference => {
  if (typeof window === "undefined") return "system"
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isThemePreference(stored) ? stored : "system"
}

const resolveTheme = (pref: ThemePreference): ThemeName =>
  pref === "system" ? getSystemTheme() : pref

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreference] = React.useState<ThemePreference>(getInitialPreference)
  const [theme, setTheme] = React.useState<ThemeName>(() => resolveTheme(preference))

  // Update theme when preference changes
  React.useEffect(() => {
    setTheme(resolveTheme(preference))
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  }, [preference])

  // Listen for system theme changes when preference is "system"
  React.useEffect(() => {
    if (preference !== "system" || typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setTheme(getSystemTheme())

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [preference])

  // Apply theme class to body
  React.useEffect(() => {
    if (typeof document === "undefined") return

    const body = document.body
    body.classList.remove(...THEME_CLASSNAMES)
    body.classList.add(`theme-${theme}`)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const value = React.useMemo(
    () => ({ theme, preference, setPreference }),
    [theme, preference]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
