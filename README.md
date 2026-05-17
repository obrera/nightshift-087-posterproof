# PosterProof

Live target: https://posterproof087.colmena.dev

Nightshift 087 PosterProof is a dark, frontend-first Solana devnet app for independent creators preparing artwork, poster, or proof packets. It creates deterministic canonical JSON, hashes it with WebCrypto SHA-256, runs a built-in originality/conflict scan, signs a readiness declaration with the connected wallet, and is wired to mint an MPL Core proof asset tied to the packet hash and metadata URI.

## Challenge Reference

- Build: Nightshift 087
- Campaign: Solana Week
- NFT use-case family: intellectual property provenance
- Primary actor: independent creator preparing an artwork/poster/proof packet
- Agent: Obrera via OpenAI GPT-5, reasoning medium

## Setup

```bash
bun install
bun run dev
```

Open http://localhost:5173 and use the PosterProof route.

## Capabilities

- Compose and canonicalize an artwork proof packet with deterministic JSON and SHA-256 hashing.
- Screen the packet against a local originality registry with readiness scoring, warnings, and verifier suggestions.
- Connect a wallet with `@wallet-ui/react` and sign a product-critical readiness declaration containing the packet hash, metadata URI, JSON hash, and byte length.
- Review operator checks, metadata preview, and any stored proof records with Solana explorer links.
- Attempt a wallet-signed MPL Core proof mint through `@solana/kit` and `@obrera/mpl-core-kit-lib/generated`; the app refuses the currently published placeholder instruction before broadcast.

## Validation

```bash
bun run lint:fix
bun run check-types
bun run build
bun run proof:mint
```

The live mint script uses devnet and a signer supplied by `POSTERPROOF_DEVNET_SIGNER_KEYPAIR` as a keypair path, JSON array, CSV bytes, or base64 bytes. Set `POSTERPROOF_SKIP_AIRDROP=1` when using a pre-funded payer.

Current blocker: npm only publishes `@obrera/mpl-core-kit-lib@0.0.2`, and that package is a placeholder. Its exported `getCreateV1Instruction` returns the MPL Core program address, but returns `accounts: []` and one byte of placeholder instruction data. PosterProof now refuses that invalid instruction in both the browser mint path and `proof:mint`, so no real devnet MPL Core proof asset can be minted until a usable published package version is available.

## Solana Architecture

- Wallet connection, readiness signing, and UI mint attempts use `@wallet-ui/react` hooks.
- The app imports MPL Core from the real npm package path `@obrera/mpl-core-kit-lib/generated` and builds `getCreateV1Instruction` transactions with `@solana/kit`.
- Minting is designed as wallet-signed client-side work. There is no server mint, custodial key, or backend signer.
- The connected wallet is payer, authority, owner, and update authority. The intended proof asset metadata URI is shaped as `https://posterproof087.colmena.dev/metadata/{packetHash}.json`.
- Local browser storage keeps recent proof records with asset address, transaction signature, packet hash, metadata URI, readiness signature, and scan result for verifier review after a successful mint path exists.

Until `@obrera/mpl-core-kit-lib` publishes a real MPL Core createV1 kit instruction builder, the UI and `proof:mint` path remain wired to the allowed package but are blocked from producing a verified proof artifact.

## Deployment

`Dockerfile` builds the Vite app and serves static files. `docker-compose.yml` targets Dokploy/Traefik on the external `dokploy-network`. Static health is available at `/health` from `public/health`.

## Package

The repo/package name remains `nightshift-087-posterproof`; the user-facing app name is PosterProof. License remains MIT.
