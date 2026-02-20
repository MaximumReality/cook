const CACHE_NAME = 'harira-quest-v5.1'; 
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  '404.html',
  'stage1.html',
  'stage2.html',
  'stage3.html',
  'stage4.html',
  'victory.html',
  'manifest.json',
  
  // Favicon & Portraits
  'mochkil-harira.PNG',  // Favicon
  'mochkil-harira.png',  // Game Sprite
  'mochkil-harira1.PNG', // Thumbnail
  'azul-hacker.png',
  'azul-loading.PNG',
  'azul-insight.png',
  
  // Environment & Props
  'cyber-kitchen-bg.PNG',
  'bowl.png',
  'bowl-with-soup.png',
  'garlic.png',
  'chickpeas.png',
  'lentil.png',
  'ladle.png',

  // Video
  'mission-victory.mp4',
  
  // Audio
  'arcade-games-neon-munch.mp3',
  'funny-arcade-game.mp3',
  'ready-to-play.mp3',
  'that-8-bit-music.mp3'
];

// INSTALL: Cache everything and then notify the UI
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Azul is encrypting the pantry...');
      return cache.addAll(ASSETS_TO_CACHE).then(() => {
        // This is the magic part that hides your loading screen!
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_COMPLETE' });
          });
        });
      });
    })
  );
  self.skipWaiting();
});

// ACTIVATE: Standard cleanup
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  return self.clients.claim();
});

// FETCH: Standard logic with your 404 fallback
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request) || caches.match('404.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
  }
});
