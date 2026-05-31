import {
  IconCalculator,
  IconSparkles,
  IconTerminal2,
} from "@tabler/icons-react"

export function Features() {
  return (
    <section className="relative bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
            Everything you need.{" "}
            <span className="text-gray-400">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <IconTerminal2 className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Basic Usage
            </h3>
            <p className="mb-6 text-sm leading-relaxed font-medium text-gray-500">
              Track API calls, database reads, or custom events. One gRPC call
              to log the usage with idempotency.
            </p>
            <div className="overflow-x-auto rounded-md border border-gray-100 bg-gray-50 p-3 font-mono text-[11px] text-gray-600">
              <span className="text-purple-600">await</span>{" "}
              scrawn.basicUsageEventConsumer(&#123;
              <br />
              &nbsp;&nbsp;userId:{" "}
              <span className="text-green-600">"usr_123"</span>,<br />
              &nbsp;&nbsp;debitAmount:{" "}
              <span className="text-orange-500">50</span>
              <br />
              &#125;);
            </div>
          </div>

          {/* Card 2 - Featured */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-[#f7b219]/5 blur-2xl" />
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-[#f7b219]/10 text-[#f7b219]">
              <IconSparkles className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              AI Token Billing
            </h3>
            <p className="mb-6 text-sm leading-relaxed font-medium text-gray-500">
              Wrap the Vercel AI SDK. We automatically count input tokens,
              output tokens, and calculate the cost.
            </p>
            <div className="relative z-10 overflow-x-auto rounded-md border border-gray-100 bg-gray-50 p-3 font-mono text-[11px] text-gray-600">
              <span className="text-blue-600">const</span> billableAi =
              scrawn.ai(ai, &#123;
              <br />
              &nbsp;&nbsp;inputDebit: &#123; tag:{" "}
              <span className="text-green-600">"GPT4_IN"</span> &#125;,
              <br />
              &nbsp;&nbsp;outputDebit: &#123; tag:{" "}
              <span className="text-green-600">"GPT4_OUT"</span> &#125;
              <br />
              &#125;);
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <IconCalculator className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Pricing DSL
            </h3>
            <p className="mb-6 text-sm leading-relaxed font-medium text-gray-500">
              A full type-safe math expression language evaluated server-side.
              Sync tags directly via CLI.
            </p>
            <div className="overflow-x-auto rounded-md border border-gray-100 bg-gray-50 p-3 font-mono text-[11px] text-gray-600">
              <span className="text-blue-600">const</span> expr = add(
              <br />
              &nbsp;&nbsp;mul(tag(
              <span className="text-green-600">"PREMIUM"</span>),{" "}
              <span className="text-orange-500">3</span>),
              <br />
              &nbsp;&nbsp;<span className="text-orange-500">250</span>
              <br />
              );
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
