import { describe, it, expect } from 'vitest'
import { login, getMe, refreshToken } from '@/api/auth.api'
import { mockLoginResponse, mockUser } from '@/test/mocks/handlers'

describe('Auth API', () => {
  describe('login', () => {
    it('should return user data and tokens on successful login', async () => {
      const result = await login({ username: 'emilys', password: 'emilyspass' })

      expect(result.accessToken).toBe(mockLoginResponse.accessToken)
      expect(result.refreshToken).toBe(mockLoginResponse.refreshToken)
      expect(result.username).toBe('emilys')
      expect(result.email).toBe(mockLoginResponse.email)
    })

    it('should throw on invalid credentials', async () => {
      await expect(login({ username: 'wrong', password: 'wrong' })).rejects.toThrow()
    })
  })

  describe('getMe', () => {
    it('should return current user when valid token is provided', async () => {
      // This test expects getMe to use the token from storage/interceptor
      // The implementation should attach Bearer token via axios interceptor
      const result = await getMe()

      expect(result.id).toBe(mockUser.id)
      expect(result.username).toBe(mockUser.username)
      expect(result.email).toBe(mockUser.email)
    })
  })

  describe('refreshToken', () => {
    it('should return new tokens on valid refresh token', async () => {
      const result = await refreshToken('mock-refresh-token')

      expect(result.accessToken).toBe('new-mock-access-token')
      expect(result.refreshToken).toBe('new-mock-refresh-token')
    })

    it('should throw on invalid refresh token', async () => {
      await expect(refreshToken('invalid-token')).rejects.toThrow()
    })
  })
})
