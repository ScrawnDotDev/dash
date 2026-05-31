import { motion } from "framer-motion"
import { useNavigate } from "@tanstack/react-router"
import { IconTerminal2, IconArrowDownRight } from "@tabler/icons-react"
import { useState } from "react"

export function Hero() {
  const navigate = useNavigate()
  const [dragText, setDragText] = useState("DRAG ME PLEASE...")
  const [isDraggingUsage, setIsDraggingUsage] = useState(false)
  const [isDraggingAngry, setIsDraggingAngry] = useState(false)

  return (
    <section className="relative w-full overflow-hidden border-b-2 border-black bg-white dark:border-white dark:bg-black">
      {/* Brutalist Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#00000015_2px,transparent_2px),linear-gradient(to_bottom,#00000015_2px,transparent_2px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,#ffffff15_2px,transparent_2px),linear-gradient(to_bottom,#ffffff15_2px,transparent_2px)]" />

      {/* Decorative Crosshairs */}
      <div className="absolute top-10 left-10 hidden font-mono text-xl font-bold text-gray-300 md:block dark:text-gray-700">
        +
      </div>
      <div className="absolute top-10 right-10 hidden font-mono text-xl font-bold text-gray-300 md:block dark:text-gray-700">
        +
      </div>
      <div className="absolute bottom-20 left-10 hidden font-mono text-xl font-bold text-gray-300 md:block dark:text-gray-700">
        +
      </div>
      <div className="absolute right-10 bottom-20 hidden font-mono text-xl font-bold text-gray-300 md:block dark:text-gray-700">
        +
      </div>

      {/* Floating Interactable Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute top-24 left-[40%] z-30 hidden lg:block"
      >
        <motion.div
          drag
          dragConstraints={{ left: -50, right: 200, top: -50, bottom: 200 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95, cursor: "grabbing" }}
          onDragStart={() => setDragText("THANKS!")}
          onDragEnd={() => setDragText("DRAG ME PLEASE...")}
          className="cursor-grab border-2 border-black bg-white px-3 py-1.5 font-mono text-sm font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse bg-red-500" />
            <span>{dragText}</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="absolute right-1/3 bottom-40 z-30 hidden lg:block"
      >
        <motion.div
          drag
          dragConstraints={{ left: -200, right: 50, top: -100, bottom: 100 }}
          animate={{ y: [0, -10, 0], rotate: [0, -2, 2, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, cursor: "grabbing" }}
          className="cursor-grab border-4 border-black bg-[#ff00ff] px-4 py-2 font-mono text-lg font-black text-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-white"
        >
          NO DB MIGRATIONS
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="absolute top-1/3 right-12 z-20 hidden xl:block"
      >
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.15}
          onDragStart={() => setIsDraggingAngry(true)}
          onDragEnd={() => setIsDraggingAngry(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, cursor: "grabbing" }}
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          }}
          className="flex cursor-grab flex-col items-center border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black"
        >
          <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-yellow-400 font-mono text-lg font-bold text-black">
            *
          </div>
          <span className="mt-2 font-mono text-[10px] font-black tracking-widest text-black dark:text-white">
            {isDraggingAngry ? "HOLD ON TIGHTER" : "STATUS: ANGRY"}
          </span>
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-[1400px] flex-col items-center justify-between pt-16 pb-12 lg:flex-row lg:items-center">
        {/* Left Column: Typographic Poster */}
        <div className="flex w-full flex-col items-start px-6 lg:w-[55%] lg:px-12">
          <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragStart={() => setIsDraggingUsage(true)}
            onDragEnd={() => setIsDraggingUsage(false)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileDrag={{ cursor: "grabbing" }}
            className="relative mb-8 w-max cursor-grab border-2 border-black bg-white px-3 py-1 font-mono text-xs font-black tracking-widest text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            // USAGE METERING
            <motion.span
              initial={false}
              animate={{
                opacity: isDraggingUsage ? 1 : 0,
                y: isDraggingUsage ? -20 : 0,
              }}
              className="pointer-events-none absolute -top-2 left-1/2 z-50 -translate-x-1/2 font-mono text-xs font-black whitespace-nowrap text-red-600 lowercase dark:text-red-500"
            >
              not me!!
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-left text-7xl leading-[0.85] font-black tracking-tighter text-black uppercase sm:text-[6rem] md:text-[7rem] lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] dark:text-white"
          >
            BILL <br />
            YOUR <br />
            SELF- <br />
            ROLLED <br />
            ABOMINATION.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="mt-6 w-max border-4 border-black bg-yellow-400 px-4 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:-ml-2 lg:px-6 dark:border-white"
          >
            <span className="text-3xl font-black tracking-tighter text-black uppercase sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl">
              IN ONE-ISH LINE.
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex w-full max-w-md flex-col gap-4 sm:flex-row lg:mt-16"
          >
            <button
              onClick={() => navigate({ to: "/sign-in" })}
              className="flex flex-1 items-center justify-between border-2 border-black bg-black px-6 py-4 font-mono text-base font-bold tracking-widest text-white uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-white dark:text-black"
            >
              <span>Try now for free</span>
              <IconArrowDownRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: The Code Window */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mt-16 flex w-full justify-center px-6 lg:mt-0 lg:w-[45%] lg:justify-end lg:px-12"
        >
          {/* Decorative background box to make it look messy/stacked */}
          <div className="absolute top-6 -right-2 bottom-6 left-8 hidden border-2 border-black bg-gray-200 lg:block xl:top-8 xl:-right-4 xl:bottom-8 xl:left-12 dark:border-white dark:bg-gray-800" />

          <div className="relative w-full max-w-md border-4 border-black bg-white text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] xl:max-w-lg xl:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] dark:xl:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3 dark:border-white">
              <div className="flex gap-2">
                <div className="h-4 w-4 border-2 border-black bg-white" />
                <div className="h-4 w-4 border-2 border-black bg-black" />
              </div>
              <span className="font-mono text-xs font-black tracking-widest text-black uppercase">
                billing.ts
              </span>
              <IconTerminal2 className="h-6 w-6 text-black" />
            </div>

            <div className="p-6 font-mono text-[15px] leading-relaxed font-bold sm:text-lg">
              <div className="text-gray-500 dark:text-gray-400">
                {"// No webhook nightmares."}
              </div>
              <div className="mb-4 text-gray-500 dark:text-gray-400">
                {"// Just log usage & get paid."}
              </div>

              <div>
                <span className="text-purple-600 dark:text-purple-400">
                  import
                </span>{" "}
                {"{"} <span className="text-black dark:text-white">Scrawn</span>{" "}
                {"}"}{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  from
                </span>{" "}
                <span className="text-green-600 dark:text-green-400">
                  "@scrawn/core"
                </span>
                ;
              </div>
              <div className="mt-4">
                <span className="text-purple-600 dark:text-purple-400">
                  const
                </span>{" "}
                <span className="text-blue-600 dark:text-blue-400">scrawn</span>{" "}
                ={" "}
                <span className="text-purple-600 dark:text-purple-400">
                  new
                </span>{" "}
                <span className="text-yellow-600 dark:text-yellow-400">
                  Scrawn
                </span>
                ({"{"}
              </div>
              <div className="pl-4">
                apiKey:{" "}
                <span className="text-black dark:text-white">env.DODO_KEY</span>
              </div>
              <div>{"}"});</div>

              <div className="mt-4">
                <span className="text-purple-600 dark:text-purple-400">
                  await
                </span>{" "}
                <span className="text-blue-600 dark:text-blue-400">scrawn</span>
                .
                <span className="text-yellow-600 dark:text-yellow-400">
                  bill
                </span>
                ({"{"}
              </div>
              <div className="pl-4">
                customer:{" "}
                <span className="text-green-600 dark:text-green-400">
                  "cus_123"
                </span>
                ,
              </div>
              <div className="pl-4">
                tokens_used:{" "}
                <span className="text-orange-600 dark:text-orange-400">
                  4500
                </span>
              </div>
              <div>{"}"});</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Running ticker at bottom */}
      <div className="flex overflow-hidden border-t-2 border-black bg-yellow-400 py-3 dark:border-white">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          className="flex font-mono text-sm font-black tracking-widest whitespace-nowrap text-black uppercase"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-4">
              STOP WRITING BILLING LOGIC{" "}
              <span className="mx-4 opacity-30">///</span> NO WEBHOOKS{" "}
              <span className="mx-4 opacity-30">///</span> FIRE AND FORGET{" "}
              <span className="mx-4 opacity-30">///</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
