import { motion } from "framer-motion"
import { useNavigate } from "@tanstack/react-router"
import { IconBrandGithub } from "@tabler/icons-react"

export function CTA() {
  const navigate = useNavigate()

  return (
    <section className="bg-yellow-400 py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <h2 className="text-6xl font-black uppercase leading-[0.9] tracking-tighter text-black md:text-8xl">
            Stop building billing.{" "}
            <span className="text-transparent [-webkit-text-stroke:2px_#000]">
              Start building.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-xl font-bold uppercase tracking-tight text-black sm:text-2xl">
            Wrap your endpoints. We handle the metering, the pricing DSL, DodoPayments, and the invoicing. You handle the features that actually matter.
          </p>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate({ to: "/sign-in" })}
              className="border-4 border-black bg-black px-10 py-5 text-xl font-black uppercase tracking-widest text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white"
            >
              Start Building
            </button>
            <a
              href="https://github.com/ScrawnDotDev/scrawn"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 border-4 border-black bg-white px-10 py-5 text-xl font-black uppercase tracking-widest text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <IconBrandGithub className="h-6 w-6" /> GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
