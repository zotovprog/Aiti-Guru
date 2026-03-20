import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { AuthContext } from '@/context/auth.context'
import type { AuthContextType } from '@/context/auth.context'

function renderWithRouter(isAuthenticated: boolean, isLoading = false) {
  const authValue: AuthContextType = {
    user: isAuthenticated
      ? {
          id: 1,
          username: 'emilys',
          email: 'test@test.com',
          firstName: 'Emily',
          lastName: 'Johnson',
          gender: 'female',
          image: '',
        }
      : null,
    isAuthenticated,
    isLoading,
    login: vi.fn(),
    logout: vi.fn(),
  }

  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={['/products']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

describe('ProtectedRoute', () => {
  it('should render children when authenticated', () => {
    renderWithRouter(true)

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect to /login when not authenticated', () => {
    renderWithRouter(false)

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should show nothing or loading when auth is loading', () => {
    renderWithRouter(false, true)

    // Should not redirect while loading
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
