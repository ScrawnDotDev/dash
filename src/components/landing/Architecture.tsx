import { motion } from "framer-motion"
import { IconServer, IconDatabase } from "@tabler/icons-react"

function Box({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string
  subtitle: string
  icon: any
}) {
  return (
    <motion.div
      whileHover={{ x: -4, y: -4, transition: { duration: 0.1 } }}
      className="relative border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]"
    >
      <div className="mb-4 flex items-center justify-between border-b-4 border-black pb-3 dark:border-white">
        <Icon className="h-8 w-8 text-black dark:text-white" />
        <div className="flex gap-1.5">
          <div className="h-3 w-3 border-2 border-black bg-gray-300 dark:border-white dark:bg-gray-600" />
          <div className="h-3 w-3 border-2 border-black bg-black dark:border-white dark:bg-white" />
        </div>
      </div>
      <h4 className="font-mono text-lg font-black tracking-widest text-black uppercase dark:text-white">
        {title}
      </h4>
      <p className="mt-2 font-mono text-[11px] font-bold tracking-widest text-gray-500 uppercase">
        {subtitle}
      </p>
    </motion.div>
  )
}

function FlowArrow() {
  return (
    <div className="hidden min-w-[64px] flex-1 shrink-0 items-center justify-center px-4 lg:flex">
      <div className="relative flex h-8 w-full items-center overflow-hidden border-y-4 border-black bg-yellow-400 dark:border-white">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 1.5, repeat: Infinity }}
          className="flex font-mono text-sm font-black tracking-[0.2em] whitespace-nowrap text-black"
        >
          {[...Array(15)].map((_, i) => (
            <span key={i} className="mx-2">
              //////
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export function Architecture() {
  return (
    <section className="relative overflow-hidden border-b-4 border-black bg-[#f4f4f5] py-24 dark:border-white dark:bg-[#111]">
      {/* Background Dots */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:32px_32px] opacity-10 dark:bg-[radial-gradient(#fff_2px,transparent_2px)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Floating Element */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.15}
          animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-12 z-30 hidden cursor-grab active:cursor-grabbing lg:block"
        >
          <div className="border-4 border-black bg-yellow-400 px-6 py-3 font-mono text-sm font-black tracking-widest text-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            // NO DATA LOSS
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-6xl leading-[0.85] font-black tracking-tighter text-black uppercase md:text-8xl lg:text-[7rem] dark:text-white">
            The Orchestration Layer.
          </h2>
          <p className="mt-6 font-mono text-base font-bold tracking-widest text-gray-500 uppercase">
            Scrawn wraps DodoPayments, meters usage across your stack, and pipes
            data into your DB.
          </p>
        </motion.div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT: SOURCES */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex w-full shrink-0 flex-col gap-6 lg:w-72"
          >
            <Box
              title="Web Backend"
              subtitle="Node [for now]"
              icon={IconServer}
            />
            <Box
              title="AI Backend"
              subtitle="Vercel AI SDK"
              icon={IconServer}
            />
          </motion.div>

          <FlowArrow />

          {/* CENTER: ENGINE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full shrink-0 lg:w-[420px] xl:w-[480px]"
          >
            <div className="group relative mx-auto w-full border-4 border-black bg-yellow-400 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]">
              {/* Engine Screws/Details */}
              <div className="absolute top-3 left-3 h-3 w-3 border-2 border-black bg-white dark:border-white" />
              <div className="absolute top-3 right-3 h-3 w-3 border-2 border-black bg-white dark:border-white" />
              <div className="absolute bottom-3 left-3 h-3 w-3 border-2 border-black bg-white dark:border-white" />
              <div className="absolute right-3 bottom-3 h-3 w-3 border-2 border-black bg-white dark:border-white" />

              <div className="mt-4 mb-6 flex items-center justify-center gap-3">
                <div className="h-4 w-4 animate-pulse border-2 border-black bg-red-500 dark:border-white" />
                <h3 className="text-center text-3xl font-black tracking-tighter text-black uppercase">
                  Scrawn Engine
                </h3>
              </div>

              <div className="relative border-4 border-black bg-white p-5 text-center dark:border-white dark:bg-black">
                <span className="block font-mono text-lg font-black tracking-widest text-black uppercase dark:text-white">
                  DodoPayments
                </span>
                <p className="mt-2 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  <span>CHECKOUT</span>
                  <span className="hidden h-1 w-1 border border-black bg-gray-400 sm:block" />
                  <span>INVOICING</span>
                  <span className="hidden h-1 w-1 border border-black bg-gray-400 sm:block" />
                  <span>TAX</span>
                </p>
              </div>
            </div>
          </motion.div>

          <FlowArrow />

          {/* RIGHT: DESTINATIONS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex w-full shrink-0 flex-col gap-6 lg:w-72"
          >
            <Box
              title="PostgreSQL"
              subtitle="Primary Data Store"
              icon={IconDatabase}
            />
            <div className="relative">
              <Box
                title="ClickHouse"
                subtitle="Fast Telemetry"
                icon={IconDatabase}
              />
              <div className="absolute top-1/2 -right-4 -left-4 -translate-y-1/2 rotate-[-5deg] border-y-4 border-black bg-yellow-400 py-1 text-center font-mono text-sm font-black tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                /// COMING SOON ///
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
