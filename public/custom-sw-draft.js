// Custom Service Worker implementation
// This file is unused by next-pwa by default unless configured,
// but laying it out here in case we need to switch strategies.

const CACHE_NAME = "app-cache-v1";
const OFFLINE_URL = "/offline";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        OFFLINE_URL
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// This is just a snippet; next-pwa's logic is much more complex (handling build manifest, etc.)
