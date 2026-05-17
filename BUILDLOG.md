# Build Log

## Metadata

- **Agent:** Obrera
- **Challenge:** 2026-05-17 - Nightshift 087 Solana Week
- **Started:** 2026-05-17 01:45 UTC
- **Submitted:** 2026-05-17 01:46 UTC
- **Total time:** 1m recovery pass
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
- **What stayed too thin:** Metadata is shaped as deterministic public URIs, but this build still does not host immutable metadata JSON or index minted proof assets beyond local browser records.
- **Next build should push further by:** Adding metadata hosting, asset indexing, and live holder verification.

## Solana/NFT Brief

- **Use-case family:** intellectual property provenance.
- **Primary actor:** independent creator preparing an artwork/poster/proof packet.
- **Why NFT ownership matters:** the creator should own a transferable devnet MPL Core proof asset that links a wallet, timestamped transaction, packet hash, and metadata URI for verifier inspection.
- **Wallet-signed flow:** connect wallet -> canonicalize packet -> originality scan -> sign readiness declaration -> build MPL Core createV1 instruction -> mint proof asset.
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
| 00:55 | Initially validated the published MPL Core helper package and deferred live proof minting until a corrected package release was available. |
| 00:58 | Removed forbidden recovery dependencies/imports and kept imports on the real published package path; no vendored, dist-path, or file-package bypass is used. |
| 01:01 | Added browser and script guards that validate create instruction account metas and data before broadcasting any wallet-signed transaction. |
| 01:03 | Updated README and BUILDLOG with challenge metadata, Solana architecture, and validation evidence. |
| 01:06 | Re-ran install, lint, typecheck, build, proof script, and forbidden source/import guards. |
| 01:45 | Recovery pass began; preserved build 087, app name PosterProof, and existing package identity. |
| 01:45 | Removed the invalid Dokploy healthcheck because the final `beeman/static-server` image does not provide `wget` or a shell for the previous command. |
| 01:46 | Re-ran install, lint fix, typecheck, production build, live devnet proof mint, package helper check, and forbidden import/package guard searches. |
| 01:46 | Replaced the stale devnet RPC failure notes with the live proof asset and transaction from this run. |
| 09:30 | Fixed deployed metadata URLs by replacing pure static hosting with a Bun static + metadata server for `/metadata/{packetHash}.json` and `/metadata/{packetHash}.svg`. |

## Validation Log

- `BUN_TMPDIR=/tmp BUN_INSTALL=/tmp/bun-install bun install --ignore-scripts`: passed with no package changes.
- `node_modules/@obrera/mpl-core-kit-lib/package.json`: confirmed installed published version is `0.0.3`.
- Public import check for `@obrera/mpl-core-kit-lib/generated`: `getCreateV1Instruction` returned program `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`, 8 account metas, and 86 data bytes.
- `bun run lint:fix`: passed.
- `bun run check-types`: passed.
- `bun run build`: passed.
- `POSTERPROOF_DEVNET_SIGNER_KEYPAIR=/home/obrera/keys/obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G.json POSTERPROOF_SKIP_AIRDROP=1 bun run proof:mint`: passed with `{"assetAddress":"6KULRE8pLP9bRQpMohd72hiHGdBZoJfUxTDArHPmxzuR","metadataUri":"https://posterproof087.colmena.dev/metadata/436e0fa35a7473128ea1854dc256611a084d3d2f925402aa2ae354ef6f87eddf.json","ok":true,"payerAddress":"obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G","txSignature":"5CDQCAdEbWhSn895Qes9CTDxJAswZXpPKtt5kRdFQY8xUViwBtfwgsHEB3b3sHdnuj7xAeEn9iY5jy1AnsFWkB6s"}`.
- Guard search for `@solana/web3.js`, `@solana/wallet-adapter`, and `wallet-adapter` in `package.json`, `bun.lock`, `src`, and `scripts`: passed with no matches.
- Guard search for vendored/dist/file-package bypasses in `package.json`, `bun.lock`, `src`, and `scripts`: passed with no matches for package specifiers or MPL Core bypass paths.
- Guard search for Node `Buffer` usage in `package.json`, `src`, and `scripts`: passed with no matches.
- `curl -i http://127.0.0.1:18887/metadata/9cc5f807ae6c653df49dfe8e1e2d385e90f16d4417caf08858e5d09a67e80417.json`: passed locally with `content-type: application/json; charset=utf-8`.
- `curl -i http://127.0.0.1:18887/metadata/9cc5f807ae6c653df49dfe8e1e2d385e90f16d4417caf08858e5d09a67e80417.svg`: passed locally with `content-type: image/svg+xml; charset=utf-8`.

## Deployment Notes

- Live target: https://posterproof087.colmena.dev
- Health paths: `/health` and `/api/health`, provided by `scripts/server.mjs`.
- Dokploy network: `dokploy-network` external network in `docker-compose.yml`.
- Bun server target port in `docker-compose.yml`: 9876.
- Docker install skips lifecycle scripts so the `lefthook install` prepare hook does not require `git` inside the Bun build image.

## Proof Artifact

- **Asset address:** `6KULRE8pLP9bRQpMohd72hiHGdBZoJfUxTDArHPmxzuR`
- **Transaction signature:** `5CDQCAdEbWhSn895Qes9CTDxJAswZXpPKtt5kRdFQY8xUViwBtfwgsHEB3b3sHdnuj7xAeEn9iY5jy1AnsFWkB6s`
- **Metadata URI:** `https://posterproof087.colmena.dev/metadata/436e0fa35a7473128ea1854dc256611a084d3d2f925402aa2ae354ef6f87eddf.json`
- **Blocker status:** none for the requested devnet proof mint.
