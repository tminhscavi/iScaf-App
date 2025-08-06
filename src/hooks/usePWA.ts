/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState, useCallback } from 'react'

interface PWAState {
  isOnline: boolean
  isInstalled: boolean
  updateAvailable: boolean
  registration: ServiceWorkerRegistration | null
  notificationPermission: NotificationPermission
}

interface QueuedAction {
  id?: number
  url: string
  method: string
  headers: Record<string, string>
  body?: string
  timestamp: number
}

export function useNextPWA() {
  const [state, setState] = useState<PWAState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isInstalled: false,
    updateAvailable: false,
    registration: null,
    notificationPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default'
  })

  const updateState = useCallback((updates: Partial<PWAState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Check if PWA is installed
  const checkInstallStatus = useCallback(() => {
    if (typeof window === 'undefined') return false
    
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      // @ts-expect-error
      window.navigator.standalone === true
    )
  }, [])

  // Initialize PWA state
  useEffect(() => {
    if (typeof window === 'undefined') return

    const isInstalled = checkInstallStatus()
    updateState({ isInstalled })

    // Get service worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        updateState({ registration })
        
        // Check for updates
        if (registration.waiting) {
          updateState({ updateAvailable: true })
        }
      })

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          updateState({ updateAvailable: true })
        }
      })
    }

    // Listen for online/offline events
    const handleOnline = () => updateState({ isOnline: true })
    const handleOffline = () => updateState({ isOnline: false })
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for display mode changes (install/uninstall)
    const displayModeQuery = window.matchMedia('(display-mode: standalone)')
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      updateState({ isInstalled: e.matches })
    }
    
    displayModeQuery.addEventListener('change', handleDisplayModeChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      displayModeQuery.removeEventListener('change', handleDisplayModeChange)
    }
  }, [checkInstallStatus, updateState])

  // Update service worker
  const updateServiceWorker = useCallback(async () => {
    if (!state.registration?.waiting) return

    // Send message to waiting service worker to skip waiting
    state.registration.waiting.postMessage({ type: 'SKIP_WAITING' })

    // Listen for controller change and reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }, [state.registration])

  // Request notification permission
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    updateState({ notificationPermission: permission })
    return permission
  }, [updateState])

  // Show notification
  const showNotification = useCallback(async (
    title: string,
    options: NotificationOptions = {}
  ) => {
    if (!state.registration) {
      throw new Error('Service Worker not registered')
    }

    if (state.notificationPermission !== 'granted') {
      throw new Error('Notification permission not granted')
    }

    return state.registration.showNotification(title, {
      icon: '/icons/icon-72x72.png',
      badge: '/icons/icon-48x48.png',
      ...options
    })
  }, [state.registration, state.notificationPermission])

  // Queue action for background sync
  const queueBackgroundSync = useCallback(async (action: Omit<QueuedAction, 'timestamp'>) => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported')
    }

    const sw = await navigator.serviceWorker.ready
    sw.active?.postMessage({
      type: 'QUEUE_BACKGROUND_SYNC',
      payload: {
        ...action,
        timestamp: Date.now()
      }
    })
  }, [])

  // Offline-first fetch with background sync fallback
  const offlineFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response
    } catch (error) {
      // If offline, queue for background sync
      if (!state.isOnline) {
        await queueBackgroundSync({
          url,
          method: options.method || 'GET',
          headers: (options.headers as Record<string, string>) || {},
          body: options.body as string,
        })
        
        throw new Error('Request queued for background sync')
      }
      
      throw error
    }
  }, [state.isOnline, queueBackgroundSync])

  // Get cached data
  const getCachedData = useCallback(async (cacheName: string, url: string) => {
    if (!('caches' in window)) return null

    try {
      const cache = await caches.open(cacheName)
      const response = await cache.match(url)
      
      if (response) {
        return response.json()
      }
      
      return null
    } catch (error) {
      console.error('Error getting cached data:', error)
      return null
    }
  }, [])

  // Cache data
  const cacheData = useCallback(async (
    cacheName: string,
    url: string,
    data: unknown
  ) => {
    if (!('caches' in window)) return

    try {
      const cache = await caches.open(cacheName)
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      })
      
      await cache.put(url, response)
    } catch (error) {
      console.error('Error caching data:', error)
    }
  }, [])

  // Clear cache
  const clearCache = useCallback(async (cacheName?: string) => {
    if (!('caches' in window)) return

    try {
      if (cacheName) {
        await caches.delete(cacheName)
      } else {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }, [])

  return {
    // State
    ...state,
    
    // Actions
    updateServiceWorker,
    requestNotificationPermission,
    showNotification,
    queueBackgroundSync,
    offlineFetch,
    getCachedData,
    cacheData,
    clearCache,
  }
}