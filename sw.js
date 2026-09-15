// Riwaayat Royale — Service Worker for PWA Offline Performance
const CACHE_NAME = 'riwaayat-royale-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './haldi.html',
  './mehendi.html',
  './sangeet.html',
  './wedding.html',
  './reception.html',
  './anniversary.html',
  './festive.html',
  './lehengas.html',
  './gowns.html',
  './shararas.html',
  './indowestern.html',
  './product.html',
  './manifest.json',
  './css/main.css',
  './css/components.css',
  './css/amazon.css',
  './js/data.js',
  './js/app.js',
  './js/amazon-home.js',
  './js/product-detail.js',
  './assets/branding/logo-main.svg',
  './assets/branding/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Some initial PWA assets failed to pre-cache:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache successful image or static asset loads dynamically
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.includes('/assets/') ||
           event.request.url.match(/\.(png|jpg|jpeg|webp|svg)$/i))
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
