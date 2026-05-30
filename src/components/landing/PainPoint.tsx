import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function PainPoint() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Parallax transforms
  const yText = useTransform(scrollYProgress, [0, 1], [-100, 100])
  const yBox = useTransform(scrollYProgress, [0, 1], [100, -100])
  const rotateSticker = useTransform(scrollYProgress, [0, 1], [-5, 15])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-b-4 border-black bg-yellow-400 py-32 lg:py-48 dark:border-white"
    >
      {/* Background Math Parallax */}
      <motion.div
        style={{ y: yText }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 mix-blend-overlay"
      >
        <div className="flex w-[150%] flex-wrap gap-12 font-mono text-[10rem] leading-none font-black text-black">
          {
            "% * + - = $ % * + - = $ % * + - = $ % * + - = $ % * + - = $ % * + - = $"
          }
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12 inline-flex items-center border-4 border-black bg-black px-6 py-3 font-mono text-sm font-black tracking-widest text-white uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-white dark:text-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
        >
          <span className="relative mr-4 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping bg-yellow-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 border-2 border-black bg-yellow-400 dark:border-white" />
          </span>
          The Missing Aggregator for DodoPayments
        </motion.div>

        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-7">
            <p className="mb-4 font-mono text-sm font-black tracking-[0.2em] text-black/60 uppercase dark:text-white/60">
              Mandatory cringe tagline on a landing page
            </p>
            <h2 className="text-6xl leading-[0.85] font-black tracking-tighter text-black uppercase md:text-8xl lg:text-[7rem] dark:text-white">
              Dodo gets the cash. <br />
              <span className="text-transparent [-webkit-text-stroke:2px_#000] lg:[-webkit-text-stroke:4px_#000] dark:[-webkit-text-stroke:2px_#fff] lg:dark:[-webkit-text-stroke:4px_#fff]">
                We do the math.
              </span>
            </h2>
          </div>

          <motion.div
            style={{ y: yBox }}
            className="relative flex flex-col justify-center border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] lg:col-span-5 lg:p-10 dark:border-white dark:bg-black dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
          >
            {/* Animated Sticker */}
            <motion.div
              style={{ rotate: rotateSticker }}
              className="absolute -top-6 -right-6 z-20 border-4 border-black bg-[#00ff00] px-4 py-2 font-mono text-sm font-black tracking-widest text-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              // NO CRON JOBS
            </motion.div>

            <p className="font-mono text-lg font-bold tracking-widest text-black uppercase md:text-xl dark:text-white">
              Dodo is great at checkout. Too bad you can't make the user pay for
              each and every request they send. <br />
              At least not monetarily.😏
            </p>
            <p className="mt-8 border-l-4 border-yellow-400 pl-4 font-mono text-base font-bold text-gray-600 dark:text-gray-400">
              Instead of writing a brittle cron job to sync your database with
              Dodo, just fire events to Scrawn. We aggregate the usage, evaluate
              your weird pricing logic, and serve the final payment link on a
              silver platter for you.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              {[
                "Usage Aggregation",
                "Math Engine",
                "Stateless",
                "Dodo Native",
              ].map((item) => (
                <span
                  key={item}
                  className="border-4 border-black bg-yellow-400 px-4 py-2 font-mono text-sm font-black tracking-widest text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
