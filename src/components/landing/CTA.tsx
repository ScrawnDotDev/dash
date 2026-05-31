import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useNavigate } from "@tanstack/react-router"
import { IconBrandGithub, IconArrowRight } from "@tabler/icons-react"

export function CTA() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // The white box scrolls up slightly faster than the background
  const yBox = useTransform(scrollYProgress, [0, 1], [80, -80])
  // The background text scrolls down in the opposite direction
  const yBg = useTransform(scrollYProgress, [0, 1], [-200, 200])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden border-b-4 border-black bg-yellow-400 py-32 lg:py-48 dark:border-white"
    >
      {/* Massive Parallax Background Text */}
      <motion.div
        style={{ y: yBg }}
        className="pointer-events-none absolute inset-0 -top-[50%] flex flex-col items-center justify-center opacity-10 mix-blend-overlay"
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="font-mono text-[10rem] leading-[0.8] font-black tracking-tighter whitespace-nowrap text-black uppercase md:text-[15rem] lg:text-[20rem]"
          >
            SCRAWN SCRAWN SCRAWN SCRAWN
          </div>
        ))}
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          style={{ y: yBox }}
          className="relative border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:p-12 lg:p-20 dark:border-white dark:bg-black dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
        >
          {/* Decorative Screws */}
          <div className="absolute top-4 left-4 h-4 w-4 border-4 border-black bg-yellow-400 dark:border-white" />
          <div className="absolute top-4 right-4 h-4 w-4 border-4 border-black bg-yellow-400 dark:border-white" />
          <div className="absolute bottom-4 left-4 h-4 w-4 border-4 border-black bg-yellow-400 dark:border-white" />
          <div className="absolute right-4 bottom-4 h-4 w-4 border-4 border-black bg-yellow-400 dark:border-white" />

          {/* Draggable Sticker */}
          <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.15}
            className="absolute -top-8 -right-8 z-30 hidden cursor-grab active:cursor-grabbing lg:block"
            animate={{ rotate: [12, 16, 12], y: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="border-4 border-black bg-red-500 px-6 py-4 font-mono text-xl font-black tracking-widest text-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              // END THE PAIN
            </div>
          </motion.div>

          <div className="flex flex-col gap-12 pt-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-6xl leading-[0.85] font-black tracking-tighter text-black uppercase md:text-8xl lg:text-[7rem] dark:text-white">
                Stop building billing. <br />
                <span className="text-transparent [-webkit-text-stroke:2px_#000] lg:[-webkit-text-stroke:4px_#000] dark:[-webkit-text-stroke:2px_#fff] lg:dark:[-webkit-text-stroke:4px_#fff]">
                  Start building.
                </span>
              </h2>
              <p className="mt-8 font-mono text-lg font-bold tracking-widest text-gray-500 uppercase md:text-xl">
                Wrap your endpoints. We handle the metering, the pricing DSL,
                DodoPayments, and the invoicing. You handle the features that
                actually matter.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-6 sm:flex-row lg:flex-col">
              <button
                onClick={() => navigate({ to: "/sign-in" })}
                className="group flex items-center justify-center gap-4 border-4 border-black bg-black px-10 py-6 text-xl font-black tracking-widest text-white uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-white dark:text-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
              >
                Start Now
                <IconArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-2" />
              </button>
              <a
                href="https://github.com/ScrawnDotDev/scrawn"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-4 border-4 border-black bg-white px-10 py-6 text-xl font-black tracking-widest text-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-yellow-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:text-white dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-yellow-400 dark:hover:text-black dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
              >
                <IconBrandGithub className="h-8 w-8" /> View GitHub
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
