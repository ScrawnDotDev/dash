import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { listApiKeys, createApiKey, revokeApiKey, sendTestWebhook } from "@/lib/scrawn-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const Route = createFileRoute("/dashboard/api-keys")({ component: ApiKeysPage })

function ApiKeysPage() {
  const [keys, setKeys] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState<"test" | "production">("test")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [error, setError] = useState("")

  const fetchKeys = () => {
    listApiKeys()
      .then((data) => setKeys((data as { keys: Array<Record<string, unknown>> }).keys ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchKeys() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const data = (await createApiKey({
        data: { name, role, expiresIn: 365 * 24 * 60 * 60, webhookUrl: webhookUrl || undefined },
      })) as Record<string, unknown>
      setCreatedKey(data.key as string)
      setName("")
      setWebhookUrl("")
      setShowCreate(false)
      fetchKeys()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key")
    }
  }

  async function handleRevoke(id: string) {
    try {
      await revokeApiKey({ data: { id } })
      fetchKeys()
    } catch {}
  }

  async function handleSendTest() {
    try {
      await sendTestWebhook()
    } catch {}
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">API Keys</h1>
        <Button onClick={() => { setShowCreate(!showCreate); setCreatedKey(null) }}>
          {showCreate ? "Cancel" : "Create Key"}
        </Button>
      </div>

      {createdKey && (
        <Card className="border-green-700 bg-green-950">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-green-400">Key created — copy it now. You won't see it again!</p>
            <code className="mt-2 block break-all rounded bg-black px-3 py-2 text-sm text-green-300">{createdKey}</code>
          </CardContent>
        </Card>
      )}

      {showCreate && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Key name" required
                className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm" />
              <select value={role} onChange={(e) => setRole(e.target.value as "test" | "production")}
                className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm">
                <option value="test">Test</option>
                <option value="production">Production</option>
              </select>
              <input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="Webhook URL (optional)"
                className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm" />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit">Generate Key</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {keys.length === 0 && <p className="text-sm text-gray-500">No API keys yet.</p>}
          {keys.map((k: Record<string, unknown>) => (
            <Card key={k.id as string}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{k.name as string}</p>
                  <p className="text-xs text-gray-500">{k.role as string} · {k.id as string}</p>
                </div>
                <div className="flex gap-2">
                  {k.role === "test" && <Button size="sm" onClick={handleSendTest}>Send Test</Button>}
                  <Button size="sm" variant="destructive" onClick={() => handleRevoke(k.id as string)} disabled={!!k.revoked}>
                    {k.revoked ? "Revoked" : "Revoke"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
