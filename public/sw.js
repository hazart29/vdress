// sw.js

const CACHE_NAME = 'VD-Cache';
const urlsToCache = [
  '/offline',
  '/outfit/A/MaidA.png',
  '/outfit/A/MikoA.png',
  '/outfit/A/seifukuA.png',
  '/outfit/A/policeA.png',
  '/outfit/B/MaidB.png',
  '/outfit/B/MikoB.png',
  '/outfit/B/seifukuB.png',
  '/outfit/B/policeB.png',
  '/outfit/C/MaidC.png',
  '/outfit/C/MikoC.png',
  '/outfit/C/seifukuC.png',
  '/outfit/C/policeC.png',
  '/icons/outfit/A/MaidA.png',
  '/icons/outfit/A/MikoA.png',
  '/icons/outfit/A/seifukuA.png',
  '/icons/outfit/A/policeA.png',
  '/icons/outfit/B/MaidB.png',
  '/icons/outfit/B/MikoB.png',
  '/icons/outfit/B/seifukuB.png',
  '/icons/outfit/B/policeB.png',
  '/icons/outfit/C/MaidC.png',
  '/icons/outfit/C/MikoC.png',
  '/icons/outfit/C/seifukuC.png',
  '/icons/outfit/C/policeC.png',
  '/avatar/model.png',
  '/backsound/backsound.mp3',
  '/background/shop/3d-fantasy-scene.svg',
  // Tambahkan URL lain yang ingin Anda precache di sini
];

// Tentukan apakah aplikasi berada dalam mode pengembangan atau produksi
const isDevelopment = true; // Ganti dengan logika sesuai dengan kebutuhan Anda

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())   
 // Activate immediately
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
    .then(() => self.clients.claim())
 // Claim control
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  // Exclude API requests from service worker handling
  if (event.request.url.includes('/api/')) {
    console.log('api route excessed');
    return fetch(event.request); // Directly fetch from network
  }

  if (isDevelopment) {
    console.log('Development mode: bypassing service worker');
    return fetch(event.request); // Directly fetch from the network
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache   => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            return caches.match('/offline');   
 
          });
      })
  );
});