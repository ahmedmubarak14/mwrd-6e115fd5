const CACHE_NAME = 'mwrd-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/messages',
  '/requests',
  '/offers',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((fetchResponse) => {
          // Don't cache non-GET requests or external resources
          if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
            return fetchResponse;
          }

          // Clone the response as it can only be consumed once
          const responseToCache = fetchResponse.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return fetchResponse;
        });
      })
      .catch(() => {
        // Fallback for offline pages
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync operations
      console.log('Background sync triggered')
    );
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from MWRD',
    icon: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png',
    badge: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MWRD Notification', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});