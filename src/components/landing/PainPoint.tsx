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
            <span className="absolute inline-flex h-full w-full animate-ping bg-red-500 opacity-75" />
            <span className="relative inline-flex h-3 w-3 bg-red-500" />
          </span>
          Fatal Error: Stripe Webhook Failed (Again)
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black uppercase leading-[0.9] tracking-tighter text-black md:text-7xl lg:text-8xl"
          >
            You didn't learn to code to write{" "}
            <span className="text-transparent [-webkit-text-stroke:2px_#000]">
              billing logic.
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
              Yet here you are. Debugging webhooks at 2 AM. Counting AI tokens by
              hand. Building your fifth metering integration.
            </p>
            <p className="mt-6 text-lg font-medium text-black">
              Scrawn sits exactly between your code and DodoPayments. We intercept
              the usage, apply your pricing rules, and spit out checkout URLs.
              You go back to shipping features.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {["API Metering", "Token Counting", "Pricing DSL", "Checkout URLs"].map(
                (item) => (
                  <span
                    key={item}
                    className="border-2 border-black bg-white px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
