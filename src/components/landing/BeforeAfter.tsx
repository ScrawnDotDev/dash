import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconTerminal2 } from "@tabler/icons-react"

export function BeforeAfter() {
  const [showScrawn, setShowScrawn] = useState(false)

  return (
    <section className="relative overflow-hidden border-b-4 border-black bg-white py-32 dark:border-white dark:bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:32px_32px] opacity-10 dark:bg-[radial-gradient(#fff_2px,transparent_2px)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16">
          <h2 className="text-6xl font-black uppercase leading-[0.85] tracking-tighter text-black md:text-8xl lg:text-[7rem] dark:text-white">
            The Scrawn Way.
          </h2>
          <p className="mt-6 font-mono text-base font-bold uppercase tracking-widest text-gray-500">
            Same endpoint. One is 40 lines of pain. The other is Scrawn.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-12 flex flex-wrap gap-4">
          <button
            onClick={() => setShowScrawn(false)}
            className={`border-4 border-black px-8 py-4 font-mono text-lg font-black uppercase tracking-widest transition-all dark:border-white ${
              !showScrawn
                ? "translate-y-[4px] translate-x-[4px] bg-black text-white shadow-none dark:bg-white dark:text-black"
                : "bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:bg-yellow-400 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:bg-black dark:text-white dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-yellow-400 dark:hover:text-black dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]"
            }`}
          >
            Without Scrawn
          </button>
          <button
            onClick={() => setShowScrawn(true)}
            className={`border-4 border-black px-8 py-4 font-mono text-lg font-black uppercase tracking-widest transition-all dark:border-white ${
              showScrawn
                ? "translate-y-[4px] translate-x-[4px] bg-black text-white shadow-none dark:bg-white dark:text-black"
                : "bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:bg-yellow-400 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:bg-black dark:text-white dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-yellow-400 dark:hover:text-black dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]"
            }`}
          >
            With Scrawn
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showScrawn ? (
            <motion.div
              key="without"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative flex w-full flex-col border-4 border-black bg-[#f4f4f4] text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:text-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
            >
              <div className="flex items-center justify-between border-b-4 border-black bg-red-500 px-4 py-3 dark:border-white">
                <div className="flex gap-2">
                  <div className="h-4 w-4 border-2 border-black bg-white" />
                  <div className="h-4 w-4 border-2 border-black bg-black" />
                </div>
                <span className="font-mono text-xs font-black uppercase tracking-widest text-black">
                  40_lines_of_pain.ts
                </span>
                <IconTerminal2 className="h-6 w-6 text-black" />
              </div>
              <pre className="overflow-x-auto p-8 font-mono text-[15px] font-bold leading-relaxed sm:text-lg">
                <span className="text-gray-500 dark:text-gray-400">
                  {"// 1. Check Dodo sub"}
                </span>
                <br />
                <span>
                  <span className="text-purple-600 dark:text-purple-400">const</span> customer = <span className="text-purple-600 dark:text-purple-400">await</span> <span className="text-blue-600 dark:text-blue-400">dodo</span>.customers.<span className="text-yellow-600 dark:text-yellow-400">retrieve</span>(user.dodoId);
                </span>
                <br />
                <br />
                <span className="text-gray-500 dark:text-gray-400">
                  {"// 2. Count usage manually"}
                </span>
                <br />
                <span><span className="text-purple-600 dark:text-purple-400">const</span> usage = <span className="text-purple-600 dark:text-purple-400">await</span> <span className="text-blue-600 dark:text-blue-400">db</span>.<span className="text-yellow-600 dark:text-yellow-400">query</span>({"{"}{"}"});</span>
                <br />
                <br />
                <span className="text-gray-500 dark:text-gray-400">
                  {"// 3. Calculate price yourself"}
                </span>
                <br />
                <span><span className="text-purple-600 dark:text-purple-400">const</span> price = usage * <span className="text-orange-600 dark:text-orange-400">0.05</span>;</span>
                <br />
                <br />
                <span className="text-gray-500 dark:text-gray-400">
                  {"// 4. Create Dodo checkout"}
                </span>
                <br />
                <span><span className="text-purple-600 dark:text-purple-400">const</span> checkout = <span className="text-purple-600 dark:text-purple-400">await</span> <span className="text-blue-600 dark:text-blue-400">dodo</span>.checkouts.<span className="text-yellow-600 dark:text-yellow-400">create</span>({"{"}{"}"});</span>
                <br />
                <br />
                <span className="text-gray-500 dark:text-gray-400">
                  {"// 5. Handle webhook response..."}
                </span>
                <br />
                <span>...</span>
                <br />
                <span>...</span>
                <br />
                <br />
                <span className="bg-red-500 px-2 py-1 text-black">
                  {"// → 40 lines and you're still not done"}
                </span>
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="with"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative flex w-full flex-col border-4 border-black bg-white text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:text-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
            >
              <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3 dark:border-white">
                <div className="flex gap-2">
                  <div className="h-4 w-4 border-2 border-black bg-white" />
                  <div className="h-4 w-4 border-2 border-black bg-black" />
                </div>
                <span className="font-mono text-xs font-black uppercase tracking-widest text-black">
                  scrawn_way.ts
                </span>
                <IconTerminal2 className="h-6 w-6 text-black" />
              </div>
              <pre className="overflow-x-auto p-8 font-mono text-[15px] font-bold leading-relaxed sm:text-lg">
                <span>
                  <span className="text-purple-600 dark:text-purple-400">import</span> {"{"} Scrawn {"}"} <span className="text-purple-600 dark:text-purple-400">from</span> <span className="text-green-600 dark:text-green-400">"@scrawn/core"</span>;
                </span>
                <br />
                <span>
                  <span className="text-purple-600 dark:text-purple-400">const</span> scrawn = <span className="text-purple-600 dark:text-purple-400">new</span> <span className="text-yellow-600 dark:text-yellow-400">Scrawn</span>({"{"} apiKey: env.SCRAWN_KEY {"}"});
                </span>
                <br />
                <br />
                <span><span className="text-purple-600 dark:text-purple-400">export async function</span> <span className="text-yellow-600 dark:text-yellow-400">POST</span>(req) {"{"}</span>
                <br />
                <span className="ml-4 text-gray-500 dark:text-gray-400">
                  {"// We handle limits, metering & checkout"}
                </span>
                <br />
                <span className="ml-4"><span className="text-purple-600 dark:text-purple-400">await</span> <span className="text-blue-600 dark:text-blue-400">scrawn</span>.<span className="text-yellow-600 dark:text-yellow-400">basicUsageEventConsumer</span>({"{"}</span>
                <br />
                <span className="ml-8">userId: req.user.id,</span>
                <br />
                <span className="ml-8">debitAmount: <span className="text-orange-600 dark:text-orange-400">50</span>,</span>
                <br />
                <span className="ml-4">{"}"});</span>
                <br />
                <br />
                <span className="ml-4"><span className="text-purple-600 dark:text-purple-400">return</span> Response.<span className="text-yellow-600 dark:text-yellow-400">json</span>(result);</span>
                <br />
                <span>{"}"}</span>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
