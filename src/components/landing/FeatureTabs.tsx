import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const tabs = [
  { id: "basic", label: "Basic Events" },
  { id: "ai", label: "AI Tokens" },
  { id: "dsl", label: "Pricing DSL" },
  { id: "middleware", label: "Middleware" },
]

function BasicUsageDemo() {
  const [amount, setAmount] = useState(50)
  const dollars = (amount / 100).toFixed(2)

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
            Track anything in one call
          </h3>
          <p className="mt-2 text-lg font-bold text-gray-500">
            API calls, DB writes, image generations. Fire and forget.
          </p>
        </div>
        <div className="border-2 border-black bg-[#f4f4f4] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <label className="mb-2 block font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-white">
            Debit Amount: {amount}¢
          </label>
          <input
            type="range"
            min={1}
            max={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-4 w-full cursor-pointer appearance-none border-2 border-black bg-white accent-black dark:border-white dark:bg-black dark:accent-white"
          />
          <div className="mt-6 border-t-2 border-dashed border-black pt-4 dark:border-white">
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-gray-500">
              User gets billed:
            </span>
            <span className="block text-4xl font-black text-black dark:text-white">
              ${dollars}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center border-2 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white">
        <pre className="font-mono text-sm font-bold text-black sm:text-base">
          await scrawn.basicUsageEventConsumer({"{"}
          <br />
          {"  "}userId: "usr_123",
          <br />
          {"  "}debitAmount: {amount},
          <br />
          {"}"});
        </pre>
      </div>
    </div>
  )
}

function AITokenDemo() {
  const [inputTokens, setInputTokens] = useState(150)
  const [outputTokens, setOutputTokens] = useState(80)

  const total = (((inputTokens * 0.003) + (outputTokens * 0.012)) / 1000).toFixed(4)

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
            Wrap Vercel AI SDK
          </h3>
          <p className="mt-2 text-lg font-bold text-gray-500">
            Auto-bills tokens on every step finish.
          </p>
        </div>
        <div className="border-2 border-black bg-[#f4f4f4] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <label className="mb-2 block font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-white">
            Input Tokens: {inputTokens}
          </label>
          <input
            type="range"
            min={0}
            max={2000}
            value={inputTokens}
            onChange={(e) => setInputTokens(Number(e.target.value))}
            className="mb-6 h-4 w-full cursor-pointer appearance-none border-2 border-black bg-white accent-black dark:border-white dark:bg-black dark:accent-white"
          />
          <label className="mb-2 block font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-white">
            Output Tokens: {outputTokens}
          </label>
          <input
            type="range"
            min={0}
            max={2000}
            value={outputTokens}
            onChange={(e) => setOutputTokens(Number(e.target.value))}
            className="h-4 w-full cursor-pointer appearance-none border-2 border-black bg-white accent-black dark:border-white dark:bg-black dark:accent-white"
          />
          <div className="mt-6 border-t-2 border-dashed border-black pt-4 dark:border-white">
             <span className="font-mono text-sm font-bold uppercase tracking-widest text-gray-500">
              Total Cost:
            </span>
            <span className="block text-4xl font-black text-black dark:text-white">
              ${total}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center border-2 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white">
        <pre className="font-mono text-sm font-bold text-black sm:text-base">
          const aii = scrawn.ai(ai, {"{"}
          <br />
          {"  "}inputDebit: {"{"} tag: "GPT4_IN" {"}"},
          <br />
          {"  "}outputDebit: {"{"} tag: "GPT4_OUT" {"}"},
          <br />
          {"}"});
          <br /><br />
          // Auto-bills {inputTokens + outputTokens} tokens → ${total}
        </pre>
      </div>
    </div>
  )
}

