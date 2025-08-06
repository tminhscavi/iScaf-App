// Simple service worker registration utility

export interface SWConfig {
  swUrl?: string
  scope?: string
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: Error) => void
}

export async function registerSW({
  swUrl = 'src/worker.js',
  scope = '/',
  onSuccess,
  onUpdate,
  onError
}: SWConfig = {}): Promise<ServiceWorkerRegistration | null> {
  
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported')
    return null
  }

  // Don't register in development (unless explicitly needed)
  if (process.env.NODE_ENV === 'development') {
    console.log('Skipping SW registration in development')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register(swUrl, { 
      scope,
      updateViaCache: 'none'
    })

    console.log('Service Worker registered:', registration.scope)

    // Handle successful registration
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing
      if (!installingWorker) return

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New content is available
            console.log('New content is available; please refresh.')
            onUpdate?.(registration)
          } else {
            // Content is cached for the first time
            console.log('Content is cached for offline use.')
            onSuccess?.(registration)
          }
        }
      })
    })

    // Check for existing waiting worker
    if (registration.waiting) {
      onUpdate?.(registration)
    }

    // Check for updates periodically
    setInterval(() => {
      registration.update()
    }, 60000) // Check every minute

    return registration

  } catch (error) {
    const err = error as Error
    console.error('Service Worker registration failed:', err)
    onError?.(err)
    return null
  }
}

export async function unregisterSW(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const result = await registration.unregister()
    console.log('Service Worker unregistered:', result)
    return result
  } catch (error) {
    console.error('Service Worker unregistration failed:', error)
    return false
  }
}

export function isSwSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator
}

export function isSwRegistered(): Promise<boolean> {
  if (!isSwSupported()) return Promise.resolve(false)
  
  return navigator.serviceWorker.getRegistration()
    .then(registration => !!registration)
    .catch(() => false)
}

// Auto-register function for use in _app.tsx or layout.tsx
export function autoRegisterSW(config?: SWConfig) {
  if (typeof window === 'undefined') return

  // Wait for the page to load
  if (document.readyState === 'loading') {
    window.addEventListener('load', () => registerSW(config))
  } else {
    registerSW(config)
  }
}