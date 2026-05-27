import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconTerminal2 } from "@tabler/icons-react"

const tabs = [
  { id: "ai", label: "AI Tokens" },
  { id: "basic", label: "Basic Events" },
  { id: "dsl", label: "Pricing DSL" },
  { id: "middleware", label: "Middleware" },
]

function BasicUsageDemo() {
  const [amount, setAmount] = useState(50)
  const dollars = (amount / 100).toFixed(2)

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h3 className="text-4xl leading-none font-black tracking-tighter text-black uppercase md:text-5xl dark:text-white">
            Track anything in one call.
          </h3>
          <p className="mt-4 font-mono text-base font-bold tracking-widest text-gray-500 uppercase">
            API calls, DB writes, image generations. <br /> Fire and forget.
          </p>
        </div>
        <div className="relative mt-4 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="absolute -top-3 left-6 border-2 border-black bg-yellow-400 px-2 font-mono text-[10px] font-black tracking-widest text-black uppercase">
            INTERACTIVE
          </div>
          <label className="mb-4 flex items-center justify-between font-mono text-sm font-black tracking-widest text-black uppercase dark:text-white">
            <span>Debit Amount</span>
            <span className="bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
              {amount}¢
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-6 w-full cursor-pointer appearance-none border-2 border-black bg-gray-200 accent-black dark:border-white dark:bg-gray-800 dark:accent-white"
          />
          <div className="mt-8 border-t-4 border-black pt-6 dark:border-white">
            <span className="font-mono text-xs font-black tracking-widest text-gray-500 uppercase">
              USER GETS BILLED
            </span>
            <span className="mt-2 block text-6xl font-black tracking-tighter text-black dark:text-white">
              ${dollars}
            </span>
          </div>
        </div>
      </div>

      {/* Code Window */}
      <motion.div
        initial={{ rotate: 1.5 }}
        animate={{ y: [-6, 6, -6], rotate: [1.5, 2.5, 1.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex w-full flex-col border-4 border-black bg-white text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:text-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
      >
        <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3 dark:border-white">
          <div className="flex gap-2">
            <div className="h-4 w-4 border-2 border-black bg-white" />
            <div className="h-4 w-4 border-2 border-black bg-black" />
          </div>
          <span className="font-mono text-xs font-black tracking-widest text-black uppercase">
            basic-usage.ts
          </span>
          <IconTerminal2 className="h-6 w-6 text-black" />
        </div>

        <div className="flex flex-col p-6 font-mono text-[15px] leading-relaxed font-bold sm:text-lg">
          <div className="text-gray-500 dark:text-gray-400">
            {"// Track usage and bill immediately"}
          </div>
          <div className="mt-4">
            <span className="text-purple-600 dark:text-purple-400">await</span>{" "}
            <span className="text-blue-600 dark:text-blue-400">scrawn</span>.
            <span className="text-yellow-600 dark:text-yellow-400">
              basicUsageEventConsumer
            </span>
            ({"{"}
          </div>
          <div className="pl-4">
            userId:{" "}
            <span className="text-green-600 dark:text-green-400">
              "usr_123"
            </span>
            ,
          </div>
          <div className="pl-4">
            debitAmount:{" "}
            <span className="text-orange-600 dark:text-orange-400">
              {amount}
            </span>
            ,
          </div>
          <div>{"}"});</div>
        </div>
      </motion.div>
    </div>
  )
}

function AITokenDemo() {
  const [inputTokens, setInputTokens] = useState(1000)
  const [outputTokens, setOutputTokens] = useState(1000)

  const total = ((inputTokens * 0.003 + outputTokens * 0.015) / 1000).toFixed(4)

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h3 className="text-4xl leading-none font-black tracking-tighter text-black uppercase md:text-5xl dark:text-white">
            Wrap Vercel AI SDK.
          </h3>
          <p className="mt-4 font-mono text-base font-bold tracking-widest text-gray-500 uppercase">
            Auto-bills tokens on every step finish. <br /> Zero extra code.
          </p>
        </div>
        <div className="relative mt-4 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="absolute -top-3 left-6 border-2 border-black bg-yellow-400 px-2 font-mono text-[10px] font-black tracking-widest text-black uppercase">
            INTERACTIVE
          </div>
          <label className="mb-4 flex items-center justify-between font-mono text-sm font-black tracking-widest text-black uppercase dark:text-white">
            <span>Input Tokens</span>
            <span className="bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
              {inputTokens}
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={1000000}
            step={1000}
            value={inputTokens}
            onChange={(e) => setInputTokens(Number(e.target.value))}
            className="mb-8 h-6 w-full cursor-pointer appearance-none border-2 border-black bg-gray-200 accent-black dark:border-white dark:bg-gray-800 dark:accent-white"
          />
          <label className="mb-4 flex items-center justify-between font-mono text-sm font-black tracking-widest text-black uppercase dark:text-white">
            <span>Output Tokens</span>
            <span className="bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
              {outputTokens}
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={1000000}
            step={1000}
            value={outputTokens}
            onChange={(e) => setOutputTokens(Number(e.target.value))}
            className="h-6 w-full cursor-pointer appearance-none border-2 border-black bg-gray-200 accent-black dark:border-white dark:bg-gray-800 dark:accent-white"
          />
          <div className="mt-8 border-t-4 border-black pt-6 dark:border-white">
            <span className="font-mono text-xs font-black tracking-widest text-gray-500 uppercase">
              TOTAL COST
            </span>
            <span className="mt-2 block text-6xl font-black tracking-tighter text-black dark:text-white">
              ${total}
            </span>
          </div>
        </div>
      </div>

      {/* Code Window */}
      <motion.div
        initial={{ rotate: 1.5 }}
        animate={{ y: [-6, 6, -6], rotate: [1.5, 2.5, 1.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex w-full flex-col border-4 border-black bg-white text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:text-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
      >
        <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3 dark:border-white">
          <div className="flex gap-2">
            <div className="h-4 w-4 border-2 border-black bg-white" />
            <div className="h-4 w-4 border-2 border-black bg-black" />
          </div>
          <span className="font-mono text-xs font-black tracking-widest text-black uppercase">
            ai-tokens.ts
          </span>
          <IconTerminal2 className="h-6 w-6 text-black" />
        </div>

        <div className="flex flex-col p-6 font-mono text-[15px] leading-relaxed font-bold sm:text-lg">
          <div>
            <span className="text-blue-600 dark:text-blue-400">import</span>{" "}
            {"{"}
          </div>
          <div className="pl-4">INPUT_TOKEN_COUNT,</div>
          <div className="pl-4">OUTPUT_TOKEN_COUNT,</div>
          <div>
            {"}"}{" "}
            <span className="text-purple-600 dark:text-purple-400">from</span>{" "}
            <span className="text-green-600 dark:text-green-400">
              "@scrawn/core"
            </span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">import</span> *{" "}
            <span className="text-purple-600 dark:text-purple-400">as</span>{" "}
            aisdk{" "}
            <span className="text-purple-600 dark:text-purple-400">from</span>{" "}
            <span className="text-green-600 dark:text-green-400">"ai"</span>
          </div>
          <div className="mt-6 text-gray-500 dark:text-gray-400">
            {"// A single line"}
          </div>
          <div className="">
            <span className="text-blue-600 dark:text-blue-400">const</span> ai ={" "}
            <span className="text-black dark:text-white">scrawn.ai</span>(aisdk,{" "}
            {"{"}
          </div>
          <div className="pl-6">inputDebit: expr(mul(</div>
          <div className="pl-10">
            div(INPUT_TOKEN_COUNT,{" "}
            <span className="text-orange-600 dark:text-orange-400">
              1_000_000
            </span>
            ),
          </div>
          <div className="pl-10">
            <span className="text-orange-600 dark:text-orange-400">300</span>
            )),
          </div>
          <div className="pl-6">outputDebit: expr(mul(</div>
          <div className="pl-10">
            div(OUTPUT_TOKEN_COUNT,{" "}
            <span className="text-orange-600 dark:text-orange-400">
              1_000_000
            </span>
            ),
          </div>
          <div className="pl-10">
            <span className="text-orange-600 dark:text-orange-400">1500</span>
            )),
          </div>
          <div>{"}"});</div>
          <div className="mt-6 text-gray-500 dark:text-gray-400">
            {"// To auto bill your AI SDK"}
          </div>
          <div className="">ai.streamText({"{"}</div>
          <div className="pl-4">
            model:{" "}
            <span className="text-green-600 dark:text-green-400">"gpt-7"</span>,
          </div>
          <div className="pl-4">
            prompt:{" "}
            <span className="text-green-600 dark:text-green-400">
              "write a haiku about a brave SDK called Scrawn that saved the
              village"
            </span>
            ,
          </div>
          <div className="pl-4">
            onFinish: {"{"}{" "}
            <span className="text-purple-600 dark:text-purple-400">void</span> (
            {">"}_{">"}_) {"}"}
          </div>
          <div>{"}"});</div>
          <div className="mt-4 text-gray-500 dark:text-gray-400">
            {"// We count tokens while you count your blessings"}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function DSLDemo() {
  const [base, setBase] = useState(100)
  const [multiplier, setMultiplier] = useState(3)
  const total = base * multiplier

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h3 className="text-4xl leading-none font-black tracking-tighter text-black uppercase md:text-5xl dark:text-white">
            Expressions, not spaghetti.
          </h3>
          <p className="mt-4 font-mono text-base font-bold tracking-widest text-gray-500 uppercase">
            A type-safe DSL for complex pricing logic.
          </p>
        </div>
        <div className="relative mt-4 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="absolute -top-3 left-6 border-2 border-black bg-yellow-400 px-2 font-mono text-[10px] font-black tracking-widest text-black uppercase">
            INTERACTIVE
          </div>
          <label className="mb-4 flex items-center justify-between font-mono text-sm font-black tracking-widest text-black uppercase dark:text-white">
            <span>Tag Value</span>
            <span className="bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
              {base}¢
            </span>
          </label>
          <input
            type="range"
            min={10}
            max={500}
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="mb-8 h-6 w-full cursor-pointer appearance-none border-2 border-black bg-gray-200 accent-black dark:border-white dark:bg-gray-800 dark:accent-white"
          />
          <label className="mb-4 flex items-center justify-between font-mono text-sm font-black tracking-widest text-black uppercase dark:text-white">
            <span>Multiplier</span>
            <span className="bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
              x{multiplier}
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
            className="h-6 w-full cursor-pointer appearance-none border-2 border-black bg-gray-200 accent-black dark:border-white dark:bg-gray-800 dark:accent-white"
          />
          <div className="mt-8 border-t-4 border-black pt-6 dark:border-white">
            <span className="font-mono text-xs font-black tracking-widest text-gray-500 uppercase">
              RESULT
            </span>
            <span className="mt-2 block text-6xl font-black tracking-tighter text-black dark:text-white">
              {total}¢
            </span>
          </div>
        </div>
      </div>

      {/* Code Window */}
      <motion.div
        initial={{ rotate: 1.5 }}
        animate={{ y: [-6, 6, -6], rotate: [1.5, 2.5, 1.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex w-full flex-col border-4 border-black bg-white text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:text-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
      >
        <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3 dark:border-white">
          <div className="flex gap-2">
            <div className="h-4 w-4 border-2 border-black bg-white" />
            <div className="h-4 w-4 border-2 border-black bg-black" />
          </div>
          <span className="font-mono text-xs font-black tracking-widest text-black uppercase">
            pricing.ts
          </span>
          <IconTerminal2 className="h-6 w-6 text-black" />
        </div>

        <div className="flex flex-col p-6 font-mono text-[15px] leading-relaxed font-bold sm:text-lg">
          <div>
            <span className="text-purple-600 dark:text-purple-400">const</span>{" "}
            <span className="text-blue-600 dark:text-blue-400">expr</span> ={" "}
            <span className="text-yellow-600 dark:text-yellow-400">mul</span>(
          </div>
          <div className="pl-4">
            <span className="text-yellow-600 dark:text-yellow-400">tag</span>(
            <span className="text-green-600 dark:text-green-400">
              "PREMIUM"
            </span>
            ),
          </div>
          <div className="pl-4 text-orange-600 dark:text-orange-400">
            {multiplier}
          </div>
          <div>);</div>
          <div className="mt-6 text-gray-500 dark:text-gray-400">
            {"// Evaluates to"} {total}¢
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function MiddlewareDemo() {
  const [path, setPath] = useState("/api/v1/users/123")
  const [mode, setMode] = useState<"whitelist" | "blacklist">("whitelist")

  const isMatched = path.startsWith("/api/v1/")
  const tracked = mode === "whitelist" ? isMatched : !isMatched

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h3 className="text-4xl leading-none font-black tracking-tighter text-black uppercase md:text-5xl dark:text-white">
            Drop-in middleware.
          </h3>
          <p className="mt-4 font-mono text-base font-bold tracking-widest text-gray-500 uppercase">
            Whitelist or blacklist paths. <br /> Zero boilerplate.
          </p>
        </div>
        <div className="relative mt-4 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="absolute -top-3 left-6 border-2 border-black bg-yellow-400 px-2 font-mono text-[10px] font-black tracking-widest text-black uppercase">
            INTERACTIVE
          </div>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full border-4 border-black bg-gray-100 px-4 py-4 font-mono text-base font-black text-black outline-none focus:bg-yellow-400 dark:border-white dark:bg-gray-800 dark:text-white dark:focus:bg-yellow-400 dark:focus:text-black"
          />
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setMode("whitelist")}
              className={`flex-1 border-4 border-black px-4 py-3 font-mono text-sm font-black tracking-widest uppercase transition-all dark:border-white ${
                mode === "whitelist"
                  ? "translate-x-[4px] translate-y-[4px] bg-black text-white shadow-none dark:bg-white dark:text-black"
                  : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
              }`}
            >
              Whitelist
            </button>
            <button
              onClick={() => setMode("blacklist")}
              className={`flex-1 border-4 border-black px-4 py-3 font-mono text-sm font-black tracking-widest uppercase transition-all dark:border-white ${
                mode === "blacklist"
                  ? "translate-x-[4px] translate-y-[4px] bg-black text-white shadow-none dark:bg-white dark:text-black"
                  : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
              }`}
            >
              Blacklist
            </button>
          </div>
          <div className="mt-8 border-t-4 border-black pt-6 dark:border-white">
            <span className="font-mono text-xs font-black tracking-widest text-gray-500 uppercase">
              STATUS
            </span>
            <span
              className={`mt-2 block text-5xl font-black tracking-tighter uppercase ${tracked ? "text-[#00ff00]" : "text-red-500"}`}
            >
              {tracked ? "TRACKED" : "SKIPPED"}
            </span>
          </div>
        </div>
      </div>

      {/* Code Window */}
      <motion.div
        initial={{ rotate: 1.5 }}
        animate={{ y: [-6, 6, -6], rotate: [1.5, 2.5, 1.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex w-full flex-col border-4 border-black bg-white text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:text-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
      >
        <div className="flex items-center justify-between border-b-4 border-black bg-yellow-400 px-4 py-3 dark:border-white">
          <div className="flex gap-2">
            <div className="h-4 w-4 border-2 border-black bg-white" />
            <div className="h-4 w-4 border-2 border-black bg-black" />
          </div>
          <span className="font-mono text-xs font-black tracking-widest text-black uppercase">
            middleware.ts
          </span>
          <IconTerminal2 className="h-6 w-6 text-black" />
        </div>

        <div className="flex flex-col p-6 font-mono text-[15px] leading-relaxed font-bold sm:text-lg">
          <div>
            <span className="text-blue-600 dark:text-blue-400">app</span>.
            <span className="text-yellow-600 dark:text-yellow-400">use</span>(
            <span className="text-black dark:text-white">
              scrawn.middleware
            </span>
            ({"{"}
          </div>
          <div className="pl-4">
            extractor:{" "}
            <span className="text-purple-600 dark:text-purple-400">req</span>{" "}
            {"=>"} req.userId,
          </div>
          <div className="pl-4">{mode}: [</div>
          <div className="pl-8 text-green-600 dark:text-green-400">
            "/api/v1/*"
          </div>
          <div className="pl-4">]</div>
          <div>{"}"}));</div>
        </div>
      </motion.div>
    </div>
  )
}

const demos: Record<string, React.ReactNode> = {
  basic: <BasicUsageDemo />,
  ai: <AITokenDemo />,
  dsl: <DSLDemo />,
  middleware: <MiddlewareDemo />,
}

export function FeatureTabs() {
  const [active, setActive] = useState("ai")

  return (
    <section className="relative overflow-hidden border-b-4 border-black bg-white py-32 dark:border-white dark:bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:32px_32px] opacity-10 dark:bg-[radial-gradient(#fff_2px,transparent_2px)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-20">
          <h2 className="text-6xl leading-[0.85] font-black tracking-tighter text-black uppercase md:text-8xl lg:text-[7rem] dark:text-white">
            Everything you need. <br />
            <span className="text-gray-300 dark:text-gray-700">
              Nothing you don't.
            </span>
          </h2>
        </div>

        {/* Tab bar */}
        <div className="mb-16 flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`border-4 border-black px-8 py-4 font-mono text-lg font-black tracking-widest uppercase transition-all dark:border-white ${
                active === tab.id
                  ? "translate-x-[4px] translate-y-[4px] bg-black text-white shadow-none dark:bg-white dark:text-black"
                  : "bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-yellow-400 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:bg-black dark:text-white dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] dark:hover:bg-yellow-400 dark:hover:text-black dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {demos[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
