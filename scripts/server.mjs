const appName = 'PosterProof'
const distRoot = new URL('../dist/', import.meta.url)
const host = 'posterproof087.colmena.dev'
const port = Number(globalThis.Bun.env.PORT || '9876')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

globalThis.Bun.serve({
  fetch: handleRequest,
  port,
})

console.log(`${appName} server listening on :${port}`)

async function handleRequest(request) {
  const url = new URL(request.url)
  const publicOrigin = getPublicOrigin(url)

  if (url.pathname === '/health') {
    return textResponse('ok')
  }

  if (url.pathname === '/api/health') {
    return jsonResponse({
      app: appName,
      metadata: 'ready',
      ok: true,
    })
  }

  if (url.pathname === '/api/config') {
    return jsonResponse({
      metadataBaseUrl: `${url.origin}/metadata`,
      ok: true,
    })
  }

  const metadataMatch = url.pathname.match(/^\/metadata\/([a-f0-9]{64})\.(json|svg)$/u)
  if (metadataMatch?.[2] === 'json') {
    return jsonResponse(createMetadata(publicOrigin, metadataMatch[1]))
  }
  if (metadataMatch?.[2] === 'svg') {
    return svgResponse(createMetadataSvg(metadataMatch[1]))
  }

  if (url.pathname.startsWith('/metadata/')) {
    return jsonResponse({ error: 'metadata hash must be a 64-character lowercase sha256 hex string', ok: false }, 404)
  }

  return serveStaticAsset(url.pathname)
}

function createMetadata(origin, packetHash) {
  return {
    name: `PosterProof Packet ${packetHash.slice(0, 10)}`,
    description:
      'Wallet-signed PosterProof provenance packet metadata. The hash binds the creator packet, readiness declaration, and minted MPL Core proof asset.',
    image: `${origin}/metadata/${packetHash}.svg`,
    external_url: `https://${host}/`,
    attributes: [
      { trait_type: 'Application', value: appName },
      { trait_type: 'Network', value: 'Solana Devnet' },
      { trait_type: 'Packet SHA-256', value: packetHash },
      { trait_type: 'Proof Type', value: 'Wallet-signed MPL Core provenance' },
    ],
    properties: {
      category: 'image',
      creators: [{ address: 'connected-wallet', share: 100 }],
      files: [{ type: 'image/svg+xml', uri: `${origin}/metadata/${packetHash}.svg` }],
    },
  }
}

function createMetadataSvg(packetHash) {
  const shortHash = packetHash.slice(0, 16)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-label="PosterProof packet ${shortHash}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="58%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#064e3b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <rect x="96" y="96" width="1008" height="1008" rx="42" fill="none" stroke="#34d399" stroke-opacity="0.44" stroke-width="4"/>
  <text x="120" y="190" fill="#d1fae5" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="700">PosterProof</text>
  <text x="120" y="270" fill="#a7f3d0" font-family="Inter, Arial, sans-serif" font-size="30">Wallet-signed provenance packet</text>
  <text x="120" y="405" fill="#f8fafc" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="34">${shortHash}</text>
  <text x="120" y="460" fill="#94a3b8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="24">${packetHash.slice(16, 48)}</text>
  <text x="120" y="502" fill="#94a3b8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="24">${packetHash.slice(48)}</text>
  <circle cx="930" cy="865" r="150" fill="#10b981" fill-opacity="0.16" stroke="#34d399" stroke-width="3"/>
  <path d="M850 866l54 54 112-128" fill="none" stroke="#bbf7d0" stroke-linecap="round" stroke-linejoin="round" stroke-width="30"/>
  <text x="120" y="1005" fill="#d1d5db" font-family="Inter, Arial, sans-serif" font-size="28">Solana devnet MPL Core proof metadata</text>
</svg>`
}

function getContentType(pathname) {
  const extension = pathname.match(/\.[^./?#]+$/u)?.[0]
  return (extension && contentTypes[extension]) || 'application/octet-stream'
}

function getPublicOrigin(url) {
  if (url.host === host) {
    return `https://${host}`
  }
  return url.origin
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'access-control-allow-origin': '*',
      'content-type': contentTypes['.json'],
    },
    status,
  })
}

async function serveStaticAsset(pathname) {
  const safePath = normalizePathname(pathname)
  if (!safePath) {
    return textResponse('Bad path', 400)
  }

  const assetPath = safePath === '/' ? '/index.html' : safePath
  const asset = globalThis.Bun.file(new URL(`.${assetPath}`, distRoot))
  if (await asset.exists()) {
    return new Response(asset, {
      headers: {
        'content-type': getContentType(assetPath),
      },
    })
  }

  const index = globalThis.Bun.file(new URL('./index.html', distRoot))
  return new Response(index, {
    headers: {
      'content-type': contentTypes['.html'],
    },
  })
}

function normalizePathname(pathname) {
  try {
    const decoded = decodeURIComponent(pathname)
    if (!decoded.startsWith('/') || decoded.split('/').includes('..')) {
      return undefined
    }
    return decoded
  } catch {
    return undefined
  }
}

function svgResponse(body) {
  return new Response(body, {
    headers: {
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=31536000, immutable',
      'content-type': contentTypes['.svg'],
    },
  })
}

function textResponse(body, status = 200) {
  return new Response(body, {
    headers: {
      'content-type': contentTypes['.txt'],
    },
    status,
  })
}
