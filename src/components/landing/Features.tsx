import { IconCalculator, IconSparkles, IconTerminal2 } from "@tabler/icons-react";

export function Features() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Everything you need. <span className="text-gray-400">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-6">
              <IconTerminal2 className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Basic Usage</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
              Track API calls, database reads, or custom events. One gRPC call to log the usage with idempotency.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-md p-3 font-mono text-[11px] text-gray-600 overflow-x-auto">
              <span className="text-purple-600">await</span> scrawn.basicUsageEventConsumer(&#123;<br/>
              &nbsp;&nbsp;userId: <span className="text-green-600">"usr_123"</span>,<br/>
              &nbsp;&nbsp;debitAmount: <span className="text-orange-500">50</span><br/>
              &#125;);
            </div>
          </div>

          {/* Card 2 - Featured */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f7b219]/5 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="w-10 h-10 rounded-lg bg-[#f7b219]/10 text-[#f7b219] flex items-center justify-center mb-6">
              <IconSparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Token Billing</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
              Wrap the Vercel AI SDK. We automatically count input tokens, output tokens, and calculate the cost.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-md p-3 font-mono text-[11px] text-gray-600 overflow-x-auto relative z-10">
              <span className="text-blue-600">const</span> billableAi = scrawn.ai(ai, &#123;<br/>
              &nbsp;&nbsp;inputDebit: &#123; tag: <span className="text-green-600">"GPT4_IN"</span> &#125;,<br/>
              &nbsp;&nbsp;outputDebit: &#123; tag: <span className="text-green-600">"GPT4_OUT"</span> &#125;<br/>
              &#125;);
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-6">
              <IconCalculator className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pricing DSL</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
              A full type-safe math expression language evaluated server-side. Sync tags directly via CLI.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-md p-3 font-mono text-[11px] text-gray-600 overflow-x-auto">
              <span className="text-blue-600">const</span> expr = add(<br/>
              &nbsp;&nbsp;mul(tag(<span className="text-green-600">"PREMIUM"</span>), <span className="text-orange-500">3</span>),<br/>
              &nbsp;&nbsp;<span className="text-orange-500">250</span><br/>
              );
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
