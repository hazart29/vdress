// sw.js

const CACHE_NAME = 'VD-Cache';
const urlsToCache = [
  '/',
  '/offline',
  // '/main',
  // '/manifest.json',
  // '/ui/btn_gacha.svg',
  // '/ui/btn_home.svg',
  // '/ui/btn_outfit.svg',
  // '/ui/iconVD.svg',
  // '/ui/btn_room.svg',
  // '/ui/logo.svg',
  // '/ui/logoVD.svg',
  // '/video/gacha.mp4',
  // '/banner/banner_seifuku.webp',
  // '/background/bgroom.svg',
  // '/background/bubbles.svg',
  // '/next.svg',
  // '/vercel.svg',
  // Tambahkan rute lain yang ingin Anda precache di sini
];

// Install service worker
// Install service worker
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  event.waitUntil(
    // Tambahkan delay dengan setTimeout
    new Promise((resolve) => {
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
