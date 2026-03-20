import { ConfigProvider } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { AuthProvider } from '@/context/auth.context'
import { LoginPage } from '@/pages/LoginPage'
import { ProductsPage } from '@/pages/ProductsPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#4339F2',
            borderRadius: 14,
            fontFamily: '"Manrope", "SF Pro Display", "Segoe UI", sans-serif',
          },
          components: {
            Button: {
              fontWeight: 600,
            },
            Input: {
              activeBorderColor: '#4339F2',
              hoverBorderColor: '#4339F2',
            },
            Table: {
              headerBg: '#F6F7FB',
              headerColor: '#606A85',
            },
          },
        }}
      >
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
