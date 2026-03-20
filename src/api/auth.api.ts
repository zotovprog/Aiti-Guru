import { apiClient } from './axios'
import { setToken } from '@/utils/storage'
import { STORAGE_KEYS } from '@/utils/constants'
import type { LoginRequest, LoginResponse, User, RefreshResponse } from '@/types/auth.types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data)
  setToken(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken)
  setToken(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken)
  return response.data
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}

export async function refreshToken(token: string): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken: token })
  setToken(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken)
  setToken(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken)
  return response.data
}
