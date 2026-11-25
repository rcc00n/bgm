// Dependency-free retirement endpoint. It never reads records or contacts a provider.
const document = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Historical demo retired</title></head><body><main><h1>This historical demo has been retired.</h1><p>The original source remains available in its repository for historical reference.</p></main></body></html>';
const historicalHostname = 'quiet-malabi-cb1fd5.netlify.app';
export default function retired(request, context) {
  const hostname = new URL(request.url).hostname.toLowerCase().replace(/\.$/, '');
  const isHistoricalNetlify = hostname === historicalHostname || hostname.endsWith('--' + historicalHostname);
  // Never retire a custom domain, even if Netlify still attaches it to this project.
  if (!isHistoricalNetlify) return context.next();
  return new Response(request.method === 'HEAD' ? null : document, {
    status: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    },
  });
}
