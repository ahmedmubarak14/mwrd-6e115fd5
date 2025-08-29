// Enhanced service worker for PWA functionality
const CACHE_NAME = 'mwrd-cache-v2';
const STATIC_CACHE = 'mwrd-static-v2';
const DYNAMIC_CACHE = 'mwrd-dynamic-v2';
const IMAGE_CACHE = 'mwrd-images-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/register',
  '/manifest.json',
  '/offline.html'
];

// Cache strategies
const CACHE_STRATEGIES = {
  static: ['/', '/dashboard', '/login', '/register'],
  dynamic: ['/api/', '/supabase/'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  networkFirst: ['/api/', '/functions/'],
  cacheFirst: ['.js', '.css', '.woff', '.woff2']
};

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Pre-cache shell assets
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll([
          '/static/js/bundle.js',
          '/static/css/main.css'
        ].filter(Boolean));
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except for known APIs)
  if (url.origin !== location.origin && !url.hostname.includes('supabase')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    // Network first for API calls
    if (CACHE_STRATEGIES.networkFirst.some(pattern => pathname.includes(pattern))) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }

    // Cache first for static assets
    if (CACHE_STRATEGIES.cacheFirst.some(ext => pathname.includes(ext))) {
      return await cacheFirst(request, STATIC_CACHE);
    }

    // Image caching strategy
    if (CACHE_STRATEGIES.images.some(ext => pathname.includes(ext))) {
      return await cacheFirst(request, IMAGE_CACHE);
    }

    // Stale while revalidate for HTML pages
    if (request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request, STATIC_CACHE);
    }

    // Default: network first with cache fallback
    return await networkFirst(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('Service Worker: Fetch error:', error);
    
    // Return offline page for navigation requests
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlineResponse = await caches.match('/offline.html');
      return offlineResponse || new Response('Offline', { status: 503 });
    }

    // Return cached version or basic error response
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Network Error', { status: 503 });
  }
}

// Cache strategies implementation
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  // Always attempt to fetch from network in background
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);

  // Return cached version immediately if available
  if (cachedResponse) {
    // Update cache in background
    networkPromise;
    return cachedResponse;
  }

  // Wait for network if no cache available
  return await networkPromise;
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-messages') {
    event.waitUntil(syncMessages());
  }
  
  if (event.tag === 'background-uploads') {
    event.waitUntil(syncUploads());
  }
});

async function syncMessages() {
  // Implement message sync logic
  console.log('Service Worker: Syncing messages...');
}

async function syncUploads() {
  // Implement upload sync logic
  console.log('Service Worker: Syncing uploads...');
}

// Push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from MWRD',
    icon: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png',
    badge: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/lovable-uploads/9a6215a4-31ff-4f7d-a55b-1cbecc47ec33.png'
      }
    ],
    requireInteraction: false,
    tag: 'mwrd-notification'
  };

  event.waitUntil(
    self.registration.showNotification('MWRD', options)
  );
});

// Notification click handling  
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

// Handle app shortcuts
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded and ready');