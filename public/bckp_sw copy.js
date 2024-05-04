const CACHE_VERSION = 'v1';
const CACHE_NAME = `${CACHE_VERSION}:offline`;
const ALL_URL = [
  '/offline',
  '/main',
  '/',
];
const OFFLINE = '/offline'; 

self.addEventListener('install', (event) => {
  // Check if the environment is not development
  if (self.location.hostname !== 'localhost' && self.location.protocol === 'https:') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          // Pre-cache offline page
          cache.addAll([OFFLINE]);
          // Pre-cache other URLs
          return cache.addAll(ALL_URL.filter(url => url !== OFFLINE));
        })
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
          return caches.match(OFFLINE);
        })
    );
  } else if (event.request.method !== 'POST') {
    event.respondWith(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.match(event.request)
            .then((response) => {
              return response || fetch(event.request)
                .then((networkResponse) => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                })
                .catch(() => {
                  return caches.match(OFFLINE);
                });
            });
        })
    );
  }
});
