"use strict";
/// <reference lib="WebWorker" />
// export default null
// declare let self: ServiceWorkerGlobalScope
const PRECACHE = 'precache-v1';
// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    './',
    'index.html',
    'code.js',
    'manifest.json',
    'styles/style.css',
    'styles/svg-icons-animate.css',
    'images/favicon.ico',
    'images/android-chrome-192x192.png',
    'images/android-chrome-512x512.png',
    'images/coin.png',
    'images/click.png'
];
// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(PRECACHE_URLS))
        .then(() => self.skipWaiting()));
});
// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE];
    event.waitUntil(caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
        }));
    }).then(() => self.clients.claim()));
});
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (cachedResponse) {
        return cachedResponse || fetch(event.request);
    }));
});
