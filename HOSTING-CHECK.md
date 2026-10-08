# Hosting and site check — 6 October 2026

## Verified locally

- Syntax checks pass. Repeatable `npm test` checks pass for `/`, `/studio/` and `/ixi/studio/` builds.
- 60 browser checks passed against actual generated files served without an SPA fallback, covering root and `/studio/` hosting.
- Home, Worlds, About and Contact checked at 1440×900, 768×1024, 390×844, 320×568 and 844×390. No horizontal overflow, failed resource responses or uncaught page errors in that matrix.
- Direct route visits, directory redirects, `.html` compatibility routes, nested `index.html`, browser Back/Forward and reduced-motion navigation work.
- Current-page navigation is hidden. World's project frames expand. Both biographies retain their 7 and 9 paragraphs; the original 1254×1254 avatar loads.
- Delayed avatar loading holds the curtain over the previous page until ready. An intentionally failed avatar request retains Home and offers Retry. Removing the simulated failure and retrying reaches About successfully.
- Enlarged text at 200% on a 320-pixel viewport did not introduce horizontal overflow. Long biography sections reveal without requiring an unreachable percentage of their area to enter the viewport.
- Desktop/mobile About screenshots were visually inspected. Original artwork, palette and supplied biography text were not revised.
- Missing routes return an actual 404 with a working home link. Only four used assets enter the deployment output. Older generated output is rebuilt from source each time; local originals and the old archive remain untouched.

Browser automation used local Microsoft Edge (Chromium), not physical devices, Safari or Firefox. Viewport checks do not constitute testing every browser or assistive technology.

## Prepared, not deployed

The GitHub Pages workflow and setup guide are present. There is no Git repository configured in this folder yet, and the workflow has not run on GitHub. Repository setup, public-source review, domain placement, DNS, certificate issuance and live-domain verification still need to happen.

No online publishing or DNS changes were made. Existing external contact destinations were preserved; this check does not verify ownership, Discord invitation validity or availability behind external login screens.

Worlds is intentionally unfilled. The interface requires JavaScript and provides an email fallback without it. There is no form-processing backend. Initial direct visits use ordinary static-page loading; internal navigation performs the tested asset-readiness transition.
