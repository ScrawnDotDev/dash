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
    <section className="border-b-4 border-black bg-white py-24 lg:py-32 dark:border-white dark:bg-black">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 lg:mb-24"
        >
          <h2 className="text-6xl leading-[0.85] font-black tracking-tighter text-black uppercase md:text-8xl lg:text-[7rem] dark:text-white">
            Questions you're <br className="hidden lg:block" />
            <span className="text-transparent [-webkit-text-stroke:2px_#000] lg:[-webkit-text-stroke:3px_#000] dark:[-webkit-text-stroke:2px_#fff] lg:dark:[-webkit-text-stroke:3px_#fff]">
              too embarrassed
            </span>
            <br className="hidden lg:block" />
            to ask.
          </h2>
        </motion.div>

        <div className="flex w-full flex-col gap-6">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="border-4 border-black bg-white transition-all dark:border-white dark:bg-black"
                style={{
                  boxShadow: isOpen
                    ? "12px 12px 0px 0px rgba(0,0,0,1)"
                    : "6px 6px 0px 0px rgba(0,0,0,1)",
                  transform: isOpen
                    ? "translate(-4px, -4px)"
                    : "translate(0px, 0px)",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left md:p-8"
                >
                  <span className="font-mono text-lg font-black tracking-widest text-black uppercase md:text-2xl dark:text-white">
                    {faq.q}
                  </span>
                  <span className="font-mono text-3xl font-black text-black md:text-4xl dark:text-white">
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
                      <div className="border-t-4 border-black p-6 font-mono text-base leading-relaxed font-bold text-gray-600 md:p-8 md:text-lg dark:border-white dark:text-gray-400">
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
