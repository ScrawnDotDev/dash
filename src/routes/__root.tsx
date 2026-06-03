import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { useEffect } from "react"
import { ThemeProvider } from "@/lib/theme-provider"
import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Scrawn — Usage-based billing in one-ish line",
      },
      {
        name: "description",
        content:
          "Bill your self-rolled abomination in one-ish line. Wrap DodoPayments. Track usage. Collect cash. One import.",
      },
      {
        name: "og:title",
        content: "Scrawn — Usage-based billing in one-ish line",
      },
      {
        name: "og:description",
        content:
          "Bill your self-rolled abomination in one-ish line. Open-source usage-based billing infrastructure for builders.",
      },
      {
        name: "og:image",
        content: "/og.jpg",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:image",
        content: "/og.jpg",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (!import.meta.env.DEV) {
        navigator.serviceWorker.register("/sw.js")
      } else {
        navigator.serviceWorker.getRegistrations().then((regs) =>
          Promise.all(regs.map((r) => r.unregister()))
        )
      }
    }
  }, [])

  return (
    <html lang="en" className="light">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
