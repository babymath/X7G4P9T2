const CACHE_NAME = 'offline-cache-v1';
const URLS_TO_CACHE = [
    './',
    './offline.html',
    './index.html',
    './.js',
    './game/gameJS/1-addition.js',
    './game/gameJS/2-subtraction.js',
    './game/gameJS/3-multiplication.js',
    './game/gameJS/4-table-practice.js',
    './game/gameJS/5-lightning-sum.js',
    './game/gameJS/6-number←roman.js',
    './game/gameJS/7-number←word.js',
    './game/css-js/game.css',
    './game/css-js/game0.js',
    './game/css-js/game1.js',
    './game/css-js/game2.js',
    './game/index.html',
    './profile/index.html',
    './profile/profile.css',
    './profile/profile.js'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => caches.match('./offline.html'))
    );
});

// Activate event
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
