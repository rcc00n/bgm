import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('netlify/edge-functions/retired.js', root), 'utf8');
const { default: retire } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const historicalHosts = ['quiet-malabi-cb1fd5.netlify.app', 'deploy-preview-1--quiet-malabi-cb1fd5.netlify.app', 'branch-name--quiet-malabi-cb1fd5.netlify.app', 'immutable-id--quiet-malabi-cb1fd5.netlify.app', 'QUIET-MALABI-CB1FD5.NETLIFY.APP.'];
const paths = ['/', '/index.html', '/deep/old/page', '/api/session', '/data/users.json', '/data/appointments.json', '/server.js', '/bgm_badguymotors_logo_invert.png', '/robots.txt', '/?query=unchanged'];
for (const hostname of historicalHosts) {
  for (const path of paths) {
    for (const method of ['GET', 'HEAD', 'POST']) {
      const response = await retire(new Request('https://' + hostname + path, { method }), { next() { throw new Error('Retired hostname reached original payload'); } });
      assert.equal(response.status, 410, `${hostname} ${method} ${path}`);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive');
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.equal(response.headers.get('location'), null);
      const body = await response.text();
      if (method === 'HEAD') assert.equal(body, ''); else assert.match(body, /This historical demo has been retired/);
    }
  }
}
const customHosts = ['badguymotors.com', 'www.badguymotors.com', 'BADGUYMOTORS.COM.', 'new-owner.example.test', 'quiet-malabi-cb1fd5.netlify.app.attacker.example', 'notquiet-malabi-cb1fd5.netlify.app'];
for (const hostname of customHosts) {
  for (const path of ['/', '/bgm_badguymotors_logo_invert.png', '/api/session']) {
    const original = new Response('unchanged synthetic origin body', { status: 202, headers: { 'Content-Type': 'image/png', 'X-Origin': 'unchanged' } });
    let calls = 0;
    const result = await retire(new Request('https://' + hostname + path), { next() { calls++; return original; } });
    assert.equal(calls, 1); assert.equal(result, original); assert.equal(result.status, 202);
    assert.equal(result.headers.get('x-robots-tag'), null); assert.equal(result.headers.get('content-type'), 'image/png');
    assert.equal(await result.text(), 'unchanged synthetic origin body');
  }
}
const manifest = JSON.parse(await readFile(new URL('docs/netlify-original-payload.json', root), 'utf8'));
assert.deepEqual((await readdir(new URL('ops/netlify-publish/', root))).sort(), Object.keys(manifest.files).sort());
for (const [name, digest] of Object.entries(manifest.files)) {
  for (const prefix of ['', 'ops/netlify-publish/']) assert.equal(createHash('sha256').update(await readFile(new URL(prefix + name, root))).digest('hex'), digest);
}
console.log('Retirement checks passed: 150 retired-host cases, 18 custom-host pass-through cases, exact original payload hashes.');
