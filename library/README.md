# Phoenixi Library

A browser-local writing and world library. No AI service, account, subscription, or wallet is required. New libraries start empty; authored material stays in this browser on this device.

## Use

Create a project, add world records, write stories and scenes, collect notes, and review quoted passages into linked lore. Timeline events, maps, assets, bookmarks, and templates belong to the selected project. Changes require their Save action; heed any unsaved-change warning.

Download regular JSON backups through **Backup / Export**. Clearing browser data deletes the local library. Different browsers, devices, and site addresses have separate storage: export from the old address and restore at the new one. A checked full-library restore replaces all projects and downloads the current library first. Raw recovery exports preserve damaged storage for manual recovery; they are not normal restore files.

This edition has no cloud sync, shared database, login, payment collection, or protected-content delivery. Embedded images are limited to 750 KB each and the whole library is subject to browser storage limits. A failed save displays an error and does not report success.

## Development

Node.js 22 or newer. Run `npm ci`, then `npm run dev`. For a production preview run `npm run build` then `npm start` (localhost:3000). Checks: `npm run lint`, `npm test`, `npm run build`, `npm run check:independence`.

The deployed source lives in `G:/Phoenixi-Studios-Main/library`; the site workflow builds it into `/library/`. Only compiled application assets are published, never local writing, backups, audit evidence, or archives.

## Membership and WAX infrastructure

There are no approved tiers, perks, qualifying collections/templates, or access rules yet. `src/services/access.ts` contains inactive rule evaluation and a configurable read-only AtomicAssets adapter. No provider endpoint is configured or contacted by the application.

Before activating access, implement trusted server authentication, signed wallet proof, server-side membership verification/webhook handling, expiry/revocation, and protected delivery. Client-side flags cannot enforce paid or private access. WAX evidence must match the approved network, account, collection/schema/template and fresh ownership; failures deny access. Do not embed credentials in this static app.

Research references: [WharfKit login](https://wharfkit.com/docs/session-kit/login), [WAX WharfKit](https://docs.wax.io/build/developing-apps/sdks/wharfkit/), [AtomicAssets API](https://github.com/atomicassets/atomicassets-api), [Fourthwall FAQ](https://fourthwall.com/faq). These establish integration options, not approved Phoenixi perks.

## IXI interface

Uses the supplied Ironick display face, local Josefin Sans for reading, the Studio crest and the exact IXI palette. Controls keep interface typography. Navigation uses the Studio curtain choreography (desktop 1400 ms close, 400 ms settle, 2200 ms reveal; mobile 520 ms close and 900 ms reveal). System reduced-motion preferences are respected, with no in-app motion toggle. The editor supports Ctrl/Cmd+S to save and Escape to leave focus mode. Storage formats and membership/WAX configuration are unchanged by the visual migration.
