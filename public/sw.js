// sw.js

const CACHE_NAME = 'VD-Cache';
const urlsToCache = [
  '/offline',
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
  '/banner/banner_seifuku.webp'
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
