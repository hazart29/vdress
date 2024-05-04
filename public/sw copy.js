// sw.js

const CACHE_NAME = 'VD-Cache';
const urlsToCache = [
  '/',
  '/offline',
  '/main',
  // Tambahkan rute lain yang ingin Anda precache di sini
];

// Install service worker
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened');
      return cache.addAll(urlsToCache);
    })
    .then(() => self.skipWaiting())
  );
});

// Activate service worker
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
          return caches.match('/offline');
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
                  return caches.match('/offline');
                });
            });
        })
    );
  }
});

// Fetch event
// self.addEventListener('fetch', (event) => {
//   console.log('Fetch event fired:', event.request.url);
  
//   // Check if the request method is POST
//   if (event.request.method === 'POST') {
//     console.log('POST request, bypassing cache');
//     return fetch(event.request); // Bypass cache and directly fetch from the network
//   }

//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // If request is found in cache, return cached response
//       if (response) {
//         console.log('Cache hit:', event.request.url);
//         return response;
//       }
//       // If request is not found in cache, fetch from network
//       console.log('Cache miss. Fetching from network:', event.request.url);
//       return fetch(event.request);
//     }).catch(() => {
//       // If fetch fails, return the offline page
//       return caches.match('/offline');
//     })
//   );
// });
