/* ==========================================
   BLOOM & BLOSSOM - SERVICE WORKER
   Progressive Web App Offline Support
   ========================================== */

const CACHE_NAME = 'bloom-blossom-v1';
const STATIC_CACHE = 'bloom-static-v1';
const DYNAMIC_CACHE = 'bloom-dynamic-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/products.html',
    '/cart.html',
    '/styles.css',
    '/main.js',
    '/manifest.json',
    '/images/flower1.png',
    '/images/flower2.png',
    '/images/flower3.png',
    '/images/flower4.png',
    '/images/flower5.png',
    '/images/flower6.png',
    '/images/hero.png',
    '/images/icon-192.png',
    '/images/icon-512.png'
];

// External resources to cache
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Cache failed:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => {
                            return name !== STATIC_CACHE && name !== DYNAMIC_CACHE;
                        })
                        .map((name) => {
                            console.log('[Service Worker] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch Event - Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached response if found
                if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache:', request.url);
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(request)
                    .then((networkResponse) => {
                        // Don't cache if not a valid response
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        // Clone the response
                        const responseClone = networkResponse.clone();

                        // Cache the fetched response
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.log('[Service Worker] Fetch failed:', error);

                        // Return offline fallback for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }

                        // Return a placeholder for images
                        if (request.destination === 'image') {
                            return new Response(
                                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#f8d7e0" width="200" height="200"/><text fill="#e8a4b8" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="40">🌸</text></svg>',
                                { headers: { 'Content-Type': 'image/svg+xml' } }
                            );
                        }
                    });
            })
    );
});

// Background Sync - For future order submission
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);

    if (event.tag === 'sync-cart') {
        event.waitUntil(syncCart());
    }
});

// Push Notifications - For order updates
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received');

    const options = {
        body: event.data ? event.data.text() : 'New update from Bloom & Blossom!',
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'explore', title: 'Shop Now', icon: '/images/icon-192.png' },
            { action: 'close', title: 'Close', icon: '/images/icon-192.png' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Bloom & Blossom 🌸', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked');
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/products.html')
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper function for cart sync
async function syncCart() {
    try {
        // This would sync cart data with server when online
        console.log('[Service Worker] Syncing cart...');
    } catch (error) {
        console.error('[Service Worker] Cart sync failed:', error);
    }
}
