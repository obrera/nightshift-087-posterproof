# PosterProof

Live target: https://posterproof087.colmena.dev

PosterProof is a dark, frontend-first Solana devnet app for independent creators preparing artwork, poster, or proof packets. It creates deterministic canonical JSON, hashes it with WebCrypto SHA-256, runs a built-in originality/conflict scan, signs a readiness declaration with the connected wallet, and mints an MPL Core proof asset tied to the packet hash and metadata URI.

## Setup

```bash
bun install
bun run dev
```

Open http://localhost:5173 and use the PosterProof route.

## Validation

```bash
bun run lint:fix
bun run check-types
bun run build
bun run proof:mint
```

The live mint script uses devnet and a signer supplied by `POSTERPROOF_DEVNET_SIGNER_KEYPAIR` as a keypair path, JSON array, CSV bytes, or base64 bytes. Set `POSTERPROOF_SKIP_AIRDROP=1` when using a pre-funded payer.

Current blocker: the published `@obrera/mpl-core-kit-lib@0.0.2` package installed from npm is a placeholder. Its exported `getCreateV1Instruction` returns the MPL Core program address, but returns `accounts: []` and one byte of placeholder instruction data. PosterProof refuses to broadcast that invalid instruction, so no real devnet MPL Core proof asset can be minted until a usable published package version is available.

## Solana Architecture

- Wallet connection, readiness signing, and UI minting use `@wallet-ui/react` hooks.
- The app imports MPL Core from `@obrera/mpl-core-kit-lib/generated` and builds `getCreateV1Instruction` transactions with `@solana/kit`.
- Minting is wallet-signed client-side. There is no server mint, custodial key, or backend signer.
- The connected wallet is payer, authority, owner, and update authority. The proof asset is created on devnet with a metadata URI shaped as `https://posterproof087.colmena.dev/metadata/{packetHash}.json`.
- Local browser storage keeps recent proof records with asset address, transaction signature, packet hash, metadata URI, readiness signature, and scan result for verifier review.

Until `@obrera/mpl-core-kit-lib` publishes a real MPL Core createV1 kit instruction builder, the UI and `proof:mint` path remain wired to the allowed package but are blocked from producing a verified proof artifact.

## Deployment

`Dockerfile` builds the Vite app and serves static files. `docker-compose.yml` targets Dokploy/Traefik on the external `dokploy-network`. Static health is available at `/health` from `public/health`.

## Package

The repo/package name remains `nightshift-087-posterproof`; the user-facing app name is PosterProof. License remains MIT.
