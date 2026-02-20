const CACHE_NAME = 'harira-quest-v5'; 
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE).then(() => {
          // Notify the UI that we are ready for airplane mode
          self.clients.matchAll().then(clients => {
              clients.forEach(client => client.postMessage({type: 'CACHE_COMPLETE'}));
          });
      });
    })
  );
  self.skipWaiting();
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
  // Fix for iOS Video/Audio Range Requests
  if (event.request.url.match(/\.(mp4|mp3)$/)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(res => {
          return res; // Fallback to network
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
  }
});
