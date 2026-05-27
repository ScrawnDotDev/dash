import { motion } from "framer-motion"
import { useNavigate } from "@tanstack/react-router"

export function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative w-full border-b border-black dark:border-white">
      {/* Brutalist Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#00000015_2px,transparent_2px),linear-gradient(to_bottom,#00000015_2px,transparent_2px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,#ffffff15_2px,transparent_2px),linear-gradient(to_bottom,#ffffff15_2px,transparent_2px)]" />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-6 py-20 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex w-fit items-center border-2 border-black bg-yellow-400 px-4 py-1 text-sm font-bold uppercase tracking-widest text-black dark:border-white">
            <span className="mr-2 h-2 w-2 animate-pulse bg-black" />
            DodoPayments Native
          </div>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.95] tracking-tighter sm:text-7xl md:text-9xl">
            Bill your <br className="hidden md:block" />
            <span className="text-transparent [-webkit-text-stroke:2px_#000] dark:[-webkit-text-stroke:2px_#fff]">
              self-rolled
            </span>{" "}
            <br className="hidden md:block" />
            abomination <br className="hidden md:block" />
            <span className="inline-block mt-4 bg-yellow-400 px-4 py-2 text-black">
              in one-ish line.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-xl font-medium tracking-tight uppercase sm:text-2xl md:text-3xl">
            Wrap DodoPayments. Track usage. Collect cash. One import. One call.
            You're billing.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate({ to: "/sign-in" })}
              className="group relative border-2 border-black bg-black px-8 py-4 text-lg font-bold uppercase tracking-tight text-white transition-all hover:bg-yellow-400 hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-yellow-400"
            >
              Start Building
            </button>
            <a
              href="https://github.com/ScrawnDotDev/scrawn"
              target="_blank"
              rel="noreferrer"
              className="border-2 border-black bg-white px-8 py-4 text-lg font-bold uppercase tracking-tight text-black transition-all hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Read The Code
            </a>
          </div>
        </motion.div>

        {/* Brutalist Code Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mt-20 w-full max-w-4xl border-2 border-black bg-[#f4f4f4] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:text-white dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
        >
          <div className="border-b-2 border-black bg-yellow-400 px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest text-black dark:border-white">
            biller.ts
          </div>
          <div className="overflow-x-auto p-6 font-mono text-sm sm:text-base">
            <pre className="!m-0 !bg-transparent !p-0">
              <code className="grid gap-1 font-bold">
                <span className="opacity-50">
                  // ~1-ish line to bill anything
                </span>
                <span>
                  import {"{"} Scrawn {"}"} from "@scrawn/core";
                </span>
                <br />
                <span>
                  const s = new Scrawn({"{"} apiKey: env.SCRAWN_KEY {"}"});
                </span>
                <br />
                <span className="opacity-50">// Bill an API call</span>
                <span>await s.basicUsageEventConsumer({"{"}</span>
                <span> userId: "usr_123",</span>
                <span> debitAmount: 50</span>
                <span>{"}"});</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
