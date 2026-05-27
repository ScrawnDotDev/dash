import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const faqs = [
  {
    q: "Is this another Stripe wannabe?",
    a: "We don't do Stripe. We're DodoPayments native. Think of us as the middleware that makes Dodo actually work for usage billing. We count the usage, resolve prices, and hand Dodo a checkout URL. They handle tax, invoicing, and PCI compliance.",
  },
  {
    q: "Do I have to rewrite my entire backend?",
    a: "One SDK import. One gRPC call. If you can write `scrawn.basicUsageEventConsumer(...)`, you're done. No rip. No replace.",
  },
  {
    q: "How does AI token billing work?",
    a: "Wrap the Vercel AI SDK with `biller.ai(sdk, opts)`. Every `streamText`, `generateText`, `streamObject`, and `generateObject` call gets auto-billed on every step finish. Tokens are counted server-side, priced with your tags/expressions, and streamed to the backend in the background. Your users never see a lag.",
  },
  {
    q: "What if my startup fails?",
    a: "Then you won't need billing. But hey, at least Scrawn wasn't the problem.",
  },
  {
    q: "Is there a free tier?",
    a: "It's open source. Self-host it. Free as in freedom. And free as in 'no monthly bill.' We provide docker-compose setups to get you running in minutes. The CLI runs `scrawn init` and you're live.",
  },
  {
    q: "Can I use ClickHouse instead of Postgres?",
    a: "Yes. Flip `STORAGE_ADAPTER` to `clickhouse` in your config. The factory pattern handles the rest. Postgres for simplicity, ClickHouse for scale.",
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="border-b border-black bg-white py-24 dark:border-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter text-black md:text-6xl dark:text-white">
            Questions you're <br className="hidden md:block" />
            <span className="text-transparent [-webkit-text-stroke:2px_#000] dark:[-webkit-text-stroke:2px_#fff]">
              too embarrassed
            </span>{" "}
            to ask
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="border-2 border-black bg-white transition-all dark:border-white dark:bg-black"
                style={{
                  boxShadow: isOpen ? "8px 8px 0px 0px rgba(0,0,0,1)" : "4px 4px 0px 0px rgba(0,0,0,1)"
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-bold uppercase tracking-tight text-black dark:text-white">
                    {faq.q}
                  </span>
                  <span className="font-mono text-xl font-bold text-black dark:text-white">
                    {isOpen ? "-" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t-2 border-black p-6 font-mono text-sm font-bold text-gray-500 dark:border-white">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
