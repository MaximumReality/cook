const CACHE_NAME = 'cook-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/stage1.html',
  '/stage2.html',
  '/stage3.html',
  '/stage4.html',
  '/victory.html',
  '/8-bit-music.mp3',
  '/ready-to-play.mp3',
  '/arcade-games-neon-munch.mp3',
  '/mochkil-harira.png',
  '/azul-insight.png',
  '/chickpeas.png',
  '/lentil.png',
  '/garlic.png',
  '/bowl.png',
  '/ladle.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
