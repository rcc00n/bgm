# Historical BGM holding page

This repository contains an earlier static holding page (`index.html`) and its identity asset. It does not contain the current scheduling/CRM application and should not be presented as that full system.

For the separately maintained application source, see [bgm_crm](https://github.com/rcc00n/bgm_crm). Original files remain available as historical work.

## Historical Netlify host

The Netlify Edge handler retires **only** `quiet-malabi-cb1fd5.netlify.app` and its `--quiet-malabi-cb1fd5.netlify.app` preview/branch aliases with HTTP 410 and noindex. All other hostnames use `context.next()` and retain the original static page and logo byte-for-byte. In particular, this configuration never assigns the retirement response to `badguymotors.com` or `www.badguymotors.com`.

No DNS, custom-domain settings, protected BGM application, or provider account settings are changed. See [retirement scope, verification and rollback](docs/netlify-retirement.md). Original source hashes are preserved in [the payload manifest](docs/netlify-original-payload.json).
