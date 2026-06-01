import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse border-2 border-black bg-neutral-100 dark:bg-neutral-900 dark:border-white relative overflow-hidden after:absolute after:inset-0 after:bg-[repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(0,0,0,0.05)_8px,rgba(0,0,0,0.05)_16px)] dark:after:bg-[repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(255,255,255,0.05)_8px,rgba(255,255,255,0.05)_16px)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
