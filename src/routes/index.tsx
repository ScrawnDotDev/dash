import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { IconBrandGithub } from "@tabler/icons-react"
import { Hero } from "@/components/landing/Hero"
import { ThemeToggle } from "@/components/ThemeToggle"

import { PainPoint } from "@/components/landing/PainPoint"
import { FeatureTabs } from "@/components/landing/FeatureTabs"

import { Architecture } from "@/components/landing/Architecture"
import { BeforeAfter } from "@/components/landing/BeforeAfter"
import { FAQ } from "@/components/landing/FAQ"
import { CTA } from "@/components/landing/CTA"

export const Route = createFileRoute("/")({ component: Landing })

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-white font-sans text-black selection:bg-yellow-400 selection:text-black dark:bg-black dark:text-white dark:selection:bg-yellow-400 dark:selection:text-black">
      {/* NAVBAR */}
      <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-black bg-white px-6 md:px-12 dark:border-white dark:bg-black">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex cursor-pointer items-center gap-3"
        >
          <img
            src="/Scrawn_Logo.png"
            alt="Scrawn Logo"
            className="h-7 w-7 object-contain"
          />
          <span className="text-xl font-bold tracking-tighter uppercase">
            Scrawn
          </span>
        </button>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 text-sm font-bold uppercase tracking-tight md:flex">
            <a href="#" className="hover:text-yellow-500">
              Docs
            </a>
            <a href="#" className="hover:text-yellow-500">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4 border-l border-black pl-6 dark:border-white">
            <ThemeToggle />
            <a
              href="https://github.com/ScrawnDotDev/scrawn"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 text-sm font-bold uppercase hover:text-yellow-500 sm:flex"
            >
              <IconBrandGithub className="h-5 w-5" />
              <span>1.2k</span>
            </a>
            <button
              onClick={() => navigate({ to: "/sign-in" })}
              className="border border-black bg-black px-6 py-2 text-sm font-bold text-white uppercase tracking-tight transition-colors hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <Hero />
        <PainPoint />
        <Architecture />
        <FeatureTabs />
        <BeforeAfter />
        <FAQ />
        <CTA />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-black bg-white py-8 px-6 md:px-12 dark:border-white dark:bg-black">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-2xl font-black tracking-tighter uppercase">
            Scrawn
          </span>
          <p className="font-mono text-xs uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Scrawn. Open source and
            unapologetic.
          </p>
        </div>
      </footer>
    </div>
  )
}
