const CACHE_NAME = 'harira-quest-v5.7'; 
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
  'insecticide.mp4',
  'needs-flavor.mp4',
  'quantum-demand.mp4',
  
  // Audio
  'arcade-games-neon-munch.mp3',
  'funny-arcade-game.mp3',
  'ready-to-play.mp3',
  'that-8-bit-music.mp3'
];

self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      let loaded = 0;
      const total = ASSETS_TO_CACHE.length;

      for (const url of ASSETS_TO_CACHE) {
        try {
          // Use fetch with a 'no-cache' mode to ensure we get fresh files
          const response = await fetch(url, { cache: 'no-cache' });
          if (!response.ok) throw new Error(`Offline sync failed for: ${url}`);
          await cache.put(url, response);
          
          loaded++;
          
          // Report progress to index.html
          const allClients = await self.clients.matchAll({ includeUncontrolled: true });
          allClients.forEach(client => {
            client.postMessage({
              type: 'PROGRESS',
              loaded: loaded,
              total: total,
              file: url
            });
          });
        } catch (err) {
          console.warn('Azul Warning: Resource skipped ->', url);
        }
      }

      const finalClients = await self.clients.matchAll({ includeUncontrolled: true });
      finalClients.forEach(client => client.postMessage({ type: 'CACHE_COMPLETE' }));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
