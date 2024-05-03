// Import Workbox library
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

// Check if Workbox was loaded successfully
if (workbox) {
  console.log('Workbox loaded successfully');

  // Precache assets for the /app route
  workbox.precaching.precacheAndRoute([
    // Precache the HTML page for the /app route
    //{ url: '/', revision: null }, // Add the revision hash if you want to cache-bust

    // Precache other assets (e.g., JavaScript, CSS, images) used in the /app route
    // For example:
    { url: '/offline', revision: null },
    { url: '/main', revision: null },
    // Add other assets here
  ]);

  // Define a route for the offline page
  // (assuming you have an offline page stored at /offline)
  workbox.routing.registerRoute(
    // Match all navigation requests
    ({ event }) => event.request.mode === 'navigate',
    // Handler function
    async ({ event }) => {
      try {
        // Fetch the offline page
        const offlineResponse = await caches.match('/offline');
        if (offlineResponse) {
          // If offline page found in cache, return it
          return offlineResponse;
        } else {
          // If offline page not found in cache, return a generic offline message
          return new Response('You are offline. Please check your internet connection.');
        }
      } catch (error) {
        // Return a generic offline message in case of errors
        return new Response('You are offline. Please check your internet connection.');
      }
    }
  );

  // Tambahkan penanganan khusus untuk permintaan manifest.json
  workbox.routing.registerRoute(
    // Memastikan hanya permintaan ke manifest.json yang ditangani
    ({ request }) => request.destination === 'manifest',
    // Handler function
    async ({ event }) => {
      try {
        // Fetch the manifest.json file
        const manifestResponse = await fetch('/manifest.json');
        if (manifestResponse.ok) {
          // Jika manifest.json ditemukan, kembalikan responsnya
          return manifestResponse;
        } else {
          // Jika manifest.json tidak ditemukan, kembalikan pesan error
          return new Response('Manifest not found', { status: 404 });
        }
      } catch (error) {
        // Jika terjadi kesalahan saat mengambil manifest.json, kembalikan pesan error
        return new Response('Error fetching manifest', { status: 500 });
      }
    }
  );

  // Tambahkan fetch untuk endpoint tertentu
  self.addEventListener('fetch', (event) => {
    // Pastikan permintaan hanya untuk endpoint tertentu yang ingin Anda tangani
    if (event.request.url.includes('/api/data')) {
      event.respondWith(
        // Lakukan fetch ke endpoint
        fetch(event.request)
          .then((response) => {
            // Jika respons berhasil, kembalikan respons tersebut
            return response;
          })
          .catch((error) => {
            // Jika terjadi kesalahan, kembalikan pesan error
            return new Response('Error fetching data', { status: 500 });
          })
      );
    }
  });

  // Activate the service worker immediately after installation
  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });

  // Handle other requests with a network-first strategy
  workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst());

  // Add your existing Workbox routing and caching logic here
} else {
  console.log('Workbox failed to load');
}
