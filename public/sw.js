// sw.js

const CACHE_NAME = 'VD-Cache';
const urlsToCache = [
  '/',
  '/offline',
  // Tambahkan URL lain yang ingin Anda precache di sini
];

// Tentukan apakah aplikasi berada dalam mode pengembangan atau produksi
const isDevelopment = true; // Ganti dengan logika sesuai dengan kebutuhan Anda

// Install service worker
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(
    new Promise((resolve) => {
      // Tambahkan delay dengan setTimeout
      setTimeout(() => {
        caches.open(CACHE_NAME).then((cache) => {
          console.log('Cache opened');
          resolve(cache.addAll(urlsToCache));
        });
      }, 5000); // Delay 5 detik
    })
    .then(() => self.skipWaiting())
  );
});

// Aktivasi service worker
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

// Fetch event
self.addEventListener('fetch', (event) => {
  if (isDevelopment) {
    // Jika dalam mode pengembangan, nonaktifkan Service Worker
    console.log('development mode sw disabled')
    return;
  } else if (event.request.mode === 'navigate' ||
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
