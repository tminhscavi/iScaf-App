'use client'

import { useState, useEffect, useCallback } from 'react'

// Global interface extensions
declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

interface InstallPWAProps {
  className?: string
  children?: React.ReactNode
  onInstallSuccess?: () => void
  onInstallDismiss?: () => void
  onInstallError?: (error: Error) => void
  hideAfterInstall?: boolean
  showOnlyIfInstallable?: boolean
}

export default function InstallButton({
  className = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors flex items-center gap-2",
  children,
  onInstallSuccess,
  onInstallDismiss,
  onInstallError,
  hideAfterInstall = true,
  showOnlyIfInstallable = true
}: InstallPWAProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState<boolean>(false)
  const [isInstalling, setIsInstalling] = useState<boolean>(false)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)

  // Check if PWA is already installed
  const checkIfInstalled = useCallback((): boolean => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      // @ts-expect-error - This property exists on some browsers
      window.navigator.standalone === true
    )
  }, [])

  useEffect(() => {
    // Check initial installation state
    setIsInstalled(checkIfInstalled())

    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      
      if (!isInstalled) {
        setShowInstallButton(true)
      }
    }

    const appInstalledHandler = () => {
      setIsInstalled(true)
      if (hideAfterInstall) {
        setShowInstallButton(false)
      }
      setDeferredPrompt(null)
      onInstallSuccess?.()
    }

    // Listen for display mode changes
    const displayModeHandler = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches)
      if (e.matches && hideAfterInstall) {
        setShowInstallButton(false)
      }
    }

    const displayModeQuery = window.matchMedia('(display-mode: standalone)')
    
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler)
    window.addEventListener('appinstalled', appInstalledHandler)
    displayModeQuery.addEventListener('change', displayModeHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler)
      window.removeEventListener('appinstalled', appInstalledHandler)
      displayModeQuery.removeEventListener('change', displayModeHandler)
    }
  }, [isInstalled, hideAfterInstall, onInstallSuccess])

  const handleInstallClick = async (): Promise<void> => {
    if (!deferredPrompt || isInstalling) return

    setIsInstalling(true)

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      console.log(`PWA install prompt result: ${outcome}`)

      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        if (hideAfterInstall) {
          setShowInstallButton(false)
        }
        onInstallSuccess?.()
      } else {
        onInstallDismiss?.()
      }
    } catch (error) {
      const installError = error instanceof Error ? error : new Error('Installation failed')
      console.error('PWA installation error:', installError)
      onInstallError?.(installError)
    } finally {
      setIsInstalling(false)
    }
  }

  // Don't show if app is already installed and hideAfterInstall is true
  if (isInstalled && hideAfterInstall) {
    return null
  }

  // Don't show if showOnlyIfInstallable is true and no prompt is available
  if (showOnlyIfInstallable && !showInstallButton) {
    return null
  }

  // Default content based on state
  const getButtonContent = (): React.ReactNode => {
    if (isInstalling) {
      return (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Đang cài đặt...
        </>
      )
    }

    if (isInstalled) {
      return (
        <>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Đã cài đặt
        </>
      )
    }

    return (
      <>
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
        Tải app
      </>
    )
  }

  return (
    <button
      onClick={handleInstallClick}
      disabled={isInstalling || isInstalled}
      className={`${className} ${
        isInstalling || isInstalled ? 'opacity-75 cursor-not-allowed' : ''
      }`}
      aria-label={
        isInstalled
          ? 'Progressive Web App is installed'
          : 'Install Progressive Web App'
      }
    >
      {children || getButtonContent()}
    </button>
  )
}