// Guarda o app para abrir sem internet. Dados ficam no Supabase; aqui só os arquivos do app.
const V = 'fmg-v1';
const ARQ = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'libs/supabase.js', 'libs/jspdf.umd.min.js', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(ARQ)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Supabase, fontes: direto da rede
  // rede primeiro (pega versão nova); se estiver sem internet, usa a cópia guardada
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(V).then(ca => ca.put(e.request, c)); } return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html'))));
});
