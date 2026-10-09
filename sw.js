// 서비스워커 비활성화 - 긴급 복구용
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.registration.unregister();
    })
  );
});
self.addEventListener('fetch', function(e) {
  // 모든 요청을 네트워크로 통과 (캐시 사용 안 함)
  return;
});
