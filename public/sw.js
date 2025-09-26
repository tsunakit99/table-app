const CACHE_NAME = 'table-app-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/appicon-192x192.png',
  '/appicon-512x512.png'
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// Push event
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'No payload',
    icon: '/appicon-192x192.png',
    badge: '/appicon-192x192.png'
  }

  event.waitUntil(
    self.registration.showNotification('Table App', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow('/')
  )
})