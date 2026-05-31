import { motion } from "framer-motion"

export function PlaygroundSection() {
  return (
    <section className="border-t border-gray-100 bg-[#fafafa] py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
            The Scrawn Way
          </h2>
          <p className="text-xl font-medium text-gray-500">
            Compare the spaghetti code you have now to the clean DSL you could
            be using.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Without Scrawn */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-300" />
                <div className="h-3 w-3 rounded-full bg-gray-300" />
                <div className="h-3 w-3 rounded-full bg-gray-300" />
              </div>
              <span className="font-mono text-xs font-semibold text-gray-400">
                Without Scrawn (Chaos)
              </span>
            </div>
            <pre className="flex-1 overflow-x-auto bg-[#0a0a0a] p-6 text-sm leading-relaxed font-medium text-gray-300">
              <code>
                <span className="text-gray-500 italic">{`// Some endpoint`}</span>
                {`
`}
                <span className="text-[#e06c75]">export async function</span>{" "}
                <span className="text-[#61afef]">POST</span>
                {`(req) {
  `}
                <span className="text-[#e06c75]">const</span>{" "}
                <span className="text-[#61afef]">user</span>{" "}
                <span className="text-[#56b6c2]">=</span>{" "}
                <span className="text-[#e06c75]">await</span>{" "}
                <span className="text-[#61afef]">getUser</span>
                {`();
  
  `}
                <span className="text-gray-500 italic">{`// 1. Check stripe sub`}</span>
                {`
  `}
                <span className="text-[#e06c75]">const</span>{" "}
                <span className="text-[#61afef]">sub</span>{" "}
                <span className="text-[#56b6c2]">=</span>{" "}
                <span className="text-[#e06c75]">await</span>{" "}
                <span className="text-[#e5c07b]">stripe</span>.
                <span className="text-[#e5c07b]">subscriptions</span>.
                <span className="text-[#61afef]">retrieve</span>
                {`(user.subId);
  
  `}
                <span className="text-gray-500 italic">{`// 2. Check usage limits`}</span>
                {`
  `}
                <span className="text-[#e06c75]">if</span>
                {` (sub.items.data[`}
                <span className="text-[#d19a66]">0</span>
                {`].usage `}
                <span className="text-[#56b6c2]">&gt;</span>{" "}
                <span className="text-[#d19a66]">1000</span>
                {`) `}
                <span className="text-[#e06c75]">return</span>{" "}
                <span className="text-[#d19a66]">429</span>
                {`;
  
  `}
                <span className="text-gray-500 italic">{`// 3. Do AI stuff`}</span>
                {`
  `}
                <span className="text-[#e06c75]">const</span>{" "}
                <span className="text-[#61afef]">result</span>{" "}
                <span className="text-[#56b6c2]">=</span>{" "}
                <span className="text-[#e06c75]">await</span>{" "}
                <span className="text-[#61afef]">generateText</span>
                {`(...);
  
  `}
                <span className="text-gray-500 italic">{`// 4. Report usage to stripe`}</span>
                {`
  `}
                <span className="text-[#e06c75]">await</span>{" "}
                <span className="text-[#e5c07b]">stripe</span>.
                <span className="text-[#e5c07b]">subscriptionItems</span>.
                <span className="text-[#61afef]">createUsageRecord</span>
                {`(
    sub.items.data[`}
                <span className="text-[#d19a66]">0</span>
                {`].id,
    { quantity: result.usage.totalTokens, action: `}
                <span className="text-[#98c379]">'increment'</span>
                {` }
  );
  
  `}
                <span className="text-[#e06c75]">return</span>{" "}
                <span className="text-[#e5c07b]">Response</span>.
                <span className="text-[#61afef]">json</span>
                {`(result);
}`}
              </code>
            </pre>
          </motion.div>

          {/* With Scrawn */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#0a0a0a] shadow-2xl ring-1 ring-white/10"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#f7b219]/10 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex items-center justify-between border-b border-gray-800 bg-[#111] px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="font-mono text-xs font-bold text-[#f7b219]">
                With Scrawn (Zen)
              </span>
            </div>
            <pre className="relative z-10 flex-1 overflow-x-auto p-6 text-sm leading-relaxed font-medium text-gray-300">
              <code>
                <span className="text-[#e06c75]">import</span>
                {` { Scrawn } `}
                <span className="text-[#e06c75]">from</span>{" "}
                <span className="text-[#98c379]">"@scrawn/core"</span>
                {`;

`}
                <span className="text-gray-500 italic">{`// One line config`}</span>
                {`
`}
                <span className="text-[#e06c75]">const</span>{" "}
                <span className="text-[#61afef]">scrawn</span>{" "}
                <span className="text-[#56b6c2]">=</span>{" "}
                <span className="text-[#e06c75]">new</span>{" "}
                <span className="text-[#e5c07b]">Scrawn</span>
                {`({ provider: `}
                <span className="text-[#98c379]">"dodopayments"</span>
                {` });

`}
                <span className="text-[#e06c75]">export async function</span>{" "}
                <span className="text-[#61afef]">POST</span>
                {`(req) {
  `}
                <span className="text-gray-500 italic">{`// We handle limits, metering, and checkout URLs`}</span>
                {`
  `}
                <span className="text-[#e06c75]">const</span>{" "}
                <span className="text-[#61afef]">result</span>{" "}
                <span className="text-[#56b6c2]">=</span>{" "}
                <span className="text-[#e06c75]">await</span>{" "}
                <span className="text-[#e5c07b]">scrawn</span>.
                <span className="text-[#61afef]">generateWithBilling</span>
                {`({
    model: `}
                <span className="text-[#98c379]">"gpt-4"</span>
                {`,
    prompt: `}
                <span className="text-[#98c379]">"..."</span>
                {`,
    userId: req.user.id
  });
  
  `}
                <span className="text-[#e06c75]">return</span>{" "}
                <span className="text-[#e5c07b]">Response</span>.
                <span className="text-[#61afef]">json</span>
                {`(result);
}`}
              </code>
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
