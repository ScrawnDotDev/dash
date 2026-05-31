import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  listApiKeys,
  createApiKey,
  revokeApiKey,
  sendTestWebhook,
  setWebhookUrl as updateWebhookUrl,
} from "@/lib/scrawn-server"
import { useCachedData, TTL, invalidateCache, useIsRefreshing } from "@/lib/useCache"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export const Route = createFileRoute("/dashboard/api-keys")({
  component: ApiKeysPage,
})

const CACHE_KEY = "api-keys"

function ApiKeysPage() {
  const {
    data: keysData,
    loading,
    refresh,
  } = useCachedData(CACHE_KEY, listApiKeys, TTL.API_KEYS)
  const keys =
    ((keysData as Record<string, unknown> | null)?.keys as Array<
      Record<string, unknown>
    >) ?? []

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState<"test" | "production">("test")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [editingWebhook, setEditingWebhook] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState("")
  const [testError, setTestError] = useState("")
  const [creating, setCreating] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null)
  const [savingWebhook, setSavingWebhook] = useState(false)
  const [sendingTest, setSendingTest] = useState<string | null>(null)
  const refreshing = useIsRefreshing()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setCreating(true)
    try {
      const data = (await createApiKey({
        data: { name, role, expiresIn: 365 * 24 * 60 * 60, webhookUrl },
      })) as Record<string, unknown>
      setCreatedKey(data.key as string)
      setName("")
      setWebhookUrl("")
      setShowCreate(false)
      invalidateCache(CACHE_KEY)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key")
    } finally {
      setCreating(false)
    }
  }

  async function handleSaveWebhook(apiKeyId: string) {
    setSavingWebhook(true)
    try {
      await updateWebhookUrl({ data: { apiKeyId, url: editUrl } })
      setEditingWebhook(null)
      setEditUrl("")
      invalidateCache(CACHE_KEY)
      await refresh()
    } catch {
    } finally {
      setSavingWebhook(false)
    }
  }

  async function handleRevoke(id: string) {
    setRevoking(id)
    try {
      await revokeApiKey({ data: { id } })
      invalidateCache(CACHE_KEY)
      await refresh()
    } catch {
    } finally {
      setRevoking(null)
    }
  }

  async function handleSendTest(apiKeyId: string) {
    setTestError("")
    setSendingTest(apiKeyId)
    try {
      await sendTestWebhook({ data: { apiKeyId } })
    } catch (err) {
      setTestError(
        err instanceof Error ? err.message : "Failed to send test webhook"
      )
    } finally {
      setSendingTest(null)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-black tracking-widest text-black uppercase dark:text-white">
          API Keys
        </h1>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowCreate(true)} disabled={creating}>
            {creating ? "CREATING..." : "CREATE KEY"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={refresh}
            disabled={loading || refreshing}
          >
            {refreshing ? "REFRESHING..." : "REFRESH"}
          </Button>
        </div>
      </div>

      {createdKey && (
        <Card className="border-2 border-green-600 bg-green-200 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)] dark:border-green-400 dark:bg-green-900 dark:shadow-[2px_2px_0px_0px_rgba(74,222,128,1)]">
          <CardContent className="p-4">
            <p className="font-mono text-xs font-black text-green-900 uppercase dark:text-green-100">
              Key Created — Copy It Now. You Won't See It Again!
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 border-2 border-black bg-white px-3 py-2 font-mono text-xs font-bold break-all text-black dark:border-white dark:bg-black dark:text-white">
                {createdKey}
              </code>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copyToClipboard(createdKey)}
              >
                COPY
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showCreate && (
        <Card className="bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:bg-yellow-500 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <CardHeader>
            <CardTitle className="text-black dark:text-black">New API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Key name (e.g. Production Billing)"
                  className="border-2 border-black bg-white px-3 py-2 text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <select
                  className="border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:bg-black dark:text-white dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "test" | "production")
                  }
                >
                  <option value="test">Test</option>
                  <option value="production">Production</option>
                </select>
                <input
                  type="url"
                  placeholder="Webhook URL (optional)"
                  className="border-2 border-black bg-white px-3 py-2 text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
              {error && (
                <p className="w-max bg-black px-2 py-1 font-mono text-xs font-bold text-red-500">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreate(false)}
                  disabled={creating}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="bg-black text-white dark:bg-white dark:text-black"
                  disabled={creating}
                >
                  CREATE
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 font-mono">Loading keys...</p>
      ) : keys.length === 0 ? (
        <p className="font-mono text-sm font-bold text-red-500 uppercase">
          No API Keys Found
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {keys.map((k: Record<string, unknown>) => {
            const keyId = k.id as string
            const shortId = keyId.length > 14 ? keyId.slice(0, 14) + "..." : keyId
            return (
              <Card
                key={keyId}
                className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
              >
                <CardContent className="p-0">
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="min-w-0 flex-1 flex items-center gap-3">
                      <p className="font-mono text-sm font-black text-black uppercase dark:text-white truncate">
                        {k.name as string}
                      </p>
                      <span
                        className={`border-2 border-black px-1.5 py-0.5 font-mono text-xs font-bold uppercase shrink-0 ${
                          k.role === "production"
                            ? "bg-yellow-400 text-black"
                            : "bg-blue-400 text-black"
                        }`}
                      >
                        {k.role as string}
                      </span>
                      {!!k.revoked && (
                        <span className="border-2 border-black bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white uppercase shrink-0">
                          Revoked
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {k.role === "test" && !k.revoked && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSendTest(keyId)}
                          disabled={sendingTest === keyId}
                        >
                          {sendingTest === keyId ? "..." : "TEST"}
                        </Button>
                      )}
                      {!k.revoked && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmRevoke(keyId)}
                        >
                          REVOKE
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="border-t-2 border-black px-4 py-2 dark:border-white">
                    <p className="font-mono text-xs text-gray-400">
                      {shortId}
                    </p>
                  </div>

                  {testError && k.role === "test" && (
                    <p className="mx-4 mb-2 w-max bg-black px-2 py-1 font-mono text-xs font-bold text-red-500">
                      {testError}
                    </p>
                  )}

                  {editingWebhook === keyId ? (
                    <div className="border-t-2 border-black px-4 py-3 dark:border-white">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono uppercase shrink-0">
                          Webhook:
                        </span>
                        <input
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 border-2 border-black bg-white px-2 py-1.5 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveWebhook(keyId)}
                          disabled={savingWebhook}
                        >
                          {savingWebhook ? "..." : "SAVE"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingWebhook(null)}
                        >
                          CANCEL
                        </Button>
                      </div>
                    </div>
                  ) : k.webhookUrl ? (
                    <div className="border-t-2 border-black px-4 py-2 dark:border-white">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-mono uppercase shrink-0">
                          Webhook:
                        </span>
                        <span className="flex-1 font-mono text-sm font-bold text-black truncate dark:text-white">
                          {k.webhookUrl as string}
                        </span>
                        {!k.revoked && (
                          <button
                            onClick={() => {
                              setEditingWebhook(keyId)
                              setEditUrl(k.webhookUrl as string)
                            }}
                            className="border-2 border-black px-2 py-0.5 font-mono text-xs font-bold text-black uppercase transition-all hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black shrink-0"
                          >
                            EDIT
                          </button>
                        )}
                      </div>
                      {!!k.webhookPublicKey && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-mono uppercase shrink-0">
                            PubKey:
                          </span>
                          <span className="flex-1 font-mono text-sm font-bold text-black truncate dark:text-white">
                            {k.webhookPublicKey as string}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(k.webhookPublicKey as string)
                            }
                            className="border-2 border-black px-2 py-0.5 font-mono text-xs font-bold text-black uppercase transition-all hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black shrink-0"
                          >
                            COPY
                          </button>
                        </div>
                      )}
                    </div>
                  ) : !k.revoked ? (
                    <div className="border-t-2 border-black px-4 py-2 dark:border-white">
                      <button
                        onClick={() => {
                          setEditingWebhook(keyId)
                          setEditUrl("")
                        }}
                        className="border-2 border-black px-2 py-0.5 font-mono text-xs font-bold text-black uppercase transition-all hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                      >
                        + ADD WEBHOOK
                      </button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmRevoke !== null}
        title="Revoke API Key"
        message="This will permanently revoke the API key. Any services using this key will immediately lose access."
        confirmText="REVOKE"
        matchValue={keys.find((k) => k.id === confirmRevoke)?.name as string ?? ""}
        onConfirm={() => {
          if (confirmRevoke) handleRevoke(confirmRevoke)
          setConfirmRevoke(null)
        }}
        onCancel={() => setConfirmRevoke(null)}
        loading={revoking !== null}
      />
    </div>
  )
}
