import { Navigate } from 'react-router'
import logoSvg from '@/assets/logo.svg'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { useAuth } from '@/context/auth.context'

export function LoginPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  return (
    <AuthLayout>
      <div className="login-page">
        <div className="login-page__logo" aria-hidden="true">
          <img src={logoSvg} alt="" width={35} height={34} />
        </div>
        <h1>Добро пожаловать!</h1>
        <p>Пожалуйста, авторизуйтесь</p>
        <LoginForm />
      </div>
    </AuthLayout>
  )
}
