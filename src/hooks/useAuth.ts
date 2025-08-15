'use client'

import { api } from '@/utils/axios'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // useEffect(() => {
  //   checkAuth()
  // }, [])
  
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', {email, password})
    
    if (response) {
      // const data = await response.json()
      // setUser(data.user)
      router.push('/')
      return { success: true }
    } else {
      const error = await response.json()
      return { success: false, error: error.message }
    }
  }
  
  const logout = async () => {
  await api.post('/auth/logout')
    setUser(null)
    router.push('/login')
  }
  
  return { user, loading, login, logout, checkAuth }
}

