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

  return (
    <div className="space-y-4">
      <div>Status: {isOnline ? 'Online' : 'Offline'}</div>
      <div>Installed: {isInstalled ? 'Yes' : 'No'}</div>
      
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
        onClick={() => clearCache()}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Clear Cache
      </button>
    </div>
  )
}