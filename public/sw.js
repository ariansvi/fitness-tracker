// Tiny offline service worker: stale-while-revalidate for everything.
// Caches each GET response as it's fetched, so after the first online load
// the app keeps working offline. No build-time asset list to maintain.
const CACHE = 'showup-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') cache.put(request, res.clone());
          return res;
        })
        .catch(async () => {
          // Offline: for page navigations fall back to the cached app shell.
          if (request.mode === 'navigate') {
            const shell = await cache.match(new URL('./', self.registration.scope).href);
            if (shell) return shell;
          }
          return cached;
        });
      return cached || network;
    }),
  );
});
