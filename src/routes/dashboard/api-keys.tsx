import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  listApiKeys,
  createApiKey,
  revokeApiKey,
  sendTestWebhook,
  setWebhookUrl as updateWebhookUrl,
} from "@/lib/scrawn-server"
import { useCachedData, TTL, invalidateCache } from "@/lib/useCache"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
  const [savingWebhook, setSavingWebhook] = useState(false)
  const [sendingTest, setSendingTest] = useState<string | null>(null)

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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="w-max border-2 border-black bg-white px-4 py-2 font-mono text-3xl font-black tracking-widest text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          API KEYS
        </h1>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowCreate(true)}>CREATE NEW KEY</Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={refresh}
            disabled={loading}
          >
            REFRESH
          </Button>
        </div>
      </div>

      {createdKey && (
        <Card className="border-2 border-green-600 bg-green-300 p-0 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)] dark:border-green-400 dark:bg-green-900">
          <CardContent className="p-4">
            <p className="font-mono text-sm font-black text-green-900 uppercase dark:text-green-100">
              KEY CREATED — COPY IT NOW. YOU WON'T SEE IT AGAIN!
            </p>
            <code className="mt-3 block border-2 border-black bg-white px-4 py-3 font-mono text-sm font-bold break-all text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              {createdKey}
            </code>
          </CardContent>
        </Card>
      )}

      {showCreate && (
        <Card className="border-2 border-black bg-yellow-400 p-6 dark:border-white dark:bg-yellow-500">
          <h2 className="mb-4 font-mono text-xl font-black text-black uppercase">
            NEW API KEY
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Key Name (e.g. Production Billing)"
                className="flex-1 border-2 border-black bg-white px-3 py-2 text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <select
                className="w-40 border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "test" | "production")
                }
              >
                <option value="test">TEST</option>
                <option value="production">PRODUCTION</option>
              </select>
            </div>
            <input
              type="url"
              placeholder="WEBHOOK URL (FOR TEST EVENTS)"
              className="border-2 border-black bg-white px-3 py-2 text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none dark:bg-black dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:border-white"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            {error && (
              <p className="w-max bg-black px-2 py-1 font-mono text-sm font-bold text-red-600">
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
                {creating ? "CREATING..." : "CREATE KEY"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">
          LOADING KEYS ///
        </p>
      ) : keys.length === 0 ? (
        <p className="font-mono text-sm font-bold text-red-500 uppercase">
          NO API KEYS FOUND ///
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {keys.map((k: Record<string, unknown>) => (
            <Card
              key={k.id as string}
              className="border-2 border-black bg-white p-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between border-b-2 border-black pb-3 dark:border-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-base font-black text-black uppercase dark:text-white">
                        {k.name as string}
                      </p>
                      <span
                        className={`border-2 border-black px-1.5 py-0.5 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] ${k.role === "production" ? "bg-yellow-400 text-black dark:bg-yellow-500" : "bg-blue-400 text-black dark:bg-blue-500"}`}
                      >
                        {k.role as string}
                      </span>
                      {!!k.revoked && (
                        <span className="animate-pulse border-2 border-black bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                          REVOKED
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      ID: {k.id as string}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {k.role === "test" && !k.revoked && (
                      <Button
                        size="sm"
                        onClick={() => handleSendTest(k.id as string)}
                        disabled={sendingTest === (k.id as string)}
                      >
                        {sendingTest === (k.id as string)
                          ? "SENDING..."
                          : "SEND TEST"}
                      </Button>
                    )}
                    {!k.revoked && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRevoke(k.id as string)}
                        disabled={revoking === (k.id as string)}
                      >
                        {revoking === (k.id as string)
                          ? "REVOKING..."
                          : "REVOKE"}
                      </Button>
                    )}
                  </div>
                </div>

                {editingWebhook === (k.id as string) ? (
                  <div className="mt-3 pt-3">
                    <div className="flex gap-2">
                      <input
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 border-2 border-black bg-white px-3 py-1.5 font-mono text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none dark:border-white"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveWebhook(k.id as string)}
                        disabled={savingWebhook}
                      >
                        {savingWebhook ? "SAVING..." : "SAVE"}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingWebhook(null)}
                      >
                        CANCEL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {k.webhookUrl && (
                      <div className="mt-3 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            WEBHOOK:
                          </span>
                          <code className="border-2 border-black bg-white px-2 py-0.5 font-mono text-xs font-bold break-all text-black dark:border-white dark:bg-black dark:text-white">
                            {k.webhookUrl as string}
                          </code>
                          {!k.revoked && (
                            <button
                              onClick={() => {
                                setEditingWebhook(k.id as string)
                                setEditUrl(k.webhookUrl as string)
                              }}
                              className="border-2 border-transparent px-2 py-0.5 font-mono text-xs font-black text-[#ff00ff] uppercase transition-colors hover:border-black hover:bg-[#ff00ff] hover:text-black dark:hover:border-white dark:hover:text-white"
                            >
                              EDIT
                            </button>
                          )}
                        </div>
                        {!!k.webhookPublicKey && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              PUBLIC KEY:
                            </span>
                            <code className="border-2 border-black bg-white px-2 py-0.5 font-mono text-xs font-bold break-all text-black dark:border-white dark:bg-black dark:text-white">
                              {k.webhookPublicKey as string}
                            </code>
                            <button
                              onClick={() =>
                                copyToClipboard(k.webhookPublicKey as string)
                              }
                              className="border-2 border-transparent px-2 py-0.5 font-mono text-xs font-black text-[#ff00ff] uppercase transition-colors hover:border-black hover:bg-[#ff00ff] hover:text-black dark:hover:border-white dark:hover:text-white"
                            >
                              COPY
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {!k.webhookUrl && !k.revoked && (
                      <div className="mt-3">
                        <button
                          onClick={() => {
                            setEditingWebhook(k.id as string)
                            setEditUrl("")
                          }}
                          className="border-2 border-transparent px-2 py-1 font-mono text-xs font-black text-[#ff00ff] uppercase transition-all hover:border-black hover:bg-[#ff00ff] hover:text-black dark:hover:border-white dark:hover:text-white"
                        >
                          + ADD WEBHOOK URL
                        </button>
                      </div>
                    )}
                  </>
                )}
                {testError && k.role === "test" && (
                  <p className="mt-3 w-max bg-black px-2 py-1 font-mono text-xs font-bold text-red-600">
                    {testError}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
