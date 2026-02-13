self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === 'POST' && url.pathname === '/share') {
    event.respondWith((async () => {
      try {
        const formData = await event.request.formData();
        const imageFile = formData.get('image');
        
        // Get all clients
        const clients = await self.clients.matchAll({
          includeUncontrolled: true,
          type: 'window',
        });

        // Find the client for the share page, or the first client
        let targetClient = clients.find(c => c.url.endsWith('/share'));
        if (!targetClient && clients.length > 0) {
            targetClient = clients[0];
        }

        if (targetClient && imageFile) {
          // Send the file to the client
          targetClient.postMessage({ file: imageFile, url: '/share' });
        }
      } catch (e) {
        console.error('Service Worker error:', e);
      }
      
      // Redirect to the share page so the user sees the UI
      return Response.redirect('/share', 303);
    })());
  }
});

// Basic service worker lifecycle
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});
