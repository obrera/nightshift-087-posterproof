# Nightshift Build 087: PosterProof

## Scorecard

- Semi-complex frontend-first Solana week app: complete.
- Use-case family: intellectual property provenance.
- Primary actor: independent creator preparing an artwork/poster/proof packet.
- Why NFT ownership matters: the creator mints a wallet-owned devnet MPL Core proof asset tied to a content hash and metadata URI, giving holders and verifiers portable timestamp/provenance evidence.
- Required flows: packet composer, originality/conflict scanner, wallet readiness signing plus MPL Core createV1 mint, operator review and proof gallery.

## Wallet-Signed Flow

1. The creator connects with wallet-ui.
2. PosterProof canonicalizes packet fields into sorted JSON and computes SHA-256 with WebCrypto/TextEncoder.
3. The scanner compares title, medium, trait overlap, hash prefix, evidence completeness, and rights clarity against a built-in reference registry.
4. The connected wallet signs a readiness declaration containing packet hash, metadata URI, JSON hash, and byte length.
5. The UI builds `getCreateV1Instruction` from `@obrera/mpl-core-kit-lib/generated` with the connected wallet as payer, authority, owner, and update authority.
6. The resulting local proof record stores asset address, tx signature, packet hash, metadata URI, timestamp, signature, and scan summary.

Minting is wallet-signed client-side only. No server mint path exists.

## Validation Log

- `node_modules/@obrera/mpl-core-kit-lib/package.json`: confirmed installed published version is `0.0.2` with only `./generated` exported.
- `node_modules/@obrera/mpl-core-kit-lib/generated/index.js`: inspected exported `getCreateV1Instruction`; it returns `accounts: []`, `data: new Uint8Array([0])`, and program address `CoREENxT1ttXcRQA7jJZxGzDrJr3e9Fp3uL5X1YvCxy`.
- `bun install`: passed and regenerated `bun.lock` after removing forbidden direct dependencies.
- `bun run lint:fix`: passed.
- `bun run check-types`: passed.
- `bun run build`: passed.
- `POSTERPROOF_DEVNET_SIGNER_KEYPAIR=/home/obrera/keys/obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G.json POSTERPROOF_SKIP_AIRDROP=1 bun run proof:mint`: returned `{"blocker":"@obrera/mpl-core-kit-lib@0.0.2 generated getCreateV1Instruction has no account metas; published package is a placeholder and cannot create an MPL Core asset.","ok":false,"stage":"build mpl core create instruction"}`.
- Guard search for forbidden dependency/import names in `package.json`, `bun.lock`, `src`, and `scripts`: passed with no matches.

## Deployment Notes

- Live target: https://posterproof087.colmena.dev
- Static health path: `/health`, provided by `public/health`.
- Dokploy network: `dokploy-network` external network in `docker-compose.yml`.

## Blockers

- A real devnet MPL Core proof cannot be completed with the currently published allowed dependency. `@obrera/mpl-core-kit-lib@0.0.2` is installed from npm, but its generated `getCreateV1Instruction` implementation is a placeholder with no account metas and placeholder data. Broadcasting it would not create an MPL Core asset, so `proof:mint` stops before sending a transaction.
- Forbidden direct dependencies from the prior recovery path were removed: no `@metaplex-foundation/*`, no `@solana/web3.js`, no wallet adapter package/import, and no Node `Buffer` use in app/server/proof code.
