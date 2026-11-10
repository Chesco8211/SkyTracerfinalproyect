/* Service Worker SkyTracer
   Estrategia "network-first": siempre pide la versión nueva al servidor.
   La caché solo se usa como respaldo si no hay conexión (modo offline).
   Así tus cambios con "Go Live" siempre se ven de inmediato. */

const CACHE_NAME = 'skytracer-v3';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Si un archivo no existe, no rompe toda la instalación
      return Promise.all([
        './',
        './index.html',
        './style.css',
        './script.js',
        './manifest.json'
      ].map((url) => cache.add(url).catch(() => null)));
    })
  );
});

self.addEventListener('activate', (e) => {
  // Borra las cachés viejas (skytracer-v2, v1, etc.)
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Solo peticiones GET del mismo origen (deja pasar YouTube, Unsplash, etc.)
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Guarda una copia fresca en caché para uso offline
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        return response;
      })
      .catch(() => {
        // Sin conexión: sirve lo que haya en caché
        return caches.match(e.request).then((cached) => {
          return cached || caches.match('./index.html');
        });
      })
  );
});
