const CACHE_NAME = 'thakho-tech-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Event - โหลดไฟล์สำคัญเก็บไว้ใน Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - ล้าง Cache เก่าทันทีที่มีการอัปเดต
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - ดึงจาก Network ก่อน ถ้าไม่มีเน็ตค่อยดึงจาก Cache
self.addEventListener('fetch', (event) => {
  // ข้ามการ Cache สำหรับ request ที่ไม่ใช่ GET หรือมาจาก domain อื่นที่เป็น API
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
