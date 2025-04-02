const CACHE_NAME = 'site-cache-v1';
const OFFLINE_URL = '/offline.html';
const INDEX_URL = '/index.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([OFFLINE_URL, INDEX_URL]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(OFFLINE_URL);
            })
    );
});
