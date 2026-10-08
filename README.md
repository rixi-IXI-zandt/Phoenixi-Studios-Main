# IXI / Phoenixi Studios

Static HTML, CSS and JavaScript, using the supplied IXI artwork, palette and local Ironick font. About contains Rixi's approved Studio and personal biographies. Worlds deliberately retains empty project frames. No database, API keys, paid runtime or installed application dependencies are needed.

## Local preview and checks

Use Node.js 22 LTS or newer (minimum supported: 20).

- `npm run dev` previews source at http://127.0.0.1:3000.
- `npm run lint` checks JavaScript syntax.
- `npm test` checks generated routes, asset paths and the public-asset boundary at the root and two nested paths. It restores the requested build at the end.
- `npm run build` recreates `dist/`. Do not keep hand-edited files in that generated folder.
- `npm start` serves the actual `dist/` files at http://127.0.0.1:3000, without a single-page fallback that could hide broken links.

Set `PORT` if another preview is running. `HOST` defaults to local-only `127.0.0.1`.

For a subdirectory deployment, set `BASE_PATH=/studio/` when building and when running the production preview. On PowerShell: `$env:BASE_PATH='/studio/'; npm run build; npm start`. Remove the environment variable to return to the root: `Remove-Item Env:BASE_PATH`. GitHub's workflow detects this automatically.

## GitHub Pages

1. This site's repository is [rixi-IXI-zandt/Phoenixi-Studios-Main](https://github.com/rixi-IXI-zandt/Phoenixi-Studios-Main). Keep only site files at its root, not the whole G drive. GitHub Free supports Pages from **public** repositories; check privacy before uploading.
2. Include `index.html`, `js/`, `css/`, `build.mjs`, `server.mjs`, `scripts/`, `package.json`, `package-lock.json`, `.gitignore`, `.github/workflows/pages.yml` and the four assets named in `build.mjs`. Do not upload the old ZIP, backups, unrelated artwork, private research or credentials. A public repository exposes source files even if they are excluded from the deployed `dist/`.
3. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
4. Push to the repository's default branch, or run **Deploy static site to GitHub Pages** manually from Actions. The workflow checks, builds and publishes only `dist/`.
5. Test all four routes on the provided GitHub address before attaching the domain. Direct visits, reloads, trailing-slash routes and legacy `.html` routes are supported.

No server process runs on GitHub Pages. Node is only used during the build. There is no `npm install` step because this project has no dependencies.

## rixi.info and the wider IXI family

`rixi.info` is the intended shared domain for Rixi, IXI and Phoenixi Studios. This build does not impose a permanent structure on that family. It supports the apex domain, a subdomain, or a path such as `/studio/`.

Before launch, decide whether this Studio experience is the first home at `rixi.info`, or belongs at a Studio address beneath a future shared home. No DNS records or live hosting have been changed.

For a GitHub Pages custom domain:

1. Verify domain ownership in GitHub and inspect existing DNS first. Preserve mail (MX), verification (TXT) and unrelated service records.
2. Set the chosen hostname in repository **Settings → Pages → Custom domain**. For an Actions deployment, a CNAME file is not a substitute for this setting.
3. Follow GitHub's current provider-specific guidance for apex A/ALIAS/ANAME records or a subdomain CNAME. Do not use wildcard DNS. Configure `www` only if wanted.
4. Rerun the workflow after changing the custom domain so the output uses its new base path. Enable **Enforce HTTPS** when the certificate is ready.
5. Check HTTPS, redirects, direct links, assets and navigation again on the real domain.

Official references: [GitHub Pages workflow and plan support](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [custom domain configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

## Other static hosts

The same `dist/` can be uploaded to a static host. For Cloudflare Pages use no framework preset, build command `npm run build`, output directory `dist`, and `BASE_PATH=/` (or leave it unset). Alternatively build locally and upload the contents of `dist`. See [Cloudflare's static HTML guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/). Account, DNS and plan setup remain separate from these local files.

## Behaviour and boundaries

The animated interface requires JavaScript; a no-script email fallback is provided. Layout follows viewport width/height, and fine pointers enable subtle light response. System reduced motion takes precedence over the saved motion toggle. Internal navigation prepares images and fonts beneath the curtain, retains the previous page on failure, and supports browser history. Direct initial visits load like a normal static site. Future remote data must be awaited inside `prepareScene` before revealing the destination.

The existing email, Discord and Instagram destinations remain unchanged. No contact form, analytics, shop, account system or backend is implied. Check ownership and external-link availability before public launch. The original ZIP and the separately stored source backup are preserved locally, not included in the static build.

When adding new public assets, add their filenames to the explicit list in `build.mjs` and update the corresponding integrity check. See `HOSTING-CHECK.md` for the latest local verification scope and remaining launch steps.
