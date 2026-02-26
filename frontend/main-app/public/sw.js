// MANAS360 Service Worker v1.0.0

// Offline-First Strategy for Mental Health Support

const CACHE_VERSION = 'manas360-v1.0.0';

const STATIC_CACHE = `${CACHE_VERSION}-static`;

const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const OFFLINE_CACHE = `${CACHE_VERSION}-offline`;

// Assets to cache immediately on install

const STATIC_ASSETS = [

  '/',

  '/index.html',

  '/offline.html',

  '/manifest.json',

  '/css/main.css',

  '/css/accessibility.css',

  '/js/app.js',

  '/js/offline-manager.js',

  '/js/accessibility.js',

  '/icons/icon-192x192.png',

  '/icons/icon-512x512.png',

  '/fonts/hindi.woff2',

  '/fonts/kannada.woff2',

  '/fonts/telugu.woff2',

  '/fonts/tamil.woff2',

  // Offline-available pages

  '/mood-checkin',

  '/journal',

  '/breathing-exercise',

  '/crisis',

  '/meditation-library',

  '/assessments/phq9',

  '/assessments/gad7',

];

// API routes to cache with network-first strategy

const API_CACHE_ROUTES = [

  '/api/v1/users/me',

  '/api/v1/subscriptions/current',

  '/api/v1/subscriptions/plans',

  '/api/v1/themed-rooms/themes',

];

// Routes that MUST be online (never cache)

const NETWORK_ONLY_ROUTES = [

  '/api/v1/auth/',

  '/api/v1/payments/',

];

// ============================================

// SERVICE WORKER LIFECYCLE

// ============================================

// Install: Cache static assets

self.addEventListener('install', (event) => {

  console.log('[SW] Installing Service Worker...');

  

  event.waitUntil(

    caches.open(STATIC_CACHE)

      .then((cache) => {

        console.log('[SW] Caching static assets');

        return cache.addAll(STATIC_ASSETS);

      })

      .then(() => {

        console.log('[SW] Static assets cached successfully');

        return self.skipWaiting();

      })

      .catch((error) => {

        console.error('[SW] Failed to cache static assets:', error);

      })

  );

});

// Activate: Clean old caches

self.addEventListener('activate', (event) => {

  console.log('[SW] Activating Service Worker...');

  

  event.waitUntil(

    caches.keys()

      .then((cacheNames) => {

        return Promise.all(

          cacheNames

            .filter((name) => name.startsWith('manas360-') && name !== CACHE_VERSION)

            .map((name) => {

              console.log('[SW] Deleting old cache:', name);

              return caches.delete(name);

            })

        );

      })

      .then(() => {

        console.log('[SW] Service Worker activated');

        return self.clients.claim();

      })

  );

});

// ============================================

// FETCH STRATEGIES

// ============================================

self.addEventListener('fetch', (event) => {

  const { request } = event;

  const url = new URL(request.url);

  // Skip non-GET requests

  if (request.method !== 'GET') {

    return;

  }

  // Skip chrome-extension and other non-http(s) requests

  if (!url.protocol.startsWith('http')) {

    return;

  }

  // Network-only routes (auth, payments, video)

  if (NETWORK_ONLY_ROUTES.some(route => url.pathname.startsWith(route))) {

    event.respondWith(networkOnly(request));

    return;

  }

  // API routes: Network-first, fallback to cache

  if (url.pathname.startsWith('/api/v1/')) {

    event.respondWith(networkFirst(request));

    return;

  }

  // Static assets: Cache-first

  if (isStaticAsset(url.pathname)) {

    event.respondWith(cacheFirst(request));

    return;

  }

  // HTML pages: Stale-while-revalidate

  if (request.headers.get('accept')?.includes('text/html')) {

    event.respondWith(staleWhileRevalidate(request));

    return;

  }

  // Default: Network-first

  event.respondWith(networkFirst(request));

});

// ============================================

// CACHING STRATEGIES

// ============================================

// Cache First: For static assets

async function cacheFirst(request) {

  const cachedResponse = await caches.match(request);

  if (cachedResponse) {

    return cachedResponse;

  }

  

  try {

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {

      const cache = await caches.open(STATIC_CACHE);

      cache.put(request, networkResponse.clone());

    }

    return networkResponse;

  } catch (error) {

    return caches.match('/offline.html');

  }

}

// Network First: For API calls

