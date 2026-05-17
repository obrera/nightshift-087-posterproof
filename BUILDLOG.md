# Build Log

## Metadata

- **Agent:** Obrera
- **Challenge:** 2026-05-17 - Nightshift 087 Solana Week
- **Started:** 2026-05-17 00:00 UTC
- **Submitted:** 2026-05-17 01:06 UTC
- **Total time:** 1h 6m
- **Model:** OpenAI GPT-5
- **Reasoning:** medium
- **Live target:** https://posterproof087.colmena.dev
- **Repository/package:** nightshift-087-posterproof

## Scorecard

- **Backend depth:** 2/10
- **Deployment realism:** 5/10
- **Persistence realism:** 3/10
- **User/state complexity:** 5/10
- **Async/ops/admin depth:** 4/10
- **Product ambition:** 6/10
- **What made this real:** PosterProof has a creator packet workflow, deterministic hashing, originality/conflict checks, wallet readiness signing, operator review, and a wallet-signed MPL Core mint path wired to the required package path.
- **What stayed too thin:** The required npm package currently exports a placeholder create instruction, so a real devnet MPL Core asset cannot be minted without a corrected package release.
- **Next build should push further by:** Starting from a verified usable MPL Core package version, then adding metadata hosting, asset indexing, and live holder verification.

## Solana/NFT Brief

- **Use-case family:** intellectual property provenance.
- **Primary actor:** independent creator preparing an artwork/poster/proof packet.
- **Why NFT ownership matters:** the creator should own a transferable devnet MPL Core proof asset that links a wallet, timestamped transaction, packet hash, and metadata URI for verifier inspection.
- **Wallet-signed flow:** connect wallet -> canonicalize packet -> originality scan -> sign readiness declaration -> build MPL Core createV1 instruction -> mint proof asset when the required package returns a real instruction.
- **Server mint status:** no server mint path exists; minting is client-side and wallet-signed only.
- **Operator tool:** review checklist, metadata preview, scan output, and proof gallery/verifier links.

## Log

| Time (UTC) | Step |
|---|---|
| 00:00 | Reviewed Nightshift and Solana Week rules, preserving build number 087. |
| 00:08 | Selected PosterProof as an intellectual-property provenance workflow for creator-owned proof assets. |
| 00:15 | Implemented packet composer, canonical JSON generation, WebCrypto SHA-256 hashing, and metadata URI shaping. |
| 00:24 | Added originality scanner with registry matches, readiness scoring, warnings, and suggestions. |
| 00:34 | Added wallet-ui connection and wallet-signed readiness declaration for the packet hash and metadata URI. |
| 00:42 | Wired MPL Core proof minting through `@obrera/mpl-core-kit-lib/generated` and `@solana/kit` with the connected wallet as payer, authority, owner, and update authority. |
| 00:49 | Added operator review checklist, metadata preview, local proof record gallery, and explorer links for minted records. |
| 00:55 | Confirmed `@obrera/mpl-core-kit-lib@0.0.2` is the only npm version and its generated `getCreateV1Instruction` export is a placeholder with `accounts: []` and `data: new Uint8Array([0])`. |
| 00:58 | Removed forbidden recovery dependencies/imports and kept imports on the real published package path; no vendored, dist-path, or file-package bypass is used. |
| 01:01 | Added browser and script guards that refuse the placeholder create instruction before broadcasting any wallet-signed transaction. |
| 01:03 | Updated README and BUILDLOG with challenge metadata, Solana architecture, validation evidence, and the exact unresolved package blocker. |
| 01:06 | Re-ran install, lint, typecheck, build, proof script, and forbidden source/import guards. |

## Validation Log

- `npm view @obrera/mpl-core-kit-lib versions --json`: returned only `["0.0.2"]`.
- `node_modules/@obrera/mpl-core-kit-lib/package.json`: confirmed installed published version is `0.0.2` with only `./generated` exported.
- `node_modules/@obrera/mpl-core-kit-lib/generated/index.js`: inspected exported `getCreateV1Instruction`; it returns `accounts: []`, `data: new Uint8Array([0])`, and program address `CoREENxT1ttXcRQA7jJZxGzDrJr3e9Fp3uL5X1YvCxy`.
- `bun install`: passed with dependencies from the real npm package path.
- `bun run lint:fix`: passed.
- `bun run check-types`: passed.
- `bun run build`: passed.
- `POSTERPROOF_DEVNET_SIGNER_KEYPAIR=/home/obrera/keys/obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G.json POSTERPROOF_SKIP_AIRDROP=1 bun run proof:mint`: returned `{"blocker":"@obrera/mpl-core-kit-lib@0.0.2 generated getCreateV1Instruction has no account metas; published package is a placeholder and cannot create an MPL Core asset.","ok":false,"stage":"build mpl core create instruction"}`.
- Guard search for forbidden source dependency/import names in `package.json`, `bun.lock`, `src`, and `scripts`: passed with no forbidden app/server imports.

## Deployment Notes

- Live target: https://posterproof087.colmena.dev
- Static health path: `/health`, provided by `public/health`.
- Dokploy network: `dokploy-network` external network in `docker-compose.yml`.
- Static server target port in `docker-compose.yml`: 3000.

## Blocker

A real devnet MPL Core proof cannot be completed with the currently published allowed dependency. `@obrera/mpl-core-kit-lib@0.0.2` is installed from npm, but its generated `getCreateV1Instruction` implementation is a placeholder with no account metas and placeholder data. Broadcasting it would not create an MPL Core asset, so both the browser mint path and `proof:mint` stop before sending a transaction.
