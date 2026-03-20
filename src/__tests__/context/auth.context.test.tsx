import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/context/auth.context'
import { STORAGE_KEYS } from '@/utils/constants'

function TestConsumer({ rememberMe = true }: { rememberMe?: boolean } = {}) {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="username">{user?.username ?? 'none'}</span>
      <button onClick={() => login('emilys', 'emilyspass', rememberMe)}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('should start with no user and not authenticated', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false')
      expect(screen.getByTestId('username').textContent).toBe('none')
    })
  })

  it('should authenticate user after login', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByText('Login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
      expect(screen.getByTestId('username').textContent).toBe('emilys')
    })
  })

  it('should save tokens to localStorage when rememberMe is true', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByText('Login').click()
    })

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)).toBe('true')
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeTruthy()
    })
  })

  it('should clear user and tokens after logout', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByText('Login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
    })

    await act(async () => {
      screen.getByText('Logout').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('false')
      expect(screen.getByTestId('username').textContent).toBe('none')
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull()
    })
  })

  it('should save tokens to sessionStorage when rememberMe is false', async () => {
    render(
      <AuthProvider>
        <TestConsumer rememberMe={false} />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByText('Login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
    })

    expect(localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)).toBe('false')
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull()
    expect(sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeTruthy()
  })

  it('should restore session from storage on mount', async () => {
    // Pre-fill storage with valid tokens
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'mock-access-token')
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'mock-refresh-token')

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
      expect(screen.getByTestId('username').textContent).toBe('emilys')
    })
  })
})