async function networkFirst(request) {

  try {

    const networkResponse = await fetch(request);

    

    if (networkResponse.ok) {

      const cache = await caches.open(DYNAMIC_CACHE);

      cache.put(request, networkResponse.clone());

    }

    

    return networkResponse;

  } catch (error) {

    console.log('[SW] Network failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);

    

    if (cachedResponse) {

      return cachedResponse;

    }

    

    // Return offline data structure for API calls

    if (request.url.includes('/api/v1/')) {

      return new Response(

        JSON.stringify({

          offline: true,

          message: 'You are offline. Data will sync when connected.',

          cached_at: null

        }),

        {

          status: 200,

          headers: { 'Content-Type': 'application/json' }

        }

      );

    }

    

    return caches.match('/offline.html');

  }

}

// Network Only: For sensitive routes

async function networkOnly(request) {

  try {

    return await fetch(request);

  } catch (error) {

    return new Response(

      JSON.stringify({

        error: 'This feature requires an internet connection.',

        offline: true

      }),

      {

        status: 503,

        headers: { 'Content-Type': 'application/json' }

      }

    );

  }

}

// Stale While Revalidate: For HTML pages

async function staleWhileRevalidate(request) {

  const cache = await caches.open(DYNAMIC_CACHE);

  const cachedResponse = await cache.match(request);

  

  const fetchPromise = fetch(request)

    .then((networkResponse) => {

      if (networkResponse.ok) {

        cache.put(request, networkResponse.clone());

      }

      return networkResponse;

    })

    .catch(() => cachedResponse || caches.match('/offline.html'));

  

  return cachedResponse || fetchPromise;

}

// ============================================

// HELPER FUNCTIONS

// ============================================

function isStaticAsset(pathname) {

  const staticExtensions = [

    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', 

    '.woff', '.woff2', '.ttf', '.eot', '.ico', '.webp', '.mp3', '.wav'

  ];

  return staticExtensions.some(ext => pathname.endsWith(ext));

}

// ============================================

// BACKGROUND SYNC

// ============================================

self.addEventListener('sync', (event) => {

  console.log('[SW] Background sync event:', event.tag);

  

  if (event.tag === 'sync-mood-entries') {

    event.waitUntil(syncMoodEntries());

  }

  

  if (event.tag === 'sync-journal-entries') {

    event.waitUntil(syncJournalEntries());

  }

  

  if (event.tag === 'sync-assessments') {

    event.waitUntil(syncAssessments());

  }

});

async function syncMoodEntries() {

  console.warn('[SW] sync-mood-entries disabled: legacy endpoint removed during /api/v1 contract lock');

}

async function syncJournalEntries() {

  console.warn('[SW] sync-journal-entries disabled: legacy endpoint removed during /api/v1 contract lock');

}

async function syncAssessments() {

  console.warn('[SW] sync-assessments disabled: legacy endpoint removed during /api/v1 contract lock');

}

// ============================================

// PUSH NOTIFICATIONS

// ============================================

self.addEventListener('push', (event) => {

  console.log('[SW] Push notification received');

  

  let data = {

    title: 'MANAS360',

    body: 'You have a new notification',

    icon: '/icons/icon-192x192.png',

    badge: '/icons/badge-72x72.png'

  };

  

  if (event.data) {

    data = { ...data, ...event.data.json() };

  }

  

  const options = {

    body: data.body,

    icon: data.icon,

    badge: data.badge,

    vibrate: [100, 50, 100],

    data: {

      url: data.url || '/',

      dateOfArrival: Date.now()

    },

    actions: data.actions || [

      { action: 'open', title: 'Open' },

      { action: 'dismiss', title: 'Dismiss' }

    ]

  };

  

  event.waitUntil(

    self.registration.showNotification(data.title, options)

  );

});

self.addEventListener('notificationclick', (event) => {

  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  

  if (event.action === 'dismiss') {

    return;

  }

  

  event.waitUntil(

    clients.openWindow(event.notification.data.url || '/')

  );

});

// ============================================

// INDEXED DB HELPER

// ============================================

function openIndexedDB() {

  return new Promise((resolve, reject) => {

    const request = indexedDB.open('MANAS360_Offline', 1);

    

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {

      const db = request.result;

      resolve({

        getAll: (store) => {

          return new Promise((res, rej) => {

            const tx = db.transaction(store, 'readonly');

            const req = tx.objectStore(store).getAll();

            req.onsuccess = () => res(req.result);

            req.onerror = () => rej(req.error);

          });

        },

        delete: (store, key) => {

          return new Promise((res, rej) => {

            const tx = db.transaction(store, 'readwrite');

            const req = tx.objectStore(store).delete(key);

            req.onsuccess = () => res();

            req.onerror = () => rej(req.error);

          });

        }

      });

    };

  });

}
