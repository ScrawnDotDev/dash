import { motion } from "framer-motion"

function Box({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
      <h4 className="font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-white">
        {title}
      </h4>
      <p className="mt-1 font-mono text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center md:flex">
      <div className="font-mono text-2xl font-black text-black dark:text-white">
        →
      </div>
    </div>
  )
}

export function Architecture() {
  return (
    <section className="border-b border-black bg-[#f4f4f4] py-24 dark:border-white dark:bg-[#111]">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-black md:text-6xl dark:text-white">
            The Orchestration Layer
          </h2>
          <p className="mt-4 max-w-xl text-lg font-bold uppercase tracking-tight text-gray-500">
            Scrawn wraps DodoPayments, meters usage across your stack, and pipes
            data into your DB.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex w-full flex-col gap-4 md:w-64"
          >
            <Box title="Web Backend" subtitle="Node, Go, Python" />
            <Box title="AI Backend" subtitle="Vercel AI SDK" />
          </motion.div>

          <Arrow />

          {/* CENTER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full md:flex-1"
          >
            <div className="border-4 border-black bg-yellow-400 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white">
              <h3 className="text-center text-3xl font-black uppercase tracking-tighter text-black">
                Scrawn Engine
              </h3>
              <div className="mt-6 border-2 border-black bg-white p-4 text-center dark:border-white dark:bg-black">
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-white">
                  DodoPayments
                </span>
                <p className="mt-1 font-mono text-xs text-gray-500">
                  Checkout · Invoicing · Tax
                </p>
              </div>
            </div>
          </motion.div>

          <Arrow />

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex w-full flex-col gap-4 md:w-64"
          >
            <Box title="PostgreSQL" subtitle="Primary data store" />
            <Box title="ClickHouse" subtitle="Fast telemetry" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
