const CACHE_NAME = 'baemin-v1';
const APP_SHELL = [
  '/baemin-supabase-test/',
  '/baemin-supabase-test/index.html',
  '/baemin-supabase-test/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    }).then(function() {
      return self.skipWaiting();
    }).catch(function(err) {
      // 캐시 실패해도 설치는 계속
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // GET 요청만 처리
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    fetch(e.request).then(function(response) {
      // 네트워크 성공시 캐시에 저장 (정적 리소스만)
      if (response.ok && e.request.url.includes('/baemin-supabase-test/')) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
      }
      return response;
    }).catch(function() {
      // 네트워크 실패시 캐시에서 제공
      return caches.match(e.request).then(function(cached) {
        if (cached) return cached;
        // 네비게이션 요청이면 index.html 반환
        if (e.request.mode === 'navigate') {
          return caches.match('/baemin-supabase-test/index.html');
        }
        return new Response('offline', { status: 503 });
      });
    })
  );
});
