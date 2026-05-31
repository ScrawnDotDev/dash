import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/theme-provider"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggle = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-100"
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.2 }}
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </motion.div>
    </motion.button>
  )
}
