import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { listTags, createTag, deleteTag, listExpressions, createExpression, deleteExpression } from "@/lib/scrawn-server"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/dashboard/settings")({ component: SettingsPage })

function SettingsPage() {
  const [tags, setTags] = useState<string[]>([])
  const [exprs, setExprs] = useState<string[]>([])
  const [newTagKey, setNewTagKey] = useState("")
  const [newTagAmount, setNewTagAmount] = useState("")
  const [newExprKey, setNewExprKey] = useState("")
  const [newExprBody, setNewExprBody] = useState("")
  const [error, setError] = useState("")

  const fetchAll = () => {
    listTags().then((d) => setTags(((d as { tags: string[] }).tags ?? [])))
    listExpressions().then((d) => setExprs(((d as { expressions: string[] }).expressions ?? [])))
  }

  useEffect(() => { fetchAll() }, [])

  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      await createTag({ data: { key: newTagKey, amount: parseInt(newTagAmount) || 0 } })
      setNewTagKey(""); setNewTagAmount(""); fetchAll()
    } catch (err) { setError(err instanceof Error ? err.message : "Failed") }
  }

  async function handleDeleteTag(key: string) {
    try { await deleteTag({ data: { key } }); fetchAll() } catch {}
  }

  async function handleAddExpr(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      await createExpression({ data: { key: newExprKey, expr: newExprBody } })
      setNewExprKey(""); setNewExprBody(""); fetchAll()
    } catch (err) { setError(err instanceof Error ? err.message : "Failed") }
  }

  async function handleDeleteExpr(key: string) {
    try { await deleteExpression({ data: { key } }); fetchAll() } catch {}
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-medium">Settings</h1>

      <section>
        <h2 className="mb-3 text-lg font-medium">Tags</h2>
        <form onSubmit={handleAddTag} className="mb-4 flex gap-2">
          <input value={newTagKey} onChange={(e) => setNewTagKey(e.target.value)} placeholder="TAG_NAME" required
            className="flex-1 rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm" />
          <input value={newTagAmount} onChange={(e) => setNewTagAmount(e.target.value)} placeholder="Amount (cents)" required type="number"
            className="w-32 rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm" />
          <Button type="submit">Add</Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <div key={t} className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-sm">
              <span>{t}</span>
              <button onClick={() => handleDeleteTag(t)} className="text-gray-500 hover:text-red-400">✕</button>
            </div>
          ))}
          {tags.length === 0 && <p className="text-sm text-gray-500">No tags.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Expressions</h2>
        <form onSubmit={handleAddExpr} className="mb-4 flex gap-2">
          <input value={newExprKey} onChange={(e) => setNewExprKey(e.target.value)} placeholder="EXPR_NAME" required
            className="w-40 rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm" />
          <input value={newExprBody} onChange={(e) => setNewExprBody(e.target.value)} placeholder="add(mul(tag(RATE), 2), 100)" required
            className="flex-1 rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm font-mono" />
          <Button type="submit">Add</Button>
        </form>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <div className="flex flex-wrap gap-2">
          {exprs.map((e) => (
            <div key={e} className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-1.5 text-sm">
              <span>{e}</span>
              <button onClick={() => handleDeleteExpr(e)} className="text-gray-500 hover:text-red-400">✕</button>
            </div>
          ))}
          {exprs.length === 0 && <p className="text-sm text-gray-500">No expressions.</p>}
        </div>
      </section>
    </div>
  )
}
