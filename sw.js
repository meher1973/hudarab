const CACHE = 'hudarab-v1';
const FILES = [
  '/hudarab/',
  '/hudarab/index.html',
  '/hudarab/manifest.json',
  '/hudarab/icon-192.png',
  '/hudarab/icon-512.png'
];

// Installation — met en cache les fichiers
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

// Activation — supprime les anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

// Fetch — répond depuis le cache si hors ligne
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Si connecté : met à jour le cache
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
