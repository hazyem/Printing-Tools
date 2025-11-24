const CACHE_NAME = "large-format-calculator-v1";

// Get base path for GitHub Pages or local development
const getBasePath = () => {
  const path = self.location.pathname;
  if (path.includes("/Printing-Tools/")) {
    return "/Printing-Tools";
  }
  return "";
};

const basePath = getBasePath();
const urlsToCache = [
  `${basePath}/`,
  `${basePath}/index.html`,
  `${basePath}/css/styles.css`,
  `${basePath}/js/config.js`,
  `${basePath}/js/calculator.js`,
  `${basePath}/js/material-selector.js`,
  `${basePath}/js/ui.js`,
  `${basePath}/printer.png`,
  `${basePath}/manifest.json`,
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(
          urlsToCache.map((url) => new Request(url, { cache: "reload" }))
        );
      })
      .catch((error) => {
        console.error("Cache failed:", error);
        // Continue even if some files fail to cache
        return Promise.resolve();
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
