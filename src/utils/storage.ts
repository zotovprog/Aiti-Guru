import { STORAGE_KEYS } from './constants'

export function getStorage(): Storage {
  const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
  return rememberMe ? localStorage : sessionStorage
}

export function setRememberMe(value: boolean): void {
  localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, String(value))
}

export function getToken(key: string): string | null {
  return getStorage().getItem(key)
}

export function setToken(key: string, value: string): void {
  getStorage().setItem(key, value)
}

export function removeToken(key: string): void {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

export function clearTokens(): void {
  removeToken(STORAGE_KEYS.ACCESS_TOKEN)
  removeToken(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
}
