let server

async function getServer() {
  if (!server) {
    const mod = await import("../dist/server/server.js")
    server = mod.default
  }
  return server
}

export default async function handler(req, res) {
  try {
    const app = await getServer()

    const url = new URL(req.url, `http://${req.headers.host}`)

    let body
    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      body = Buffer.concat(chunks)
    }

    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers),
      body: body?.length ? body : undefined,
    })

    const response = await app.fetch(request)

    res.statusCode = response.status
    res.statusMessage = response.statusText

    const responseBody = await response.arrayBuffer()
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    res.end(Buffer.from(responseBody))
  } catch (error) {
    console.error("Server handler error:", error)
    res.statusCode = 500
    res.setHeader("Content-Type", "text/plain")
    res.end("Internal Server Error")
  }
}
