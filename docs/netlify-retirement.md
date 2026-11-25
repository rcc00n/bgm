# Historical Netlify hostname retirement

This repository preserves the original holding page. The Edge handler returns HTTP 410 with a retirement message and noindex/no-store **only** when the request hostname is exactly `quiet-malabi-cb1fd5.netlify.app` or ends in `--quiet-malabi-cb1fd5.netlify.app` (its preview/branch/deploy aliases). No substring match is used.

For every other hostname, including `badguymotors.com` and `www.badguymotors.com`, the handler immediately calls `context.next()` without changing the response. There are no global custom headers or redirects. The publish directory contains the original `index.html` and logo, copied byte-for-byte; their SHA-256 values are pinned to original source commit d40704b5ee3e8b1746107a1ee13edab2e06a9d8a in `netlify-original-payload.json`. All local assets referenced by the original document are retained. External font/script references remain exactly as they were.

## Checks and publication

Run `node scripts/build_retirement.mjs && node scripts/check_retirement.mjs`. The check verifies retirement paths/methods, hostname boundaries, untouched custom-host response identity/headers/body, and exact source/output payload hashes. GitHub CI and Netlify builds use the same commands. The generated `ops/netlify-publish` directory is ignored by Git.

Verify a real Netlify Deploy Preview returns 410/noindex for root, old pages, API-looking paths and assets. After a separately authorized merge, verify the main historical Netlify hostname. Independently check apex and www of the current BGM domain remain unchanged. This configuration does not alter DNS or custom-domain attachments.

## Scope and rollback

This retires content on the named Netlify hostnames through the existing Git integration. It does not stop builds, unpublish/delete the Netlify project, remove old immutable deploys, revoke credentials, erase Git history, or change provider settings. Old immutable deployments built before this handler may remain accessible until an authenticated provider owner removes them. A stale custom-domain attachment is left intact and passed through safely.

Source rollback is a separately authorized revert and build; original files are retained. An authenticated owner can also restore a prior published deploy. Do not change a protected live site's DNS to point to this historical project.

References: [Netlify configuration precedence](https://docs.netlify.com/build/configure-builds/file-based-configuration/), [Edge response and context.next API](https://docs.netlify.com/build/edge-functions/api/), [deploy rollback](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/).
