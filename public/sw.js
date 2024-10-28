// sw.js

const CACHE_NAME = 'VD-Cache';
const urlsToCache = [
  '/offline',
  '/outfit/A/maidA.svg',
  '/outfit/A/mikoA.svg',
  '/outfit/A/seifukuA.svg',
  '/outfit/A/policeA.svg',
  '/outfit/B/maidB.svg',
  '/outfit/B/mikoB.svg',
  '/outfit/B/seifukuB.svg',
  '/outfit/B/policeB.svg',
  '/outfit/C/maidC.svg',
  '/outfit/C/mikoC.svg',
  '/outfit/C/seifukuC.svg',
  '/outfit/C/policeC.svg',
  
  '/icons/outfit/A/maidA.svg',
  '/icons/outfit/A/mikoA.svg',
  '/icons/outfit/A/seifukuA.svg',
  '/icons/outfit/A/policeA.svg',
  '/icons/outfit/B/maidB.svg',
  '/icons/outfit/B/mikoB.svg',
  '/icons/outfit/B/seifukuB.svg',
  '/icons/outfit/B/policeB.svg',
  '/icons/outfit/C/maidC.svg',
  '/icons/outfit/C/mikoC.svg',
  '/icons/outfit/C/seifukuC.svg',
  '/icons/outfit/C/policeC.svg',

  '/avatar/model.svg',
  '/ui/btn_gacha.svg',
  '/ui/btn_home.svg',
  '/ui/btn_outfit.svg',
  '/ui/btn_room.svg',
  '/ui/iconVD.svg',
  '/ui/logo.svg',
  '/ui/logoVD.svg',
  '/video/gacha.mp4',
  '/backsound/backsound.mp3',
  '/background/shop/3d-fantasy-scene.svg',
  '/banner/banner_seifuku.webp'
  // Tambahkan URL lain yang ingin Anda precache di sini
];

// Tentukan apakah aplikasi berada dalam mode pengembangan atau produksi
const isDevelopment = false; // Ganti dengan logika sesuai dengan kebutuhan Anda

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
    console.log('development mode sw disabled')
    return;
  } else {
    // Semua permintaan, termasuk API, langsung diteruskan ke server
    // Tidak ada caching
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline');
        })
    );
  }
});
