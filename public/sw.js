const CACHE_VERSION = 'v1';
const CACHE_NAME = `${CACHE_VERSION}:offline`;
const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
  // Cek apakah environment bukan development
  if (self.location.hostname !== 'localhost' && self.location.protocol === 'https:') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll([OFFLINE_URL]))
        .then(() => self.skipWaiting())
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate' ||
    (event.request.method === 'GET' &&
      event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});
