import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('docs/netlify-original-payload.json', root), 'utf8'));
const directory = new URL('ops/netlify-publish/', root);
const allowed = ['index.html', 'bgm_badguymotors_logo_invert.png'];
if (JSON.stringify(Object.keys(manifest.files).sort()) !== JSON.stringify(allowed.sort())) throw new Error('Unexpected source payload');
for (const name of allowed) {
  const bytes = await readFile(new URL(name, root));
  if (createHash('sha256').update(bytes).digest('hex') !== manifest.files[name]) throw new Error(`Original payload changed: ${name}`);
}
await rm(directory, { recursive: true, force: true });
await mkdir(directory, { recursive: true });
for (const name of allowed) await copyFile(new URL(name, root), new URL(name, directory));
console.log('Prepared original static payload with matching source hashes.');
