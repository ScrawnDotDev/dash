import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { listApiKeys, createApiKey, revokeApiKey, sendTestWebhook, setWebhookUrl as updateWebhookUrl } from "@/lib/scrawn-server"
import { useCachedData, TTL, invalidateCache } from "@/lib/useCache"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const Route = createFileRoute("/dashboard/api-keys")({ component: ApiKeysPage })

const CACHE_KEY = "api-keys"

function ApiKeysPage() {
  const { data: keysData, loading, refresh } = useCachedData(CACHE_KEY, listApiKeys, TTL.API_KEYS)
  const keys = ((keysData as Record<string, unknown> | null)?.keys as Array<Record<string, unknown>>) ?? []

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState<"test" | "production">("test")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [editingWebhook, setEditingWebhook] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState("")
  const [testError, setTestError] = useState("")

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const data = (await createApiKey({
        data: { name, role, expiresIn: 365 * 24 * 60 * 60, webhookUrl },
      })) as Record<string, unknown>
      setCreatedKey(data.key as string)
      setName("")
      setWebhookUrl("")
      setShowCreate(false)
      invalidateCache(CACHE_KEY)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key")
    }
  }

  async function handleSaveWebhook(apiKeyId: string) {
    try {
      await updateWebhookUrl({ data: { apiKeyId, url: editUrl } })
      setEditingWebhook(null)
      setEditUrl("")
      invalidateCache(CACHE_KEY)
      refresh()
    } catch {}
  }

  async function handleRevoke(id: string) {
    try {
      await revokeApiKey({ data: { id } })
      invalidateCache(CACHE_KEY)
      refresh()
    } catch {}
  }

  async function handleSendTest(apiKeyId: string) {
    setTestError("")
    try {
      await sendTestWebhook({ data: { apiKeyId } })
    } catch (err) {
      setTestError(err instanceof Error ? err.message : "Failed to send test webhook")
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">API Keys</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
          <Button onClick={() => { setShowCreate(!showCreate); setCreatedKey(null) }}>
            {showCreate ? "Cancel" : "Create Key"}
          </Button>
        </div>
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
              <input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="Webhook URL (required)"
                required className="rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm" />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit">Generate Key</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : keys.length === 0 ? (
        <p className="text-sm text-gray-500">No API keys yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {keys.map((k: Record<string, unknown>) => (
            <Card key={k.id as string}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{k.name as string}</p>
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-400">{k.role as string}</span>
                      {!!k.revoked && <span className="rounded bg-red-900 px-1.5 py-0.5 text-xs text-red-400">Revoked</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">ID: {k.id as string}</p>
                  </div>
                  <div className="flex gap-2">
                    {k.role === "test" && !k.revoked && <Button size="sm" onClick={() => handleSendTest(k.id as string)}>Send Test</Button>}
                    {!k.revoked && (
                      <Button size="sm" variant="destructive" onClick={() => handleRevoke(k.id as string)}>Revoke</Button>
                    )}
                  </div>
                </div>

                {editingWebhook === (k.id as string) ? (
                  <div className="mt-3 border-t border-gray-800 pt-3">
                    <div className="flex gap-2">
                      <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="https://..." className="flex-1 rounded-lg border border-gray-700 bg-transparent px-3 py-1.5 text-xs" />
                      <Button size="sm" onClick={() => handleSaveWebhook(k.id as string)}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingWebhook(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {k.webhookUrl && (
                      <div className="mt-3 border-t border-gray-800 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Webhook:</span>
                          <code className="break-all text-xs text-gray-300">{k.webhookUrl as string}</code>
                          {!k.revoked && (
                            <button onClick={() => { setEditingWebhook(k.id as string); setEditUrl(k.webhookUrl as string) }}
                              className="text-xs text-yellow-500 hover:text-yellow-400">Edit</button>
                          )}
                        </div>
                        {!!k.webhookPublicKey && (
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-gray-500">Public Key:</span>
                            <code className="break-all text-xs text-gray-300">{k.webhookPublicKey as string}</code>
                            <button onClick={() => copyToClipboard(k.webhookPublicKey as string)}
                              className="text-xs text-yellow-500 hover:text-yellow-400">Copy</button>
                          </div>
                        )}
                      </div>
                    )}
                    {!k.webhookUrl && !k.revoked && (
                      <div className="mt-2">
                        <button onClick={() => { setEditingWebhook(k.id as string); setEditUrl("") }}
                          className="text-xs text-yellow-600 hover:text-yellow-500">
                          + Set Webhook URL
                        </button>
                      </div>
                    )}
                  </>
                )}
                {testError && k.role === "test" && (
                  <p className="mt-2 text-xs text-red-400">{testError}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
