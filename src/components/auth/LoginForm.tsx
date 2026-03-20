import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LockKeyhole, Mail, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/auth.context'
import { loginSchema } from '@/schemas/login.schema'
import type { LoginFormData } from '@/schemas/login.schema'

const ERROR_TRANSLATIONS: Record<string, string> = {
  'Invalid credentials': 'Неверное имя пользователя или пароль',
  'Username and password required': 'Введите имя пользователя и пароль',
  'Token expired': 'Сессия истекла, войдите снова',
  'Invalid/Expired Token!': 'Сессия истекла, войдите снова',
  'Network Error': 'Ошибка сети. Проверьте подключение к интернету',
}

function translateError(message: string): string {
  return ERROR_TRANSLATIONS[message] ?? message
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response

    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response &&
      typeof response.data === 'object' &&
      response.data !== null &&
      'message' in response.data &&
      typeof response.data.message === 'string'
    ) {
      return translateError(response.data.message)
    }
  }

  if (error instanceof Error && error.message) {
    return translateError(error.message)
  }

  return 'Не удалось выполнить вход'
}

export function LoginForm() {
  const { login } = useAuth()
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async ({ username, password }) => {
    setSubmitError(null)

    try {
      await login(username, password, rememberMe)
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    }
  })

  return (
    <form className="login-form" onSubmit={onSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="username">Логин</label>
        <div className="input-shell">
          <Mail size={18} />
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="test@mail.com"
            {...register('username')}
          />
          {watch('username') ? (
            <button
              type="button"
              className="input-shell__action"
              onClick={() => setValue('username', '')}
              aria-label="Очистить"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
        {errors.username ? <p role="alert">{errors.username.message}</p> : null}
      </div>

      <div className="form-field">
        <label htmlFor="password">Пароль</label>
        <div className="input-shell">
          <LockKeyhole size={18} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Введите пароль"
            {...register('password')}
          />
          <button
            type="button"
            className="input-shell__action"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password ? <p role="alert">{errors.password.message}</p> : null}
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
        />{' '}
        Запомнить данные
      </label>

      {submitError ? <p role="alert">{submitError}</p> : null}

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        Войти
      </button>
      <span className="login-form__separator">или</span>
      <span className="secondary-link">
        Нет аккаунта? <a href="#">Создать</a>
      </span>
    </form>
  )
}
