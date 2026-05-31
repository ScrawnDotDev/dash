import { motion } from "framer-motion"

export function Contact() {
  return (
    <section className="border-b-4 border-black bg-[#f4f4f4] py-24 dark:border-white dark:bg-[#111]">
      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex flex-col items-center"
        >
          <div className="mb-6 inline-block border-4 border-black bg-black px-4 py-2 font-mono text-sm font-black tracking-widest text-white uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-white dark:text-black dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
            STUCK?
          </div>
          <h2 className="mb-8 text-5xl leading-[0.85] font-black tracking-tighter text-black uppercase md:text-7xl lg:text-[6rem] dark:text-white">
            We reply fast. <br className="hidden sm:block" />
            <span className="text-gray-300 dark:text-gray-700">Usually.</span>
          </h2>

          <a
            href="mailto:hello@scrawn.dev"
            className="group relative inline-block border-4 border-black bg-yellow-400 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
          >
            <div className="absolute -top-4 -right-4 z-10 rotate-12 border-4 border-black bg-[#00ff00] px-4 py-2 font-mono text-xs font-black tracking-widest text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white">
              EMAIL US
            </div>
            <span className="font-mono text-2xl font-black tracking-tight text-black sm:text-4xl md:text-5xl lg:text-6xl">
              hello@scrawn.dev
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
