import { useState, useEffect } from "react"
import { Button } from "./button"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText: string
  matchValue: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  matchValue,
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  const [input, setInput] = useState("")

  useEffect(() => {
    if (!open) setInput("")
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <h2 className="font-mono text-lg font-black text-black uppercase dark:text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <p className="mt-1 text-xs text-gray-500 font-mono uppercase">
          Type <span className="font-black text-black dark:text-white">{matchValue}</span> to confirm
        </p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={matchValue}
          className="mt-4 w-full border-2 border-black bg-white px-3 py-2 text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            CANCEL
          </Button>
          <Button
            variant="destructive"
            disabled={input !== matchValue || loading}
            onClick={onConfirm}
          >
            {loading ? "DELETING..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
