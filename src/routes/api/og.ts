import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: async () => {
        const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Yellow Background -->
  <rect width="1200" height="630" fill="#facc15" />
  
  <!-- Dotted Grid Pattern -->
  <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="2" fill="#000" opacity="0.15" />
  </pattern>
  <rect width="1200" height="630" fill="url(#dots)" />

  <!-- Massive Ticket Drop Shadow -->
  <rect x="104" y="104" width="992" height="422" fill="black" />
  
  <!-- Main White Ticket -->
  <rect x="80" y="80" width="992" height="422" fill="white" stroke="black" stroke-width="12" />
  
  <!-- Screws -->
  <rect x="104" y="104" width="24" height="24" fill="#facc15" stroke="black" stroke-width="6" />
  <rect x="1024" y="104" width="24" height="24" fill="#facc15" stroke="black" stroke-width="6" />
  <rect x="104" y="454" width="24" height="24" fill="#facc15" stroke="black" stroke-width="6" />
  <rect x="1024" y="454" width="24" height="24" fill="#facc15" stroke="black" stroke-width="6" />

  <!-- Title -->
  <text x="140" y="240" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="120" fill="black" style="text-transform: uppercase;">
    Scrawn.
  </text>

  <!-- Taglines -->
  <text x="140" y="340" font-family="monospace" font-weight="800" font-size="50" fill="black">
    BILL YOUR SELF-ROLLED
  </text>
  <text x="140" y="415" font-family="monospace" font-weight="800" font-size="50" fill="black">
    ABOMINATION.
  </text>

  <!-- Floating Sticker 1 (Red) -->
  <g transform="translate(820, 30) rotate(12)">
    <rect x="8" y="8" width="320" height="80" fill="black" />
    <rect x="0" y="0" width="320" height="80" fill="#ef4444" stroke="black" stroke-width="8" />
    <text x="30" y="52" font-family="monospace" font-weight="900" font-size="32" fill="black">
      USAGE METERING
    </text>
  </g>
  
  <!-- Floating Sticker 2 (Green) -->
  <g transform="translate(750, 380) rotate(-6)">
    <rect x="8" y="8" width="280" height="70" fill="black" />
    <rect x="0" y="0" width="280" height="70" fill="#00ff00" stroke="black" stroke-width="8" />
    <text x="40" y="45" font-family="monospace" font-weight="900" font-size="28" fill="black">
      NO WEBHOOKS
    </text>
  </g>
</svg>
    `.trim()
        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        })
      },
    },
  },
})
