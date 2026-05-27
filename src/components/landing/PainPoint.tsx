import { motion } from "framer-motion"

export function PainPoint() {
  return (
    <section className="relative w-full border-b border-black bg-yellow-400 py-24 dark:border-white">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center border-2 border-black bg-black px-4 py-2 text-sm font-bold uppercase tracking-widest text-white dark:border-white dark:bg-white dark:text-black"
          >
            <span className="relative mr-3 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping bg-yellow-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 bg-yellow-500" />
            </span>
            The Missing Brain for DodoPayments
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2 md:gap-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black uppercase leading-[0.9] tracking-tighter text-black md:text-7xl lg:text-8xl"
            >
              Dodo gets the cash.{" "}
              <span className="text-transparent [-webkit-text-stroke:2px_#000]">
                We do the math.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <p className="text-xl font-bold uppercase tracking-tight text-black sm:text-2xl">
                Dodo is great at checkout. But it has absolutely no idea how many AI tokens your user generated, or that you charge exactly $0.0042 per GPU second.
              </p>
              <p className="mt-6 text-lg font-medium text-black">
                Instead of writing a brittle cron job to sync your database with Dodo, just fire events to Scrawn. We aggregate the usage, evaluate your weird pricing logic, and push the final tab directly to DodoPayments. 
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {["Usage Aggregation", "Math Engine", "Stateless", "Dodo Native"].map(
                (item) => (
                  <span
                    key={item}
                    className="border-2 border-black bg-white px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
