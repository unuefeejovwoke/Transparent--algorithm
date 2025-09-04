"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, authStorage } from "@/lib/auth"

interface AuthContextType extends AuthState {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    const currentUser = authStorage.getCurrentUser()
    setAuthState({
      user: currentUser,
      isLoading: false,
    })
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = authStorage.validateLogin(email, password)
    if (user) {
      authStorage.setCurrentUser(user.id)
      setAuthState({ user, isLoading: false })
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const existingUsers = authStorage.getUsers()
      if (existingUsers.some((u) => u.email === email)) {
        return false
      }
      const user = authStorage.createUser(email, password, name)
      authStorage.setCurrentUser(user.id)
      setAuthState({ user, isLoading: false })
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    authStorage.setCurrentUser(null)
    setAuthState({ user: null, isLoading: false })
  }

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return
    const updatedUser = { ...authState.user, ...updates }
    authStorage.saveUser(updatedUser)
    setAuthState({ ...authState, user: updatedUser })
  }

  const value: AuthContextType = {
    ...authState,
    isAuthenticated: !!authState.user,
    login,
    signup,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
