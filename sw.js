const CACHE_NAME = 'badr-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/game.js',
  '/data.js',
  '/audio.js',
  '/icon.png',
  '/manifest.json'
];

// تثبيت Service Worker والتخزين المؤقت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll error:', err);
          // لا نرمي خطأ، نترك التطبيق يعمل حتى بدون تخزين مؤقت كامل
        });
      })
  );
  self.skipWaiting();
});

// تنشيط Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استراتيجية التخزين المؤقت: حاول الشبكة أولاً، ثم الذاكرة المؤقتة
self.addEventListener('fetch', event => {
  // تجاهل الطلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // لا نخزن مؤقتاً الاستجابات غير الناجحة
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // نسخ الاستجابة
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // إذا فشل الطلب، حاول الحصول على النسخة المخزنة مؤقتاً
        return caches.match(event.request)
          .then(response => {
            return response || new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});
