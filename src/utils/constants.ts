export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com'

export const PAGE_SIZE = 20

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  REMEMBER_ME: 'rememberMe',
} as const
