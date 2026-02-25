const CACHE = "controle-km-v1";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./entregas.html",
        "./viagens.html",
        "./style.css",
        "./manifest.json",
        "./assets/logo.webp",
        "./assets/icon-192.png",
        "./assets/icon-512.png"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
