self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW activo');
});

self.addEventListener('fetch', (event) => {});
