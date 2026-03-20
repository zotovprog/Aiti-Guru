import { describe, it, expect, beforeEach } from 'vitest'
import { STORAGE_KEYS } from '@/utils/constants'

describe('Axios interceptors', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('Request interceptor', () => {
    it('should attach Authorization header when token exists in localStorage', async () => {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'mock-access-token')

      // Import apiClient after setting storage
      const { apiClient } = await import('@/api/axios')

      // The interceptor should read the token and attach it
      // We verify this by making a request to /auth/me which requires auth
      const response = await apiClient.get('/auth/me')
      expect(response.data.username).toBe('emilys')
    })

    it('should attach Authorization header when token exists in sessionStorage', async () => {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'false')
      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'mock-access-token')

      const { apiClient } = await import('@/api/axios')

      const response = await apiClient.get('/auth/me')
      expect(response.data.username).toBe('emilys')
    })
  })

  describe('Response interceptor (401 refresh)', () => {
    it('should refresh token and retry request on 401', async () => {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'expired-token')
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'mock-refresh-token')

      const { apiClient } = await import('@/api/axios')

      // First request will fail with 401 (expired token)
      // Interceptor should refresh and retry with new token
      const response = await apiClient.get('/auth/me')
      expect(response.data.username).toBe('emilys')

      // Verify new token was saved
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('new-mock-access-token')
    })
  })
})
