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
| 02:18 | Updated `@obrera/mpl-core-kit-lib` to `0.0.3`, verified generated `getCreateV1Instruction` returns real account metas/data, and minted a devnet MPL Core proof asset. |

## Validation Log

- `bun add --minimum-release-age=0 @obrera/mpl-core-kit-lib@0.0.3`: passed; the flag was needed because this repo's `bunfig.toml` blocks packages newer than five days by default.
- `node_modules/@obrera/mpl-core-kit-lib/package.json`: confirmed installed published version is `0.0.3`.
- Public import check for `@obrera/mpl-core-kit-lib/generated`: `getCreateV1Instruction` returned program `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`, 8 account metas, and 74 data bytes.
- `bun run lint:fix`: passed.
- `bun run check-types`: passed.
- `bun run build`: passed.
- `POSTERPROOF_DEVNET_SIGNER_KEYPAIR=/home/obrera/keys/obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G.json POSTERPROOF_SKIP_AIRDROP=1 bun run proof:mint`: passed with `{"assetAddress":"3DMxLph3G2Ud8JsHPkRBj1epK87KkRCLxGN1e7o6sBf1","metadataUri":"https://posterproof087.colmena.dev/metadata/739888e9f3d55502a823707b83cda0085a615935dfa4b32a421ce1ca7ac8d3db.json","ok":true,"payerAddress":"obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G","txSignature":"4Bd5QAp1s5AW9BpjNXbGkXQaPG9cdGvL2FBA5uzJ5vhaX5n8t8gvpG7LXXJG2gUKM1bA9qqqHqvjqFw1wns4DN7i"}`.
- Guard search for forbidden source dependency/import names in `package.json`, `bun.lock`, `src`, and `scripts`: passed with no forbidden app/server imports.

## Deployment Notes

- Live target: https://posterproof087.colmena.dev
- Static health path: `/__/health`, provided by `beeman/static-server`.
- Dokploy network: `dokploy-network` external network in `docker-compose.yml`.
- Static server target port in `docker-compose.yml`: 9876.
- Docker install skips lifecycle scripts so the `lefthook install` prepare hook does not require `git` inside the Bun build image.

## Proof Artifact

- **Asset address:** `3DMxLph3G2Ud8JsHPkRBj1epK87KkRCLxGN1e7o6sBf1`
- **Transaction signature:** `4Bd5QAp1s5AW9BpjNXbGkXQaPG9cdGvL2FBA5uzJ5vhaX5n8t8gvpG7LXXJG2gUKM1bA9qqqHqvjqFw1wns4DN7i`
- **Metadata URI:** `https://posterproof087.colmena.dev/metadata/739888e9f3d55502a823707b83cda0085a615935dfa4b32a421ce1ca7ac8d3db.json`
- **Blocker status:** none for the requested devnet proof mint.
