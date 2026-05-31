import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { listApiKeys, getEventTypeDistribution } from "@/lib/scrawn-server"
import { EventFilters, type EventFiltersValue } from "@/components/events/EventFilters"
import { EventList } from "@/components/events/EventList"
import { Button } from "@/components/ui/button"
import { useCachedData, TTL } from "@/lib/useCache"

export const Route = createFileRoute("/dashboard/events")({
  component: EventsPage,
})

function EventsPage() {
  const [filters, setFilters] = useState<EventFiltersValue>({})
  const keys = useCachedData("events-page-keys", listApiKeys, TTL.API_KEYS)
  const types = useCachedData("events-page-types", getEventTypeDistribution, TTL.DASHBOARD_SUMMARY)

  const keysData = (keys.data as { keys: Array<Record<string, unknown>> } | null)?.keys ?? []
  const apiKeyOptions = keysData.map((k) => ({
    value: k.id as string,
    label: k.name as string,
  }))

  const typesData = (types.data as Array<{ groupValue: string }>) ?? []
  const eventTypeOptions = [...new Set(typesData.map((t) => t.groupValue).filter(Boolean))]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl font-black tracking-widest text-black uppercase dark:text-white">
          Events
        </h1>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setFilters({})
            window.location.reload()
          }}
        >
          RESET
        </Button>
      </div>

      <div className="border-2 border-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
        <EventFilters
          value={filters}
          onChange={setFilters}
          apiKeyOptions={apiKeyOptions}
          eventTypeOptions={eventTypeOptions}
          loading={keys.loading || types.loading}
        />
      </div>

      <EventList
        apiKeyId={filters.apiKeyId}
        userId={filters.userId}
        eventType={filters.eventType}
        model={filters.model}
        pageSize={15}
        title="All Events"
      />
    </div>
  )
}
