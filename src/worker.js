// This file will be merged with the generated service worker

// Custom push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const data = event.data?.json() || {}
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/icon-192x192.png',
    image: data.image,
    vibrate: data.vibrate || [100, 50, 100],
    tag: data.tag || 'default',
    renotify: data.renotify || false,
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    data: data.data || {},
    actions: data.actions || [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'PWA Notification',
      options
    )
  )
})

// Custom notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Get queued actions from IndexedDB
    const db = await openDB()
    const transaction = db.transaction(['syncQueue'], 'readonly')
    const store = transaction.objectStore('syncQueue')
    const queuedItems = await store.getAll()

    // Process each queued item
    for (const item of queuedItems) {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body
        })
        
        // Remove from queue on success
        const deleteTransaction = db.transaction(['syncQueue'], 'readwrite')
        const deleteStore = deleteTransaction.objectStore('syncQueue')
        await deleteStore.delete(item.id)
        
        console.log('Background sync completed for:', item.url)
      } catch (error) {
        console.error('Background sync failed for:', item.url, error)
      }
    }
  } catch (error) {
    console.error('Background sync error:', error)
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PWAOfflineDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('syncQueue')) {
        const store = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

// Custom message handling
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' })
    return
  }
  
  if (event.data && event.data.type === 'QUEUE_BACKGROUND_SYNC') {
    event.waitUntil(queueBackgroundSync(event.data.payload))
    return
  }
})

// Queue item for background sync
async function queueBackgroundSync(payload) {
  try {
    const db = await openDB()
    const transaction = db.transaction(['syncQueue'], 'readwrite')
    const store = transaction.objectStore('syncQueue')
    
    await store.add({
      ...payload,
      timestamp: Date.now()
    })
    
    // Register background sync
    await self.registration.sync.register('background-sync')
    
    console.log('Item queued for background sync:', payload)
  } catch (error) {
    console.error('Failed to queue background sync:', error)
  }
}