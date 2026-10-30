// GSEB Mathematics Learning Engine - Service Worker
const CACHE_NAME = 'gseb-maths-core-v1';
const CHAPTERS_CACHE_NAME = 'gseb-chapters-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== CHAPTERS_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-first for dynamic navigation, Cache-first for static fonts and KaTeX
  if (url.pathname.includes('/katex/') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.svg')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((c) => c.put(event.request, resClone));
            }
            return networkRes;
          })
        );
      })
    );
    return;
  }

  // Default stale-while-revalidate for app shell
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, resClone));
          }
          return networkRes;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

// Handle offline chapter caching messages
self.addEventListener('message', async (event) => {
  if (!event.data) return;

  if (event.data.type === 'CACHE_CHAPTER') {
    const { chapterNumber, items } = event.data;
    try {
      const chapterCache = await caches.open(CHAPTERS_CACHE_NAME);
      const fakeUrl = `/api/offline/chapter-${chapterNumber}`;
      const response = new Response(JSON.stringify(items), {
        headers: { 'Content-Type': 'application/json' },
      });
      await chapterCache.put(fakeUrl, response);
      event.ports[0].postMessage({ success: true, chapterNumber });
    } catch (err) {
      event.ports[0].postMessage({ success: false, error: String(err) });
    }
  }

  if (event.data.type === 'DELETE_CHAPTER') {
    const { chapterNumber } = event.data;
    try {
      const chapterCache = await caches.open(CHAPTERS_CACHE_NAME);
      const fakeUrl = `/api/offline/chapter-${chapterNumber}`;
      await chapterCache.delete(fakeUrl);
      event.ports[0].postMessage({ success: true });
    } catch (err) {
      event.ports[0].postMessage({ success: false, error: String(err) });
    }
  }
});
