/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { LoginResponse, User } from '@/types/auth.types'
import { login as apiLogin, getMe } from '@/api/auth.api'
import { setRememberMe, clearTokens, getToken } from '@/utils/storage'
import { STORAGE_KEYS } from '@/utils/constants'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function mapLoginResponseToUser(response: LoginResponse): User {
  return {
    id: response.id,
    username: response.username,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    gender: response.gender,
    image: response.image,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback(async (username: string, password: string, rememberMe: boolean) => {
    setIsLoading(true)

    try {
      setRememberMe(rememberMe)
      const response = await apiLogin({ username, password })

      setUser(mapLoginResponseToUser(response))
      setIsAuthenticated(true)
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    setIsAuthenticated(false)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function restoreSession() {
      const token = getToken(STORAGE_KEYS.ACCESS_TOKEN)

      if (!token) {
        if (isMounted) {
          setIsLoading(false)
        }
        return
      }

      try {
        const currentUser = await getMe()

        if (!isMounted) {
          return
        }

        setUser(currentUser)
        setIsAuthenticated(true)
      } catch {
        clearTokens()

        if (!isMounted) {
          return
        }

        setUser(null)
        setIsAuthenticated(false)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
