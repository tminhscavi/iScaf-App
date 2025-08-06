// components/PWAFeatures.tsx
'use client'

import { useNextPWA } from "@/hooks/usePWA"



export default function PWAFeatures() {
  const {
    isOnline,
    isInstalled,
    updateAvailable,
    updateServiceWorker,
    requestNotificationPermission,
    showNotification,
    offlineFetch,
    clearCache
  } = useNextPWA()

  const handleNotification = async () => {
    try {
      await requestNotificationPermission()
      await showNotification('Hello!', {
        body: 'This is a test notification',
        tag: 'test'
      })
    } catch (error) {
      console.error('Notification error:', error)
    }
  }

  const handleOfflineRequest = async () => {
    try {
      const response = await offlineFetch('/api/data')
      console.log('Response:', await response.json())
    } catch (error) {
      console.log('Request queued for when online')
    }
  }

  return (
    <div className="space-y-4">
      <div>Status: {isOnline ? '🟢 Online' : '🔴 Offline'}</div>
      <div>Installed: {isInstalled ? '✅ Yes' : '❌ No'}</div>
      
      {updateAvailable && (
        <button 
          onClick={updateServiceWorker}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Available - Click to Update
        </button>
      )}
      
      <button 
        onClick={handleNotification}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Test Notification
      </button>
      
      <button 
        onClick={handleOfflineRequest}
        className="bg-purple-500 text-white px-4 py-2 rounded"
      >
        Make Offline Request
      </button>
      
      <button 
        onClick={() => clearCache()}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Clear Cache
      </button>
    </div>
  )
}