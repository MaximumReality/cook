const CACHE_NAME = 'harira-quest-v4.6'; 
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

// INSTALL: Add missing files and update changed ones
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('Stocking the digital pantry...');
      const cachedRequests = await cache.keys();
      const cachedUrls = cachedRequests.map(req => req.url.split('/').pop());

      // Identify missing files
      const missingAssets = ASSETS_TO_CACHE.filter(asset => !cachedUrls.includes(asset));

      // Add missing files
      await cache.addAll(missingAssets);

      // Refresh existing cached files (force network check)
      await Promise.all(
        ASSETS_TO_CACHE.map(async (asset) => {
          try {
            const response = await fetch(asset, { cache: 'no-cache' });
            if (response.ok) {
              await cache.put(asset, response.clone());
            }
          } catch (err) {
            console.warn('Failed to refresh asset:', asset, err);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

// ACTIVATE: Delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => 
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Cleaning the kitchen floor:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// FETCH: Pages → network first, Assets → cache first
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request) || caches.match('404.html'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
