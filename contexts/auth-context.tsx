"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authAPI, tokenStorage } from "@/lib/auth"

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getToken()
      if (token) {
        try {
          const userData = await authAPI.verifyToken(token)
          setUser(userData)
        } catch (error) {
          console.error("Token verification failed:", error)
          tokenStorage.removeToken()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    const { token, user } = await authAPI.login(username, password)
    tokenStorage.setToken(token)
    setUser(user)
  }

  const register = async (username: string, password: string) => {
    const { token, user } = await authAPI.register(username, password)
    tokenStorage.setToken(token)
    setUser(user)
  }

  const logout = () => {
    tokenStorage.removeToken()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
