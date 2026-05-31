interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: number[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="border-2 border-black px-2 py-1 font-mono text-xs font-bold text-black transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
      >
        PREV
      </button>
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="border-2 border-black px-2 py-1 font-mono text-xs font-bold text-black transition-all hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            1
          </button>
          {start > 2 && <span className="px-1 font-mono text-xs text-gray-400">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`border-2 border-black px-2 py-1 font-mono text-xs font-bold transition-all dark:border-white ${
            p === currentPage
              ? "bg-yellow-400 text-black dark:bg-yellow-500 dark:text-black"
              : "text-black hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black"
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 font-mono text-xs text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="border-2 border-black px-2 py-1 font-mono text-xs font-bold text-black transition-all hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="border-2 border-black px-2 py-1 font-mono text-xs font-bold text-black transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
      >
        NEXT
      </button>
    </div>
  )
}