function DSLDemo() {
  const [base, setBase] = useState(100)
  const [multiplier, setMultiplier] = useState(3)
  const total = base * multiplier

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
            Expressions, not spaghetti
          </h3>
          <p className="mt-2 text-lg font-bold text-gray-500">
            A type-safe DSL for pricing logic.
          </p>
        </div>
        <div className="border-2 border-black bg-[#f4f4f4] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <label className="mb-2 block font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-white">
            Tag Value: {base}¢
          </label>
          <input
            type="range"
            min={10}
            max={500}
            value={base}
            onChange={(e) => setBase(Number(e.target.value))}
            className="mb-6 h-4 w-full cursor-pointer appearance-none border-2 border-black bg-white accent-black dark:border-white dark:bg-black dark:accent-white"
          />
          <label className="mb-2 block font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-white">
            Multiplier: ×{multiplier}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
            className="h-4 w-full cursor-pointer appearance-none border-2 border-black bg-white accent-black dark:border-white dark:bg-black dark:accent-white"
          />
          <div className="mt-6 border-t-2 border-dashed border-black pt-4 dark:border-white">
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-gray-500">
              Result:
            </span>
            <span className="block text-4xl font-black text-black dark:text-white">
              {total}¢
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center border-2 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white">
        <pre className="font-mono text-sm font-bold text-black sm:text-base">
          const expr = mul(
          <br />
          {"  "}tag("PREMIUM"),
          <br />
          {"  "}{multiplier}
          <br />
          );
          <br /><br />
          // Evaluates to {total}¢
        </pre>
      </div>
    </div>
  )
}

function MiddlewareDemo() {
  const [path, setPath] = useState("/api/v1/users/123")
  const [mode, setMode] = useState<"whitelist" | "blacklist">("whitelist")

  const isMatched = path.startsWith("/api/v1/")
  const tracked = mode === "whitelist" ? isMatched : !isMatched

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
            Drop-in middleware
          </h3>
          <p className="mt-2 text-lg font-bold text-gray-500">
            Whitelist or blacklist paths. Zero boilerplate.
          </p>
        </div>
        <div className="border-2 border-black bg-[#f4f4f4] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-[#111] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full border-2 border-black bg-white px-4 py-3 font-mono text-sm font-bold text-black outline-none focus:bg-yellow-400 dark:border-white dark:bg-black dark:text-white dark:focus:bg-yellow-400 dark:focus:text-black"
          />
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setMode("whitelist")}
              className={`flex-1 border-2 border-black px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest transition-colors dark:border-white ${
                mode === "whitelist"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800"
              }`}
            >
              Whitelist
            </button>
            <button
              onClick={() => setMode("blacklist")}
              className={`flex-1 border-2 border-black px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest transition-colors dark:border-white ${
                mode === "blacklist"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800"
              }`}
            >
              Blacklist
            </button>
          </div>
          <div className="mt-6 border-t-2 border-dashed border-black pt-4 dark:border-white">
             <span className="font-mono text-sm font-bold uppercase tracking-widest text-gray-500">
              Status:
            </span>
            <span className={`block text-2xl font-black uppercase tracking-tight ${tracked ? "text-green-600" : "text-red-500"}`}>
              {tracked ? "✓ TRACKED" : "✗ SKIPPED"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center border-2 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-white">
        <pre className="font-mono text-sm font-bold text-black sm:text-base">
          app.use(scrawn.middleware({"{"}
          <br />
          {"  "}extractor: req {"=>"} req.userId,
          <br />
          {"  "}{mode}: [
          <br />
          {"    "} "/api/v1/*"
          <br />
          {"  "}]
          <br />
          {"}"}));
        </pre>
      </div>
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
  const [active, setActive] = useState("basic")

  return (
    <section className="border-b border-black bg-white py-24 dark:border-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12">
          <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter text-black md:text-7xl dark:text-white">
            Everything you need. <br />
            <span className="text-gray-400">Nothing you don't.</span>
          </h2>
        </div>

        {/* Tab bar */}
        <div className="mb-12 flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`border-2 border-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest transition-all dark:border-white ${
                active === tab.id
                  ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                  : "bg-white text-black hover:bg-yellow-400 dark:bg-black dark:text-white dark:hover:bg-yellow-400 dark:hover:text-black"
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {demos[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
