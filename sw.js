const CACHE_NAME = 'harira-quest-v4'; 
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'stage1.html',
  'stage2.html',
  'stage3.html',
  'stage4.html',
  'victory.html',
  'manifest.json',
  'README.md',
  'LICENSE',
  
  // Favicon & Portraits
  'mochkil-harira.PNG',  // Favicon & Thumbnail
  'mochkil-harira.png',  // Game Sprite
  'azul-hacker.png',
  'azul-insight.png',
  
  // Environment & Props
  'cyber-kitchen-bg.PNG',
  'bowl.png',
  'bowl-with-soup.png',
  'garlic.png',
  'chickpeas.png',
  'lentil.png',
  'ladle.png',
  
  // Audio
  'arcade-games-neon-munch.mp3',
  'funny-arcade-game.mp3',
  'ready-to-play.mp3',
  'that-8-bit-music.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Stocking the digital pantry...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Cleaning the kitchen floor:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
