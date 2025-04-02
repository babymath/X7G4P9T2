const CACHE_NAME = 'offline-cache-v3'; const URLS_TO_CACHE = [ '/', '/offline.html', '/index.html', ];

 self.addEventListener('install', event => { self.skipWaiting(); // Activate immediately event.waitUntil( caches.open(CACHE_NAME).then(cache => { console.log('Opened cache'); return cache.addAll(URLS_TO_CACHE).catch(error => { console.error('Failed to cache resources:', error); }); }) ); });

 self.addEventListener('fetch', event => { if (event.request.method !== 'GET') return;

event.respondWith(
    caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request).catch(() => {
            return caches.match('/offline.html');
        });
    })
);

});

// Activate event self.addEventListener('activate', event => { self.clients.claim(); // Take control of all clients

event.waitUntil(
    caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                }
            })
        );
    })
);

});

// Register Service Worker if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/service-worker.js') .then(registration => { console.log('Service Worker registered with scope:', registration.scope); }) .catch(error => { console.error('Service Worker registration failed:', error); }); }

