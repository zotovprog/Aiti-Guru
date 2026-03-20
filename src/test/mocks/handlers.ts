import { http, HttpResponse } from 'msw'

const API_BASE = 'https://dummyjson.com'

export const mockUser = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://dummyjson.com/icon/emilys/128',
}

export const mockLoginResponse = {
  ...mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
}

export const mockProduct = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  description: 'Popular mascara',
  category: 'beauty',
  price: 9.99,
  discountPercentage: 7.17,
  rating: 4.94,
  stock: 5,
  brand: 'Essence',
  sku: 'RCH45Q1A',
  weight: 2,
  dimensions: { width: 23.17, height: 14.43, depth: 28.01 },
  warrantyInformation: '1 month warranty',
  shippingInformation: 'Ships in 1 month',
  availabilityStatus: 'Low Stock',
  reviews: [],
  returnPolicy: '30 days return policy',
  minimumOrderQuantity: 24,
  meta: {
    createdAt: '2024-05-23T08:56:21.618Z',
    updatedAt: '2024-05-23T08:56:21.618Z',
    barcode: '9164035109868',
    qrCode: 'https://assets.dummyjson.com/public/qr-code.png',
  },
  images: [
    'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
  ],
  thumbnail:
    'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
  tags: ['beauty', 'mascara'],
}

export const mockProductsResponse = {
  products: [mockProduct],
  total: 194,
  skip: 0,
  limit: 20,
}

export const handlers = [
  // Auth: Login
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string }
    if (body.username === 'emilys' && body.password === 'emilyspass') {
      return HttpResponse.json(mockLoginResponse)
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),

  // Auth: Get current user
  http.get(`${API_BASE}/auth/me`, ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (auth === 'Bearer mock-access-token') {
      return HttpResponse.json(mockUser)
    }
    return HttpResponse.json({ message: 'Token expired' }, { status: 401 })
  }),

  // Auth: Refresh
  http.post(`${API_BASE}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string }
    if (body.refreshToken === 'mock-refresh-token') {
      return HttpResponse.json({
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token',
      })
    }
    return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 })
  }),

  // Products: List
  http.get(`${API_BASE}/products`, ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') || 20)
    const skip = Number(url.searchParams.get('skip') || 0)
    return HttpResponse.json({
      products: [mockProduct],
      total: 194,
      skip,
      limit,
    })
  }),

  // Products: Search
  http.get(`${API_BASE}/products/search`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') || ''
    const matchingProducts = q ? [mockProduct] : []
    return HttpResponse.json({
      products: matchingProducts,
      total: matchingProducts.length,
      skip: 0,
      limit: 20,
    })
  }),

  // Products: Add
  http.post(`${API_BASE}/products/add`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({
      ...mockProduct,
      ...body,
      id: 195,
    })
  }),
]
