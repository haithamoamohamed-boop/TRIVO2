const C = 'trivo-v2';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== C).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET' || r.headers.has('range')) return; const u = new URL(r.url); if (u.pathname.endsWith('.mp4')) return;
  if (u.origin === location.origin && (r.mode === 'navigate' || u.pathname.endsWith('.html'))) {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); return res; }).catch(() => caches.match(r).then((m) => m || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { if ((res.status === 200) || res.type === 'opaque') { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); } return res; })));
});