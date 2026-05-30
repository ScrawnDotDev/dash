import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { listTags, createTag, deleteTag, listExpressions, createExpression, deleteExpression } from "@/lib/scrawn-server"
import { useCachedData, TTL, invalidateCache } from "@/lib/useCache"
import { ExpressionBuilder } from "@/components/ExpressionBuilder"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage })

function SettingsPage() {
  const tags = useCachedData("tags", listTags, TTL.TAGS)
  const exprs = useCachedData("expressions", listExpressions, TTL.EXPRESSIONS)
  const tagList = (tags.data as { tags: string[] } | null)?.tags ?? []
  const exprList = (exprs.data as { expressions: string[] } | null)?.expressions ?? []

  const [newTagKey, setNewTagKey] = useState("")
  const [newTagAmount, setNewTagAmount] = useState("")
  const [exprError, setExprError] = useState<string | null>(null)
  const [tagError, setTagError] = useState("")

  function refreshAll() {
    invalidateCache("tags")
    invalidateCache("expressions")
    tags.refresh()
    exprs.refresh()
  }

  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault()
    setTagError("")
    try {
      await createTag({ data: { key: newTagKey, amount: parseInt(newTagAmount) || 0 } })
      setNewTagKey(""); setNewTagAmount(""); refreshAll()
    } catch (err) { setTagError(err instanceof Error ? err.message : "Failed") }
  }

  async function handleDeleteTag(key: string) {
    try { await deleteTag({ data: { key } }); refreshAll() } catch {}
  }

  async function handleAddExpr(key: string, expr: string) {
    setExprError(null)
    try {
      await createExpression({ data: { key, expr } })
      refreshAll()
    } catch (err) { setExprError(err instanceof Error ? err.message : "Failed to save expression") }
  }

  async function handleDeleteExpr(key: string) {
    try { await deleteExpression({ data: { key } }); refreshAll() } catch {}
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Settings</h1>
        <Button size="sm" variant="secondary" onClick={refreshAll}>
          Refresh
        </Button>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium">Tags</h2>
        <form onSubmit={handleAddTag} className="mb-4 flex gap-2">
          <input value={newTagKey} onChange={(e) => setNewTagKey(e.target.value)} placeholder="TAG_NAME" required
            className="flex-1 rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm" />
          <input value={newTagAmount} onChange={(e) => setNewTagAmount(e.target.value)} placeholder="Amount" required type="number"
            className="w-32 rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm" />
          <Button type="submit">Add</Button>
        </form>
        {tagError && <p className="mb-2 text-sm text-red-400">{tagError}</p>}
        <div className="flex flex-wrap gap-2">
          {tagList.map((t) => (
            <div key={t} className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-sm">
              <span>{t}</span>
              <button onClick={() => handleDeleteTag(t)} className="text-gray-500 hover:text-red-400">✕</button>
            </div>
          ))}
          {tagList.length === 0 && <p className="text-sm text-gray-500">No tags.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Expressions</h2>
        <div className="mb-4">
          <ExpressionBuilder
            tags={tagList}
            expressions={exprList}
            onError={setExprError}
            onSaveExpression={handleAddExpr}
          />
        </div>
        {exprError && <p className="mb-2 text-sm text-red-400">{exprError}</p>}
        <div className="flex flex-wrap gap-2">
          {exprList.map((e) => (
            <div key={e} className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-sm">
              <span>{e}</span>
              <button onClick={() => handleDeleteExpr(e)} className="text-gray-500 hover:text-red-400">✕</button>
            </div>
          ))}
          {exprList.length === 0 && <p className="text-sm text-gray-500">No expressions.</p>}
        </div>
      </section>
    </div>
  )
}
