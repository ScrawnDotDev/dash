export interface EventFiltersValue {
  apiKeyId?: string
  userId?: string
  eventType?: string
  model?: string
}

interface EventFiltersProps {
  value: EventFiltersValue
  onChange: (filters: EventFiltersValue) => void
  apiKeyOptions: { value: string; label: string }[]
  eventTypeOptions: string[]
  loading?: boolean
}

export function EventFilters({
  value,
  onChange,
  apiKeyOptions,
  eventTypeOptions,
  loading,
}: EventFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] font-bold text-gray-400 uppercase">API Key</label>
        <select
          value={value.apiKeyId ?? ""}
          onChange={(e) => onChange({ ...value, apiKeyId: e.target.value || undefined })}
          disabled={loading}
          className="border-2 border-black bg-white px-2 py-1.5 font-mono text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none disabled:opacity-50 dark:bg-black dark:text-white dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
          <option value="">All Keys</option>
          {apiKeyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] font-bold text-gray-400 uppercase">Event Type</label>
        <select
          value={value.eventType ?? ""}
          onChange={(e) => onChange({ ...value, eventType: e.target.value || undefined })}
          disabled={loading}
          className="border-2 border-black bg-white px-2 py-1.5 font-mono text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none disabled:opacity-50 dark:bg-black dark:text-white dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
          <option value="">All Types</option>
          {eventTypeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      {value.eventType === "AI_TOKEN_USAGE" && (
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] font-bold text-gray-400 uppercase">Model</label>
          <input
            value={value.model ?? ""}
            onChange={(e) => onChange({ ...value, model: e.target.value || undefined })}
            placeholder="e.g. gpt-4"
            disabled={loading}
            className="border-2 border-black bg-white px-2 py-1.5 font-mono text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none disabled:opacity-50 dark:bg-black dark:text-white dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] font-bold text-gray-400 uppercase">User ID</label>
        <select
          value={value.userId ?? ""}
          onChange={(e) => onChange({ ...value, userId: e.target.value || undefined })}
          disabled={loading}
          className="border-2 border-black bg-white px-2 py-1.5 font-mono text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none disabled:opacity-50 dark:bg-black dark:text-white dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
          <option value="">All Users</option>
          <option value="__any__">With User ID</option>
        </select>
      </div>
    </div>
  )
}
