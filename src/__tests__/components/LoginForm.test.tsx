import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthContext } from '@/context/auth.context'
import type { AuthContextType } from '@/context/auth.context'

function renderWithAuth(loginMock = vi.fn()) {
  const authValue: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: loginMock,
    logout: vi.fn(),
  }

  return {
    loginMock,
    ...render(
      <AuthContext.Provider value={authValue}>
        <LoginForm />
      </AuthContext.Provider>,
    ),
  }
}

describe('LoginForm', () => {
  it('should render email and password fields', () => {
    renderWithAuth()

    expect(screen.getByLabelText(/логин/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument()
  })

  it('should render "Войти" button', () => {
    renderWithAuth()

    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
  })

  it('should render "Запомнить данные" checkbox', () => {
    renderWithAuth()

    expect(screen.getByLabelText(/запомнить/i)).toBeInTheDocument()
  })

  it('should render "Создать" link as stub', () => {
    renderWithAuth()

    const link = screen.getByText(/создать/i)
    expect(link).toBeInTheDocument()
  })

  it('should show validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    renderWithAuth()

    await user.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      const errors = screen.getAllByText(/обязательно/i)
      expect(errors.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('should call login with form data on valid submit', async () => {
    const user = userEvent.setup()
    const loginMock = vi.fn().mockResolvedValue(undefined)
    renderWithAuth(loginMock)

    await user.type(screen.getByLabelText(/логин/i), 'emilys')
    await user.type(screen.getByLabelText('Пароль'), 'emilyspass')
    await user.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('emilys', 'emilyspass', false)
    })
  })

  it('should pass rememberMe=true when checkbox is checked', async () => {
    const user = userEvent.setup()
    const loginMock = vi.fn().mockResolvedValue(undefined)
    renderWithAuth(loginMock)

    await user.type(screen.getByLabelText(/логин/i), 'emilys')
    await user.type(screen.getByLabelText('Пароль'), 'emilyspass')
    await user.click(screen.getByLabelText(/запомнить/i))
    await user.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('emilys', 'emilyspass', true)
    })
  })

  it('should clear username when clear button is clicked', async () => {
    const user = userEvent.setup()
    renderWithAuth()

    const usernameInput = screen.getByLabelText(/логин/i)
    await user.type(usernameInput, 'emilys')
    expect(usernameInput).toHaveValue('emilys')

    const clearButton = screen.getByRole('button', { name: /очистить/i })
    await user.click(clearButton)

    expect(usernameInput).toHaveValue('')
  })

  it('should not show clear button when username is empty', () => {
    renderWithAuth()

    expect(screen.queryByRole('button', { name: /очистить/i })).not.toBeInTheDocument()
  })

  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    renderWithAuth()

    const passwordInput = screen.getByLabelText('Пароль')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button', { name: /показать пароль/i })
    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /скрыть пароль/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /скрыть пароль/i }))

    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should display API error message on login failure', async () => {
    const user = userEvent.setup()
    const loginMock = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
    renderWithAuth(loginMock)

    await user.type(screen.getByLabelText(/логин/i), 'wrong')
    await user.type(screen.getByLabelText('Пароль'), 'wrong')
    await user.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(screen.getByText(/неверное имя пользователя или пароль/i)).toBeInTheDocument()
    })
  })
})
