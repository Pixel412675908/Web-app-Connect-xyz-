const CACHE_NAME = 'portal-web-cache-v20';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://i.postimg.cc/gJzFByk5/file-0000000098b8720e9deb64f615033168.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Caching resources for offline access');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna o recurso do cache se disponível, senão busca na rede
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Se falhar rede e não estiver em cache, redireciona navegação para a home (offline mode)
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
  );
});