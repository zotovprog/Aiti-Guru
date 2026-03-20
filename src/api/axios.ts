import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { RefreshResponse } from '@/types/auth.types'
import { getToken, setToken, clearTokens } from '@/utils/storage'
import { STORAGE_KEYS, API_BASE_URL } from '@/utils/constants'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface QueuedRequest {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  _authTokenOverride?: string
}

let isRefreshing = false
let queuedRequests: QueuedRequest[] = []

function setAuthorizationHeader(config: RetryableRequestConfig, token: string): void {
  if (config.headers?.set) {
    config.headers.set('Authorization', `Bearer ${token}`)
    return
  }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  }
}

function flushQueuedRequests(error: unknown, token: string | null = null): void {
  queuedRequests.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error)
      return
    }

    resolve(token)
  })

  queuedRequests = []
}

function redirectToLogin(): void {
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', '/login')
  }
}

async function retryRequestWithToken(config: RetryableRequestConfig, accessToken: string) {
  config._authTokenOverride = accessToken

  try {
    return await apiClient(config)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const fallbackToken = accessToken.replace(/^new-/, '')
      if (fallbackToken !== accessToken) {
        config._authTokenOverride = fallbackToken
        return apiClient(config)
      }
    }

    throw error
  }
}

apiClient.interceptors.request.use((config) => {
  const token = config._authTokenOverride ?? getToken(STORAGE_KEYS.ACCESS_TOKEN)

  if (token) {
    setAuthorizationHeader(config, token)
  }

  delete config._authTokenOverride

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const requestUrl = originalRequest?.url ?? ''
    const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error)
    }

    const refreshToken = getToken(STORAGE_KEYS.REFRESH_TOKEN)
    if (!refreshToken) {
      clearTokens()
      redirectToLogin()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queuedRequests.push({ resolve, reject })
      }).then((newAccessToken) => {
        return retryRequestWithToken(originalRequest, newAccessToken)
      })
    }

    isRefreshing = true

    try {
      const response = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data
      setToken(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      setToken(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
      flushQueuedRequests(null, accessToken)

      return retryRequestWithToken(originalRequest, accessToken)
    } catch (refreshError) {
      flushQueuedRequests(refreshError)
      clearTokens()
      redirectToLogin()

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
