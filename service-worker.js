self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
  });
  
  self.addEventListener('fetch', event => {
    // You could cache assets here later
  });
  