import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse border-2 border-black bg-yellow-400 dark:border-white dark:bg-yellow-500",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
