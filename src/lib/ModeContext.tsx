import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type ViewMode = "all" | "test" | "production"

interface ModeContextValue {
  mode: ViewMode
  setMode: (m: ViewMode) => void
}

const ModeContext = createContext<ModeContextValue>({
  mode: "all",
  setMode: () => {},
})

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "all"
    return (localStorage.getItem("scrawn:viewMode") as ViewMode) || "all"
  })

  const setMode = useCallback((m: ViewMode) => {
    setModeState(m)
    try { localStorage.setItem("scrawn:viewMode", m) } catch {}
  }, [])

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode(): ModeContextValue {
  return useContext(ModeContext)
}
