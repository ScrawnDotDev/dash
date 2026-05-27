import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function BeforeAfter() {
  const [showScrawn, setShowScrawn] = useState(false)

  return (
    <section className="border-b border-black bg-white py-24 dark:border-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12">
          <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter text-black md:text-7xl dark:text-white">
            The Scrawn Way
          </h2>
          <p className="mt-4 text-lg font-bold text-gray-500">
            See the difference. Same endpoint. One is 40 lines of pain. The other
            is Scrawn.
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowScrawn(false)}
            className={`border-2 border-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all dark:border-white ${
              !showScrawn
                ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                : "bg-white text-black hover:bg-yellow-400 dark:bg-black dark:text-white dark:hover:bg-yellow-400 dark:hover:text-black"
            }`}
          >
            Without Scrawn
          </button>
          <button
            onClick={() => setShowScrawn(true)}
            className={`border-2 border-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all dark:border-white ${
              showScrawn
                ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                : "bg-white text-black hover:bg-yellow-400 dark:bg-black dark:text-white dark:hover:bg-yellow-400 dark:hover:text-black"
            }`}
          >
            With Scrawn
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showScrawn ? (
            <motion.div
              key="without"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="border-2 border-black bg-[#f4f4f4] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:text-white dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
            >
              <div className="border-b-2 border-black bg-red-500 px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest text-black dark:border-white">
                Without Scrawn (40 lines of pain)
              </div>
              <pre className="overflow-x-auto p-6 font-mono text-sm font-bold sm:text-base">
                <span className="opacity-50">
                  {"// 1. Check Dodo sub"}
                </span>
                <br />
                <span>
                  const customer = await dodo.customers.retrieve(user.dodoId);
                </span>
                <br />
                <br />
                <span className="opacity-50">
                  {"// 2. Count usage manually"}
                </span>
                <br />
                <span>const usage = await db.query({"{"}{"}"});</span>
                <br />
                <br />
                <span className="opacity-50">
                  {"// 3. Calculate price yourself"}
                </span>
                <br />
                <span>const price = usage * 0.05;</span>
                <br />
                <br />
                <span className="opacity-50">
                  {"// 4. Create Dodo checkout"}
                </span>
                <br />
                <span>const checkout = await dodo.checkouts.create({"{"}{"}"});</span>
                <br />
                <br />
                <span className="opacity-50">
                  {"// 5. Handle webhook response..."}
                </span>
                <br />
                <span>...</span>
                <br />
                <span>...</span>
                <br />
                <span>...</span>
                <br />
                <span className="text-red-500">
                  {"// → 40 lines and you're still not done"}
                </span>
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="with"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="border-2 border-black bg-yellow-400 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white"
            >
              <div className="border-b-2 border-black bg-black px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest text-white dark:border-white">
                With Scrawn (2 lines)
              </div>
              <pre className="overflow-x-auto p-6 font-mono text-sm font-bold sm:text-base">
                <span>
                  import {"{"} Scrawn {"}"} from "@scrawn/core";
                </span>
                <br />
                <span>
                  const scrawn = new Scrawn({"{"} apiKey: env.SCRAWN_KEY {"}"});
                </span>
                <br />
                <br />
                <span>export async function POST(req) {"{"}</span>
                <br />
                <span className="ml-2 opacity-60">
                  {"// We handle limits, metering & checkout"}
                </span>
                <br />
                <span className="ml-2">await scrawn.basicUsageEventConsumer({"{"}</span>
                <br />
                <span className="ml-4">userId: req.user.id,</span>
                <br />
                <span className="ml-4">debitAmount: 50,</span>
                <br />
                <span className="ml-2">{"}"});</span>
                <br />
                <br />
                <span className="ml-2">return Response.json(result);</span>
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
