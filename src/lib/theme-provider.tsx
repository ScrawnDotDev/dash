import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const stored = localStorage.getItem("scrawn-theme") as Theme | null
    if (stored === "dark" || stored === "light" || stored === "system") {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.toggle("dark", systemTheme === "dark")

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle("dark", e.matches)
      }
      mediaQuery.addEventListener("change", handleChange)

      localStorage.setItem("scrawn-theme", "system")
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      root.classList.toggle("dark", theme === "dark")
      localStorage.setItem("scrawn-theme", theme)
    }
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
